from kitconcept.core import logger
from plone import api
from Products.GenericSetup.tool import SetupTool


PROFILE_ID = "kitconcept.core:multilingual"
OLD_LAYOUT = "summary_view"


def upgrade_multilingual(tool: SetupTool):
    """Make Language Root Folders render their blocks again.

    The LRF FTI used ``summary_view`` as its default view. Volto picks the
    view by the ``layout`` field before it looks at blocks, so every LRF was
    rendered as a summary listing of its children. The FTI now uses
    ``document_view``.

    The multilingual profile is only applied to sites with more than one
    language, so it is only upgraded when it was installed. An LRF that stores
    ``summary_view`` as its own layout would keep it, so that layout is
    removed and the LRF falls back to the FTI default.

    :param tool: The GenericSetup tool of the site being upgraded.
    """
    install_date: str | None = tool.getProfileImportDate(f"profile-{PROFILE_ID}")
    if not install_date:
        logger.info("- Multilingual profile not applied, no need for an upgrade.")
        return
    logger.info("- Multilingual profile applied, upgrading to version 1002.")
    tool.upgradeProfile(PROFILE_ID, dest="1002")
    # Language Root Folders always live at the site root.
    portal = api.portal.get()
    for lrf in portal.objectValues():
        if getattr(lrf, "portal_type", None) != "LRF":
            continue
        if getattr(lrf.aq_base, "layout", None) == OLD_LAYOUT:
            del lrf.layout
            logger.info(f"- Removed {OLD_LAYOUT} layout from {lrf.getId()}.")
    logger.info("- Upgrade complete.")
