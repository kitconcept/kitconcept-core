from kitconcept.core.utils import authentication as utils
from kitconcept.core.utils.authentication import authomatic
from kitconcept.core.utils.authentication import identity
from kitconcept.core.utils.authentication import keycloak
from kitconcept.core.utils.authentication import oidc

import pytest


DEPRECATED = (
    ("keycloak", "identity-keycloak"),
    ("oidc", "identity-oidc"),
    ("authomatic-github", "identity-github"),
    ("authomatic-google", "identity-google"),
)


class TestGetAuthenticationProvider:
    @pytest.mark.parametrize(
        "provider,profiles",
        [
            ("identity-keycloak", ("pas.plugins.keycloakgroups:default",)),
            ("identity-oidc", ()),
            ("identity-github", ()),
            ("identity-google", ()),
        ],
    )
    def test_identity(self, provider: str, profiles: tuple[str, ...]):
        result = utils.get_authentication_provider(provider)
        assert result.handler is identity.setup_identity
        assert result.profiles == profiles

    @pytest.mark.parametrize("provider", ["internal", "unknown"])
    def test_internal(self, provider: str):
        result = utils.get_authentication_provider(provider)
        assert result.handler is utils._setup_plone_auth
        assert result.profiles == ()

    @pytest.mark.parametrize("provider,replacement", DEPRECATED)
    def test_deprecated_refused(self, provider: str, replacement: str):
        with pytest.raises(
            utils.UnsupportedAuthenticationProvider, match=f"use '{replacement}'"
        ):
            utils.get_authentication_provider(provider)

    @pytest.mark.parametrize("provider,replacement", DEPRECATED)
    def test_setup_authentication_refused(self, provider: str, replacement: str):
        with pytest.raises(utils.UnsupportedAuthenticationProvider):
            utils.setup_authentication({"provider": provider})


class TestDeprecatedHelpers:
    def test_setup_oidc_auth(self, monkeypatch):
        monkeypatch.setattr(oidc, "_setup_oidc", lambda answers: None)
        with pytest.deprecated_call(match="identity-oidc"):
            oidc.setup_oidc_auth({"provider": "oidc"})

    def test_setup_keycloak_auth(self, monkeypatch):
        monkeypatch.setattr(oidc, "_setup_oidc", lambda answers: None)
        monkeypatch.setattr(keycloak, "_setup_keycloak_groups", lambda payload: None)
        answers = {
            "provider": "keycloak",
            "oidc-server_url": "http://localhost:8180",
            "oidc-realm_name": "site",
        }
        with pytest.deprecated_call(match="identity-keycloak"):
            keycloak.setup_keycloak_auth(answers)

    @pytest.mark.parametrize(
        "provider,replacement",
        [
            ("authomatic-github", "identity-github"),
            ("authomatic-google", "identity-google"),
        ],
    )
    def test_setup_authomatic(self, monkeypatch, provider: str, replacement: str):
        monkeypatch.setattr(
            authomatic.api.portal, "set_registry_record", lambda key, value: None
        )
        with pytest.deprecated_call(match=replacement):
            authomatic.setup_authomatic({"provider": provider})


class TestNewSite:
    """A new site uses pas.plugins.identity, and none of the old plugins."""

    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    @pytest.mark.parametrize(
        "profile_id",
        [
            "pas.plugins.oidc:default",
            "pas.plugins.keycloakgroups:default",
            "pas.plugins.authomatic:default",
        ],
    )
    def test_old_profile_not_installed(self, profile_id: str):
        setup_tool = self.portal.portal_setup
        assert setup_tool.getLastVersionForProfile(profile_id) == "unknown"

    @pytest.mark.parametrize("plugin_id", ["oidc", "authomatic"])
    def test_old_plugin_not_created(self, plugin_id: str):
        assert plugin_id not in self.portal.acl_users.objectIds()
