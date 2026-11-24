from kitconcept.core import logger
from Products.GenericSetup.tool import SetupTool


PROFILE_ID = "collective.person:default"


def upgrade_collective_person(tool: SetupTool):
    """Upgrade collective.person to profile version 1011.

    This removes the Editor and Owner roles from the
    ``collective.person: Add Person`` permission.
    """
    logger.info("- Upgrading collective.person to version 1011.")
    tool.upgradeProfile(PROFILE_ID, dest="1011")
    logger.info("- Upgrade complete.")
