from kitconcept.core import _types as t
from kitconcept.core import logger
from plone import api
from Products.GenericSetup.tool import SetupTool

import warnings


__all__ = [
    "DEPRECATED_PROVIDERS",
    "UnsupportedAuthenticationProvider",
    "setup_authentication",
]


# Providers based on pas.plugins.oidc and pas.plugins.authomatic -> replacement
DEPRECATED_PROVIDERS: dict[str, str] = {
    "keycloak": "identity-keycloak",
    "oidc": "identity-oidc",
    "authomatic-github": "identity-github",
    "authomatic-google": "identity-google",
}


class UnsupportedAuthenticationProvider(ValueError):
    """An authentication provider new sites can no longer use."""


def warn_deprecated(name: str, provider: str):
    """Warn that a setup helper of a deprecated provider was called.

    :param name: Name of the helper.
    :param provider: Deprecated provider the helper sets up.
    """
    replacement = DEPRECATED_PROVIDERS[provider]
    message = (
        f"{name} is deprecated and will be removed in a future version: "
        f"use the {replacement!r} authentication provider instead."
    )
    warnings.warn(message, DeprecationWarning, stacklevel=3)
    logger.warning(f"Authentication: {message}")


def _install_profiles(profiles: tuple[str, ...]):
    setup_tool: SetupTool = api.portal.get_tool("portal_setup")
    for profile in profiles:
        setup_tool.runAllImportStepsFromProfile(f"profile-{profile}")
        logger.info(f"Authentication: Installed profile {profile}")


def _setup_plone_auth(answers: t.AuthAnswers):
    logger.info("Authentication: Plone authentication setup")


def get_authentication_provider(provider: str) -> t.AuthenticationProvider:
    """Return the setup handler and profiles of an authentication provider.

    :param provider: Provider answer, e.g. ``identity-keycloak``.
    :returns: The provider; ``internal`` for an unknown provider.
    :raises UnsupportedAuthenticationProvider: For a provider based on
        ``pas.plugins.oidc`` or ``pas.plugins.authomatic``.
    """
    from .identity import setup_identity

    if provider in DEPRECATED_PROVIDERS:
        replacement = DEPRECATED_PROVIDERS[provider]
        raise UnsupportedAuthenticationProvider(
            f"Authentication provider {provider!r} is no longer supported, "
            f"use {replacement!r} instead."
        )
    providers = {
        "internal": t.AuthenticationProvider(_setup_plone_auth, ()),
        "identity-keycloak": t.AuthenticationProvider(
            setup_identity, ("pas.plugins.keycloakgroups:default",)
        ),
        "identity-oidc": t.AuthenticationProvider(setup_identity, ()),
        "identity-github": t.AuthenticationProvider(setup_identity, ()),
        "identity-google": t.AuthenticationProvider(setup_identity, ()),
    }
    return providers.get(provider, providers["internal"])


def setup_authentication(answers: t.AuthAnswers):
    """Setup authentication based on answers provided by the user.

    :param answers: Authentication answers.
    :raises UnsupportedAuthenticationProvider: For a provider based on
        ``pas.plugins.oidc`` or ``pas.plugins.authomatic``.
    """
    provider = answers.get("provider", "internal")
    auth_provider = get_authentication_provider(provider)
    # First install dependencies
    _install_profiles(auth_provider.profiles)
    # Delegate to the correct handler
    auth_provider.handler(answers)
