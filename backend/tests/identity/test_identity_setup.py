from plone import api

import pytest


PREFIX = "pas.plugins.identity"


class TestIdentitySetup:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    def test_profile_installed(self, profile_last_version):
        result = profile_last_version(f"profile-{PREFIX}:default")
        assert isinstance(result, str)
        assert result != ""

    @pytest.mark.parametrize("plugin_id", ["identity", "identity_profile"])
    def test_plugin_created(self, plugin_id):
        assert plugin_id in self.portal.acl_users.objectIds()

    @pytest.mark.parametrize(
        "key,expected",
        [
            ["user_content_type", "Person"],
            ["user_container_path", "users"],
            ["group_content_type", None],
            ["profile_container_id", "users"],
            ["profile_container_title", "Users"],
            ["profile_container_type", "PrincipalsContainer"],
            ["profile_enumeration_states", ("private", "pending", "published")],
            ["enforce_required_profile_fields", False],
        ],
    )
    def test_registry(self, key: str, expected):
        assert api.portal.get_registry_record(f"{PREFIX}.{key}") == expected

    @pytest.mark.parametrize(
        "portal_type,expected",
        [
            ["UserProfile", False],
            ["UserGroup", False],
            ["Person", True],
        ],
    )
    def test_global_allow(self, get_fti, portal_type: str, expected: bool):
        assert get_fti(portal_type).global_allow is expected

    def test_principals_container_allows_person(self, get_fti):
        fti = get_fti("PrincipalsContainer")
        assert fti.allowed_content_types == ("Person",)


class TestIdentityPrincipalTypes:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    def test_user_portal_type(self):
        from pas.plugins.identity.core.principal_types import user_portal_type

        assert user_portal_type() == "Person"

    def test_catalogued_types(self):
        from pas.plugins.identity.core.principal_types import catalogued_types

        assert catalogued_types() == ("Person", "UserGroup")
