from plone import api

import pytest


class TestSiteCreation:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, identity_provider):
        self.portal = portal
        self.provider = identity_provider("keycloak")

    def test_profile_installed(self):
        setup_tool = self.portal.portal_setup
        version = setup_tool.getLastVersionForProfile("pas.plugins.identity:default")
        assert version != "unknown"

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
            ["userid_source", "subject"],
        ],
    )
    def test_provider_config(self, key, expected):
        assert self.provider.config[key] == expected

    def test_userid_is_keycloak_user_id(self):
        """The Keycloak user id survives userid minting unchanged."""
        from pas.plugins.identity.core.pas.plugin import mint_userid

        subject = "4f0c2b8e-9d2a-4c1e-8f3b-2a6d7e9c1b05"
        assert mint_userid("subject", subject=subject) == subject

    def test_callback_url(self):
        value = api.portal.get_registry_record("pas.plugins.identity.callback_url")
        assert value == "http://localhost:3000/login-identity"

    @pytest.mark.parametrize(
        "profile_id",
        [
            "pas.plugins.oidc:default",
            "pas.plugins.authomatic:default",
        ],
    )
    def test_legacy_profile_not_installed(self, setup_tool, profile_id):
        assert setup_tool.getLastVersionForProfile(profile_id) == "unknown"

    def test_keycloak_groups_installed(self, setup_tool):
        profile_id = "pas.plugins.keycloakgroups:default"
        assert setup_tool.getLastVersionForProfile(profile_id) != "unknown"

    @pytest.mark.parametrize(
        "key,expected",
        [
            ["enabled", True],
            ["server_url", "http://localhost:8180"],
            ["realm_name", "site"],
            ["client_id", "plone"],
            ["client_secret", "12345678"],
        ],
    )
    def test_keycloak_groups_settings(self, key, expected):
        value = api.portal.get_registry_record(f"keycloak_groups.{key}")
        assert value == expected

    def test_keycloak_groups_plugin_active(self):
        from Products.PluggableAuthService.interfaces.plugins import IGroupsPlugin

        active = self.portal.acl_users.plugins.listPluginIds(IGroupsPlugin)
        assert "groups_keycloak" in active
