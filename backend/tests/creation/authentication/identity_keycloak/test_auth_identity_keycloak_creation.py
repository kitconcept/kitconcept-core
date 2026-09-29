from plone import api

import pytest


class TestSiteCreation:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, identity_provider):
        self.portal = portal
        self.provider = identity_provider("keycloak")

    def test_profile_installed(self, profile_last_version):
        result = profile_last_version("profile-pas.plugins.identity:default")
        assert isinstance(result, str)
        assert result != ""

    @pytest.mark.parametrize("plugin_id", ["identity", "identity_profile"])
    def test_plugin_created(self, plugin_id):
        assert plugin_id in self.portal.acl_users.objectIds()

    @pytest.mark.parametrize(
        "attr,expected",
        [
            ["driver_id", "keycloak"],
            ["title", "Keycloak"],
            ["enabled", True],
        ],
    )
    def test_provider(self, attr, expected):
        assert getattr(self.provider, attr) == expected

    @pytest.mark.parametrize(
        "key,expected",
        [
            ["issuer", "http://localhost:8180/realms/site"],
            ["client_id", "plone"],
            ["client_secret", "12345678"],
            ["scope", ("openid", "profile", "email")],
        ],
    )
    def test_provider_config(self, key, expected):
        assert self.provider.config[key] == expected

    def test_callback_url(self):
        value = api.portal.get_registry_record("pas.plugins.identity.callback_url")
        assert value == "http://localhost:3000/login-identity"

    @pytest.mark.parametrize(
        "profile_id",
        [
            "pas.plugins.oidc:default",
            "pas.plugins.keycloakgroups:default",
            "pas.plugins.authomatic:default",
        ],
    )
    def test_legacy_profile_not_installed(self, setup_tool, profile_id):
        assert setup_tool.getLastVersionForProfile(profile_id) == "unknown"
