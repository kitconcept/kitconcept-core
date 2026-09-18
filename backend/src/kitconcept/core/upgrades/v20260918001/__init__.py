from kitconcept.core import logger
from plone import api
from Products.GenericSetup.tool import SetupTool


PERMISSION = "Can edit TTW blocks configuration"
ROLES = ("Manager", "Site Administrator")


def update_blocks_config_permission(tool: SetupTool):
    """Grant the TTW blocks configuration permission to site admins.

    The ``blocks_config_mutator`` field write permission was changed from
    ``kitconcept.intranet.siteadminsonly`` to the new
    ``kitconcept.can_edit_blocks_config`` permission. Existing sites have no
    role mapping for it yet, so assign it to ``Manager`` and
    ``Site Administrator``.

    :param tool: The GenericSetup tool of the site being upgraded.
    """
    portal = api.portal.get()
    portal.manage_permission(PERMISSION, roles=ROLES, acquire=0)
    logger.info(f"- Granted '{PERMISSION}' to {', '.join(ROLES)}.")
