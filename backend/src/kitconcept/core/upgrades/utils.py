from kitconcept.core import logger
from plone.registry.interfaces import IRegistry
from Products.GenericSetup.tool import SetupTool
from zope.component import getUtility


def null_upgrade_step(tool: SetupTool):
    """This is a null upgrade, use it when nothing happens"""
    logger.info("Null migration step.")
    pass


def rename_disable_to_clickable_profile_links(tool: SetupTool):
    """Migrate disable_profile_links to clickable_profile_links.

    The old ``disable_profile_links`` flag was inverted and renamed to
    ``clickable_profile_links``, so carry the previous value over with the
    opposite meaning and drop the stale record.
    """
    old_key = "kitconcept.core.settings.disable_profile_links"
    new_key = "kitconcept.core.settings.clickable_profile_links"
    registry = getUtility(IRegistry)
    records = registry.records
    if old_key in records:
        disabled = registry[old_key]
        registry[new_key] = not disabled
        del records[old_key]
        logger.info(f"Migrated {old_key}={disabled} to {new_key}={not disabled}")
    else:
        logger.info(f"{old_key} not present, nothing to migrate.")
