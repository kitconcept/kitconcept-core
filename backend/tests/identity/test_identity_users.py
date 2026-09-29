from kitconcept.core.utils import users as utils
from pas.plugins.identity.core.interfaces import IUserProfile
from plone import api
from plone.app.testing import TEST_USER_PASSWORD

import pytest


@pytest.fixture
def create_user(portal):
    def func(username: str = "jdoe", fullname: str = "John Doe"):
        with api.env.adopt_roles(["Manager"]):
            return api.user.create(
                email=f"{username}@example.com",
                username=username,
                password=TEST_USER_PASSWORD,
                properties={"fullname": fullname},
            )

    return func


@pytest.fixture
def create_source_user(portal):
    """Create a user in source_users only, as on a site before the upgrade."""

    def func(userid: str = "legacy", fullname: str = "Ada Lovelace"):
        portal.acl_users.source_users.addUser(userid, userid, TEST_USER_PASSWORD)
        user = api.user.get(userid=userid)
        user.setMemberProperties({
            "fullname": fullname,
            "email": f"{userid}@example.com",
        })
        return userid

    return func


class TestUserAsPerson:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, create_user):
        self.portal = portal
        self.user = create_user()
        self.person = self.portal["users"]["jdoe"]

    def test_person_created(self):
        assert self.person.portal_type == "Person"

    def test_person_is_user(self):
        assert IUserProfile.providedBy(self.person)

    @pytest.mark.parametrize(
        "attr,expected",
        [
            ["userid", "jdoe"],
            ["login", "jdoe"],
            ["first_name", "John"],
            ["last_name", "Doe"],
            ["fullname", "John Doe"],
        ],
    )
    def test_person_attributes(self, attr: str, expected: str):
        assert getattr(self.person, attr) == expected

    def test_user_found(self):
        user = api.user.get(userid="jdoe")
        assert user is not None
        assert user.getProperty("fullname") == "John Doe"

    def test_user_in_search(self):
        results = api.user.get_users()
        assert "jdoe" in [user.getId() for user in results]

    def test_group_membership_in_source_groups(self):
        api.group.add_user(groupname="Site Administrators", username="jdoe")
        groups = api.group.get_groups(username="jdoe")
        assert "Site Administrators" in [group.getId() for group in groups]


class TestPersonContent:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal
        with api.env.adopt_roles(["Manager"]):
            self.person = api.content.create(
                container=portal,
                type="Person",
                id="jane",
                first_name="Jane",
                last_name="Roe",
            )

    def test_person_is_not_user(self):
        assert not IUserProfile.providedBy(self.person)

    def test_no_user_for_person(self):
        assert api.user.get(userid="jane") is None

    def test_emails_optional(self):
        from kitconcept.core.behaviors.person_emails import IPersonEmails

        assert IPersonEmails["emails"].required is False
        assert self.person.emails == ()


class TestCreatePersonsForUsers:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, create_source_user):
        self.portal = portal
        self.userid = create_source_user()

    def test_source_user_has_no_person(self):
        assert "legacy" not in self.portal.get("users", {})

    def test_creates_person(self):
        created = utils.create_persons_for_users()
        assert self.userid in created
        person = self.portal["users"][self.userid]
        assert IUserProfile.providedBy(person)
        assert person.first_name == "Ada"
        assert person.last_name == "Lovelace"
        assert person.email == "legacy@example.com"

    def test_idempotent(self):
        utils.create_persons_for_users()
        assert utils.create_persons_for_users() == []

    def test_user_still_authenticates_against_source_users(self):
        utils.create_persons_for_users()
        acl_users = self.portal.acl_users
        assert acl_users.source_users.authenticateCredentials({
            "login": "legacy",
            "password": TEST_USER_PASSWORD,
        }) == ("legacy", "legacy")
