from plone import api

import pytest


class TestSiteCreation:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, identity_provider):
        self.portal = portal
        self.provider = identity_provider("github")

    @pytest.mark.parametrize(
        "attr,expected",
        [
            ["driver_id", "github"],
            ["title", "GitHub"],
            ["enabled", True],
        ],
    )
    def test_provider(self, attr, expected):
        assert getattr(self.provider, attr) == expected

    @pytest.mark.parametrize(
        "key,expected",
        [
            ["client_id", "gh-32510011"],
            ["client_secret", "12345678"],
            # Not answered, so the driver default applies
            ["scope", ("read:user", "user:email")],
        ],
    )
    def test_provider_config(self, key, expected):
        assert self.provider.config[key] == expected

    def test_callback_url_default(self):
        value = api.portal.get_registry_record("pas.plugins.identity.callback_url")
        assert value == "/login-identity"
