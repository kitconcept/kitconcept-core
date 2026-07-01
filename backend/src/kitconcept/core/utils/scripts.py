from AccessControl.SecurityManagement import newSecurityManager
from kitconcept.core import logger
from kitconcept.core.factory import add_site
from kitconcept.core.interfaces import IBrowserLayer
from OFS.Application import Application
from pathlib import Path
from Products.CMFPlone.Portal import PloneSite
from Testing.makerequest import makerequest
from typing import Any
from zope.interface import directlyProvidedBy
from zope.interface import directlyProvides
from zope.interface.interface import InterfaceClass
from ZPublisher.HTTPRequest import HTTPRequest

import json
import logging
import os
import transaction


marker = object()  # Unique marker object to indicate no value
truthy = frozenset(("t", "true", "y", "yes", "on", "1"))


def as_bool(s):
    """Return the boolean value ``True`` if the case-lowered value of string
    input ``s`` is a :term:`truthy string`. If ``s`` is already one of the
    boolean values ``True`` or ``False``, return it."""
    if s is None:
        return False
    if isinstance(s, bool):
        return s
    s = str(s).strip()
    return s.lower() in truthy


def as_list(value: str) -> list[str]:
    """Split a comma-separated string into a list of trimmed values.

    :param value: Comma-separated string, e.g. ``"en, de, fr"``. An empty or
        falsy value yields an empty list.
    :returns: List of whitespace-stripped items.
    """
    if not value:
        return []
    items = value.split(",")
    return [item.strip() for item in items]


OPTIONS: tuple[tuple[str, str, Any], ...] = (
    ("site_id", "SITE_ID", None),
    ("title", "SITE_TITLE", None),
    ("description", "SITE_DESCRIPTION", None),
    ("available_languages", "SITE_AVAILABLE_LANGUAGES", as_list),
    ("default_language", "SITE_DEFAULT_LANGUAGE", None),
    ("portal_timezone", "SITE_PORTAL_TIMEZONE", None),
    ("setup_content", "SITE_SETUP_CONTENT", as_bool),
    ("demo_content", "SITE_DEMO_CONTENT", as_bool),
    ("authentication.provider", "SITE_AUTHENTICATION_PROVIDER", None),
    ("authentication.oidc-server_url", "SITE_AUTHENTICATION_OIDC-SERVER_URL", None),
    ("authentication.oidc-realm_name", "SITE_AUTHENTICATION_OIDC-REALM_NAME", None),
    ("authentication.oidc-client_id", "SITE_AUTHENTICATION_OIDC-CLIENT_ID", None),
    (
        "authentication.oidc-client_secret",
        "SITE_AUTHENTICATION_OIDC-CLIENT_SECRET",
        None,
    ),
    ("authentication.oidc-site-url", "SITE_AUTHENTICATION_OIDC-SITE-URL", None),
    ("authentication.oidc-scope", "SITE_AUTHENTICATION_OIDC-SCOPE", as_list),
    ("authentication.oidc-issuer", "SITE_AUTHENTICATION_OIDC-ISSUER", None),
    (
        "authentication.authomatic-github-consumer_key",
        "SITE_AUTHENTICATION_AUTHOMATIC-GITHUB-CONSUMER_KEY",
        None,
    ),
    (
        "authentication.authomatic-github-consumer_secret",
        "SITE_AUTHENTICATION_AUTHOMATIC-GITHUB-CONSUMER_SECRET",
        None,
    ),
    (
        "authentication.authomatic-github-scope",
        "SITE_AUTHENTICATION_AUTHOMATIC-GITHUB-SCOPE",
        as_list,
    ),
    (
        "authentication.authomatic-google-consumer_key",
        "SITE_AUTHENTICATION_AUTHOMATIC-GOOGLE-CONSUMER_KEY",
        None,
    ),
    (
        "authentication.authomatic-google-consumer_secret",
        "SITE_AUTHENTICATION_AUTHOMATIC-GOOGLE-CONSUMER_SECRET",
        None,
    ),
    (
        "authentication.authomatic-google-scope",
        "SITE_AUTHENTICATION_AUTHOMATIC-GOOGLE-SCOPE",
        as_list,
    ),
)


def parse_answers(answers_file: Path, answers_env: dict) -> dict:
    answers = json.loads(answers_file.read_text())
    for key in answers:
        env_value = answers_env.get(key, "")
        if key == "setup_content" and env_value.strip():
            env_value = as_bool(env_value)
        elif not env_value:
            continue
        # Override answers_file value
        answers[key] = env_value
    return answers


def _prepare_loggers():
    logging.basicConfig(format="%(message)s")
    logger.setLevel(logging.INFO)
    # Silence some loggers
    for logger_name in [
        "GenericSetup.componentregistry",
        "Products.MimetypesRegistry.MimeTypesRegistry",
    ]:
        logging.getLogger(logger_name).setLevel(logging.ERROR)


def _prepare_request(app: Application, package_iface: InterfaceClass | None = None):
    request: HTTPRequest = app.REQUEST
    ifaces = [IBrowserLayer]
    if package_iface:
        ifaces.append(package_iface)
    for iface in directlyProvidedBy(request):
        ifaces.append(iface)

    directlyProvides(request, *ifaces)


def _prepare_user(app: Application):
    admin = app.acl_users.getUserById("admin")
    admin = admin.__of__(app.acl_users)
    newSecurityManager(None, admin)


def get_environmental_variables(
    options: tuple[tuple[str, str, Any], ...] = OPTIONS,
) -> dict[str, Any]:
    """Collect site-creation answers from environment variables.

    Each entry in :data:`OPTIONS` maps an answer key to an environment variable
    name and an optional transform callable (e.g. :func:`as_bool`,
    :func:`as_list`). Variables that are not set are skipped, so the resulting
    mapping only contains keys explicitly provided via the environment. Keys
    containing a ``.`` (e.g. ``authentication.provider``) are expanded into a
    nested dictionary.

    :returns: Mapping of answer keys to their (optionally transformed) values,
        ready to be merged into the site-creation answers.
    """
    env_vars: dict[str, Any] = {}
    for key, env_var, transform in options:
        value = os.getenv(env_var, marker)
        if value is marker:
            continue
        elif transform:
            value = transform(value)
        if "." in key:
            # Handle nested keys for authentication settings
            main_key, sub_key = key.split(".", 1)
            if main_key not in env_vars:
                env_vars[main_key] = {}
            env_vars[main_key][sub_key] = value
        else:
            env_vars[key] = value
    return env_vars


def _create_site(
    app: Application,
    distribution: str,
    delete_existing: bool,
    answers: dict[str, Any],
    package_iface: InterfaceClass | None = None,
) -> PloneSite:
    _prepare_loggers()
    app = makerequest(app)
    _prepare_request(app, package_iface)
    _prepare_user(app)
    if "distribution" not in answers:
        answers["distribution"] = distribution
    else:
        distribution = answers["distribution"]
    site_id = answers["site_id"]

    logger.info(f"Creating a new kitconcept site  @ {site_id}")
    logger.info(f" - Using the {distribution} distribution")

    if site_id in app.objectIds():
        if delete_existing:
            with transaction.manager:
                app.manage_delObjects([site_id])
            logger.info(f" - Deleted existing site with id {site_id}")
        else:
            logger.info(
                " - Stopping site creation, as there is already a site with id "
                f"{site_id} at the instance. Set DELETE_EXISTING=1 to delete "
                "the existing site before creating a new one."
            )

    app._p_jar.sync()
    if site_id not in app.objectIds():
        with transaction.manager:
            site = add_site(app, **answers)
        logger.info(f" - Site {site.id} created!")
    else:
        site = app[site_id]
    return site


def create_site(
    app: Application,
    answers_file: Path,
    env_answers: dict[str, Any],
    package_iface: InterfaceClass | None = None,
    env_options: tuple[tuple[str, str, Any], ...] = (),
) -> PloneSite:
    distribution = str(os.getenv("DISTRIBUTION", ""))
    delete_existing = as_bool(os.getenv("DELETE_EXISTING"))
    if not env_answers:
        # Extract answers from environment variables
        env_answers = get_environmental_variables(env_options)
    # Load site creation parameters
    answers = parse_answers(answers_file, env_answers)
    return _create_site(app, distribution, delete_existing, answers, package_iface)
