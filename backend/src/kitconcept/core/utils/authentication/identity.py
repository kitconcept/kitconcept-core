from kitconcept.core import _types as t
from kitconcept.core import logger
from plone import api


ANSWER_PREFIX = "identity-"

CALLBACK_PATH = "/login-identity"

CALLBACK_URL_RECORD = "pas.plugins.identity.callback_url"

# Answer provider -> (provider id, driver id, title)
PROVIDERS: dict[str, tuple[str, str, str]] = {
    "identity-keycloak": ("keycloak", "keycloak", "Keycloak"),
    "identity-oidc": ("oidc", "oidc-generic", "OpenID Connect"),
    "identity-github": ("github", "github", "GitHub"),
    "identity-google": ("google", "google", "Google"),
}

# Answers that are not driver settings
NON_CONFIG_KEYS = ("site-url", "server_url", "realm_name")


def _prepare_answers(raw_answers: t.AnswersIdentity) -> dict:
    """Strip the answer prefix, and drop empty values.

    :param raw_answers: Authentication answers.
    :returns: Answers keyed by setting name.
    """
    return {
        key.replace(ANSWER_PREFIX, "", 1): value
        for key, value in raw_answers.items()
        if key.startswith(ANSWER_PREFIX) and value not in (None, "", [])
    }


def _prepare_config(provider: str, answers: dict) -> dict:
    """Build the driver settings for a provider.

    Settings not answered are left out, so the driver defaults apply.

    :param provider: Answer provider, e.g. ``identity-keycloak``.
    :param answers: Answers, as returned by :func:`_prepare_answers`.
    :returns: Driver settings.
    """
    config = {
        key: value for key, value in answers.items() if key not in NON_CONFIG_KEYS
    }
    if provider == "identity-keycloak" and "issuer" not in config:
        server_url = answers["server_url"].rstrip("/")
        realm = answers["realm_name"]
        config["issuer"] = f"{server_url}/realms/{realm}"
    return config


def _callback_url(answers: dict) -> str | None:
    """Return the callback url for a site url answer, if any.

    :param answers: Answers, as returned by :func:`_prepare_answers`.
    :returns: Absolute callback url, or ``None`` to keep the default.
    """
    site_url = answers.get("site-url")
    if not site_url:
        return None
    return f"{site_url.rstrip('/')}{CALLBACK_PATH}"


def setup_identity(raw_answers: t.AnswersIdentity):
    """Configure a pas.plugins.identity provider.

    :param raw_answers: Authentication answers.
    """
    from pas.plugins.identity.core.controlpanel import get_providers
    from pas.plugins.identity.core.controlpanel import ProviderConfig
    from pas.plugins.identity.core.controlpanel import set_providers

    provider = raw_answers["provider"]
    provider_id, driver_id, title = PROVIDERS[provider]
    answers = _prepare_answers(raw_answers)
    config = _prepare_config(provider, answers)
    providers = [p for p in get_providers() if p.provider_id != provider_id]
    providers.append(ProviderConfig(provider_id, driver_id, title=title, config=config))
    set_providers(providers)
    logger.info(f"Authentication: Configured identity provider {provider_id}")
    callback_url = _callback_url(answers)
    if callback_url:
        api.portal.set_registry_record(CALLBACK_URL_RECORD, callback_url)
        logger.info(f"Authentication: Set registry value on {CALLBACK_URL_RECORD}")
    logger.info("Authentication: Identity authentication setup")
