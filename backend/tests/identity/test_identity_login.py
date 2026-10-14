"""A login creates the Person of a user, and every user is listed once."""

from pas.plugins.identity.core.interfaces import IUserProfile
from plone import api
from plone.app.testing import TEST_USER_PASSWORD
from Products.PlonePAS.events import UserLoggedInEvent
from zope.event import notify

import pytest


# Normalized claims, as a driver hands them to the login subscribers
CLAIMS = {
    "email": "sso@example.org",
    "email_verified": True,
    "fullname": "Grace Hopper",
    "username": "ghopper",
}


@pytest.fixture
def listed(portal):
    """Return the userids each way of listing users answers."""

    def func() -> dict[str, list[str]]:
        acl_users = portal.acl_users
        return {
            "searchUsers": [user["id"] for user in acl_users.searchUsers()],
            "get_users": [user.getId() for user in api.user.get_users()],
            "listMembers": [
                member.getId() for member in portal.portal_membership.listMembers()
            ],
            "getUserIds": list(acl_users.getUserIds()),
        }

    return func


@pytest.fixture
def federated_login():
    """Sign in through a provider, as the identity plugin does."""
    from pas.plugins.identity.core.subscribers import _handle

    def func(userid: str = "sso-user", **claims):
        _handle(userid, {**CLAIMS, **claims}, "keycloak", sign_in=True)

    return func


class TestFederatedLogin:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, federated_login, listed):
        self.portal = portal
        self.listed = listed
        self.login = federated_login
        federated_login()
        self.person = portal["users"]["sso-user"]

    def test_person_created(self):
        assert self.person.portal_type == "Person"
        assert IUserProfile.providedBy(self.person)

    def test_claims_synced(self):
        assert (self.person.first_name, self.person.last_name) == ("Grace", "Hopper")
        assert self.person.email == "sso@example.org"

    def test_user_properties(self):
        user = api.user.get(userid="sso-user")
        assert user.getProperty("fullname") == "Grace Hopper"

    def test_later_login_updates_name(self):
        self.login(fullname="Grace M. Hopper")
        assert self.person.fullname == "Grace M. Hopper"

    def test_later_login_keeps_one_person(self):
        self.login()
        assert list(self.portal["users"].objectIds()).count("sso-user") == 1

    @pytest.mark.parametrize(
        "path", ["searchUsers", "get_users", "listMembers", "getUserIds"]
    )
    def test_listed_once(self, path: str):
        assert self.listed()[path].count("sso-user") == 1


class TestUserInBothStores:
    """A user with a source_users credential and a Person."""

    @pytest.fixture(autouse=True)
    def _setup(self, portal, listed):
        self.portal = portal
        self.listed = listed
        with api.env.adopt_roles(["Manager"]):
            api.user.create(
                email="jdoe@example.com",
                username="jdoe",
                password=TEST_USER_PASSWORD,
                properties={"fullname": "John Doe"},
            )

    def test_both_stores(self):
        assert "jdoe" in self.portal.acl_users.source_users.getUserIds()
        assert IUserProfile.providedBy(self.portal["users"]["jdoe"])

    @pytest.mark.parametrize("path", ["get_users", "listMembers", "getUserIds"])
    def test_listed_once(self, path: str):
        assert self.listed()[path].count("jdoe") == 1


class TestSourceUsersLogin:
    """A user only in source_users gets a Person when signing in."""

    @pytest.fixture(autouse=True)
    def _setup(self, portal, listed):
        self.portal = portal
        self.listed = listed
        acl_users = portal.acl_users
        acl_users.source_users.addUser("legacy", "legacy", TEST_USER_PASSWORD)
        notify(UserLoggedInEvent(acl_users.getUserById("legacy")))

    def test_person_created(self):
        assert IUserProfile.providedBy(self.portal["users"]["legacy"])

    def test_listed_once(self):
        assert self.listed()["get_users"].count("legacy") == 1


class TestPersonWithoutLogin:
    """A Person that is not an account, like a team page, is not a user."""

    @pytest.fixture(autouse=True)
    def _setup(self, portal, listed):
        self.listed = listed
        with api.env.adopt_roles(["Manager"]):
            self.person = api.content.create(
                container=portal,
                type="Person",
                title="Ada Team",
                first_name="Ada",
                last_name="Team",
            )

    @pytest.mark.parametrize(
        "path", ["searchUsers", "get_users", "listMembers", "getUserIds"]
    )
    def test_not_listed(self, path: str):
        assert self.person.getId() not in self.listed()[path]
