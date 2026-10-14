from plone import api

import pytest


class TestSiteCreation:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, identity_provider):
        self.portal = portal
        self.provider = identity_provider("oidc")

    @pytest.mark.parametrize(
        "attr,expected",
        [
            ["driver_id", "oidc-generic"],
            ["title", "OpenID Connect"],
            ["enabled", True],
        ],
    )
    def test_provider(self, attr, expected):
        assert getattr(self.provider, attr) == expected

    @pytest.mark.parametrize(
        "key,expected",
        [
            ["issuer", "https://auth.example.com"],
            ["client_id", "plone"],
            ["client_secret", "12345678"],
        ],
    )
    def test_provider_config(self, key, expected):
        assert self.provider.config[key] == expected

    def test_callback_url(self):
        value = api.portal.get_registry_record("pas.plugins.identity.callback_url")
        assert value == "https://www.example.com/login-identity"
