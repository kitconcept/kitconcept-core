from kitconcept.core import logger
from plone import api
from plone.dexterity.schema import SCHEMA_CACHE
from plone.distribution.core import Distribution
from plone.exportimport.importers import get_importer
from plone.namedfile.file import NamedBlobImage
from Products.CMFCore.WorkflowTool import WorkflowTool
from Products.CMFPlone.Portal import PloneSite
from typing import Any

import codecs
import transaction


def convert_data_uri_to_image(raw_data: str) -> NamedBlobImage:
    """Convert data-uri format to a NamedBlobImage."""
    headers, body = raw_data.split("base64,")
    filename: str = headers.split("name=")[1][:-1]
    data = codecs.decode(body.encode("utf-8"), "base64")
    return NamedBlobImage(data=data, filename=filename)


def update_registry(data: dict[str, Any]) -> None:
    """Update Plone registry with provided data."""
    for key, value in data.items():
        api.portal.set_registry_record(key, value)
        logger.info(f"Updated registry record: {key}")


def update_permissions() -> None:
    """Update workflow security settings."""
    workflow_tool: WorkflowTool = api.portal.get_tool("portal_workflow")
    workflow_tool.updateRoleMappings()


def update_content(
    site: PloneSite, title: str, description: str, raw_logo: str | None = None
) -> None:
    """Update site title, description, and logo."""
    site.title = title
    site.description = description
    if raw_logo:
        set_site_logo(site, raw_logo)


def create_example_content(
    site: PloneSite, distribution: Distribution, tx: transaction.Transaction
) -> None:
    """Create example content in the site."""
    contents = distribution.contents
    # Process content import from json
    content_json_path = contents["json"]
    if content_json_path:
        # Invalidate the schema cache to make sure we get up to date behaviors.
        # Normally this happens on commit, but we didn't commit yet.
        SCHEMA_CACHE.clear()
        importer = get_importer(site)
        importer.import_site(content_json_path)
        # Create a savepoint to ensure the import is atomic
        tx.savepoint(optimistic=True)


def set_site_logo(site: PloneSite, raw_logo: str) -> None:
    """Create an Image object from a data URI and set it as the site logo."""
    image = convert_data_uri_to_image(raw_logo)
    site.logo = image
    logger.info(f"Set logo for {site.id} with data provided via form.")


def multilingual_support(profiles: list[str], answers: dict[str, Any]):
    """Enable multilingual support if more than one language is available."""
    # Set languages here, to make sure installation of p.a.multilingual
    # works correctly with the provided languages.
    available_languages: list[str] = answers["available_languages"]
    default_language: str = answers["default_language"]
    registry_data = {
        "plone.available_languages": available_languages,
        "plone.default_language": default_language,
    }
    update_registry(registry_data)
    # If there are multiple languages, add p.a.multilingual to the profiles
    # to enable multilingual support
    if available_languages and len(available_languages) > 1:
        # Add p.a.multilingual to profiles to enable multilingual support
        profiles.insert(0, "kitconcept.core:multilingual")
