from kitconcept.core import logger
from Products.GenericSetup.tool import SetupTool


PROFILE_ID = "kitconcept.core:multilingual"


def upgrade_multilingual(tool: SetupTool):
    """Upgrade the multilingual profile, if it is installed.

    The multilingual profile is only applied to sites with more than one
    language, and ``types/LRF.xml`` is its only import step. Reapplying it
    unconditionally would therefore *create* the LRF type on monolingual
    sites, so check the profile was installed before upgrading it.

    :param tool: The GenericSetup tool of the site being upgraded.
    """
    install_date: str | None = tool.getProfileImportDate(f"profile-{PROFILE_ID}")
    if not install_date:
        logger.info("- Multilingual profile not applied, no need for an upgrade.")
        return
    # Upgrade the profile
    logger.info("- Multilingual profile applied, upgrading to version 1001.")
    tool.upgradeProfile(PROFILE_ID, dest="1001")
    logger.info("- Upgrade complete.")
