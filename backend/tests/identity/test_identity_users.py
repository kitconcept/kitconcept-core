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


class TestGroupsInSourceGroups:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal
        with api.env.adopt_roles(["Manager"]):
            api.group.create(groupname="editors-team", title="Editors team")

    def test_group_in_source_groups(self):
        source_groups = self.portal.acl_users.source_groups
        assert "editors-team" in source_groups.getGroupIds()

    def test_no_group_content(self):
        brains = api.content.find(portal_type="UserGroup")
        assert len(brains) == 0


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


class TestPersonFullname:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    def _create(self, **names):
        from pas.plugins.identity.core.container import get_container

        with api.env.adopt_roles(["Manager"]):
            return api.content.create(
                container=get_container(create=True),
                type="Person",
                id="sso-user",
                login="sso-user",
                **names,
            )

    @pytest.mark.parametrize(
        "names,expected",
        [
            [{}, ""],
            [{"last_name": "Hopper"}, "Hopper"],
            [{"first_name": "Grace"}, "Grace"],
            [{"first_name": "Grace", "last_name": "Hopper"}, "Grace Hopper"],
        ],
    )
    def test_fullname(self, names: dict, expected: str):
        assert self._create(**names).fullname == expected

    def test_name_claim_synced(self):
        """A login writes the name claim onto a Person created without names."""
        from pas.plugins.identity.core.profiles import sync_claims

        person = self._create()
        with api.env.adopt_roles(["Manager"]):
            changed = sync_claims(person, {"fullname": "Grace Hopper"}, "")
        assert changed == ["fullname"]
        assert (person.first_name, person.last_name) == ("Grace", "Hopper")

    @pytest.mark.parametrize(
        "utility,first,second",
        [
            ("first_last", "Grace Hopper", "Grace M. Hopper"),
            ("last_first", "Grace Hopper", "Grace M. Hopper"),
            ("first_last", "Grace  Hopper", "Grace M. Hopper"),
            ("first_last", "Grace", "Grace Hopper"),
        ],
    )
    def test_later_login_updates_name(self, utility: str, first: str, second: str):
        """The name last written round-trips, so the provider still owns it."""
        from pas.plugins.identity.core.profiles import sync_claims

        api.portal.set_registry_record("person.title_utility", utility)
        person = self._create()
        with api.env.adopt_roles(["Manager"]):
            sync_claims(person, {"fullname": first}, "")
            assert person.fullname == first
            changed = sync_claims(person, {"fullname": second}, "")
        assert changed == ["fullname"]
        assert person.fullname == second

    def test_edited_name_is_kept(self):
        """A name edited on the Person is not overwritten by the next login."""
        from pas.plugins.identity.core.profiles import sync_claims

        person = self._create()
        with api.env.adopt_roles(["Manager"]):
            sync_claims(person, {"fullname": "Grace Hopper"}, "")
            person.last_name = "Murray Hopper"
            changed = sync_claims(person, {"fullname": "Grace B. Hopper"}, "")
        assert changed == []
        assert person.fullname == "Grace Murray Hopper"


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
