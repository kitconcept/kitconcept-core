from kitconcept.core import _types as t
from kitconcept.core import logger
from kitconcept.core.utils import authentication as auth_utils
from kitconcept.core.utils import creation as utils
from kitconcept.core.utils.packages import package_version
from plone import api
from plone.distribution.api import distribution as dist_api
from plone.distribution.core import Distribution
from plone.distribution.utils.data import convert_data_uri_to_b64
from Products.CMFPlone.Portal import PloneSite
from typing import Any

import transaction


def current_distribution() -> Distribution:
    """Return the distribution for the current portal."""
    portal = api.portal.get()
    report = dist_api.get_creation_report(portal)
    if not report:
        raise ValueError("No distribution report found for the current portal.")
    distribution = dist_api.get(report.name)
    return distribution


def distribution_info() -> t.DistributionInfo:
    """Return distribution information for the current site."""
    distribution = current_distribution()
    version = package_version(distribution.package)
    return {
        "name": distribution.name,
        "title": distribution.title,
        "package_name": distribution.package,
        "package_version": version,
    }


def pre_handler(answers: dict[str, Any]) -> dict[str, Any]:
    """Process answers.

    Handle cases where available_languages is not provided but default_language is, or
    where default_language is not in available_languages.
    This ensures that the site will always have a valid default language and that
    the available languages are consistent with the default language.
    """
    # Goal here is to also handle cases where the answers
    # only contain default_language but not available_languages
    available_languages = answers.get("available_languages")
    default_language = answers.get("default_language")
    if available_languages is None and default_language:
        answers["available_languages"] = [default_language]
    elif available_languages and default_language not in available_languages:
        answers["default_language"] = available_languages[0]
    return answers


def handler(
    distribution: Distribution, site: PloneSite, answers: dict[str, Any]
) -> PloneSite:
    """Handler to create a new site."""
    tx = transaction.get()

    # Handle multilingual support
    profiles = list(distribution.profiles)
    utils.multilingual_support(profiles, answers)
    setup_tool = site["portal_setup"]
    for profile_id in profiles:
        setup_tool.runAllImportStepsFromProfile(f"profile-{profile_id}")

    # If there is no savepoint most tests fail with a PosKeyError
    tx.savepoint(optimistic=True)

    # Add default content if needed
    setup_content = answers.get("setup_content", False)
    if setup_content:
        utils.create_example_content(site, distribution, tx)

    # Commit the transaction to finalize the import
    tx.description = f"Created site {site.id} with distribution {distribution.name}"
    tx.commit()
    return site


def post_handler(
    distribution: Distribution, site: PloneSite, answers: dict
) -> PloneSite:
    """Run after site creation."""
    name = distribution.name
    logger.info(f"{site.id}: Running {name} post_handler")
    # This should be fixed on plone.distribution
    title = answers.get("title", site.title)
    description = answers.get("description", site.description)
    raw_logo = answers.get("site_logo")
    registry_data = {
        "plone.email_from_name": title,
        "plone.site_title": title,
    }
    if raw_logo:
        logo = convert_data_uri_to_b64(raw_logo)
        registry_data["plone.site_logo"] = logo

    # Update site content
    utils.update_content(site, title, description, raw_logo)
    # Update registry
    utils.update_registry(registry_data)

    # Update authentication
    auth_answers = answers.get("authentication", {"provider": "internal"})
    auth_utils.setup_authentication(auth_answers)

    # Update permissions
    utils.update_permissions()
    return site
