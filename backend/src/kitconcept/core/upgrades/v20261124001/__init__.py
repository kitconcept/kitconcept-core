from kitconcept.core import logger
from Products.GenericSetup.tool import SetupTool


#: Authentication add-on profiles this release upgrades on existing sites.
#: ``pas.plugins.authomatic`` moves to 3.1.0 and ``pas.plugins.oidc`` to 2.1.0;
#: their profile versions are unchanged, so the step runs whatever upgrade
#: steps each profile still has pending from the version it records.
ADDON_PROFILES = (
    "pas.plugins.authomatic:default",
    "pas.plugins.oidc:default",
)
UNKNOWN = "unknown"


def _recorded_version(setup_tool: SetupTool, profile_id: str) -> str:
    """Return the version recorded for a profile as a plain string.

    :param setup_tool: The ``portal_setup`` tool.
    :param profile_id: The profile id, without the ``profile-`` prefix.
    :returns: The recorded version, or ``unknown`` when none is recorded.
    """
    version = setup_tool.getLastVersionForProfile(profile_id)
    # After an upgrade step has run GenericSetup records a tuple, not a string.
    if isinstance(version, tuple):
        return version[0] if version else UNKNOWN
    return version


def upgrade_addons(setup_tool: SetupTool) -> None:
    """Run the pending upgrade steps of the authentication add-ons.

    An add-on that is not installed on the site is left alone: it is not
    installed here, and its upgrade steps are not run.

    :param setup_tool: The ``portal_setup`` tool.
    """
    for profile_id in ADDON_PROFILES:
        before = _recorded_version(setup_tool, profile_id)
        if before == UNKNOWN:
            logger.info("Kept %s: not installed on this site", profile_id)
            continue
        setup_tool.upgradeProfile(profile_id)
        after = _recorded_version(setup_tool, profile_id)
        logger.info("Upgraded %s from %s to %s", profile_id, before, after)
