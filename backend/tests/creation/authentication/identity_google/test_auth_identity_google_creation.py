import pytest


class TestSiteCreation:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, identity_provider):
        self.portal = portal
        self.provider = identity_provider("google")

    @pytest.mark.parametrize(
        "attr,expected",
        [
            ["driver_id", "google"],
            ["title", "Google"],
            ["enabled", True],
        ],
    )
    def test_provider(self, attr, expected):
        assert getattr(self.provider, attr) == expected

    @pytest.mark.parametrize(
        "key,expected",
        [
            ["client_id", "google-12345"],
            ["client_secret", "12345678"],
            ["scope", ("openid", "email")],
        ],
    )
    def test_provider_config(self, key, expected):
        assert self.provider.config[key] == expected
