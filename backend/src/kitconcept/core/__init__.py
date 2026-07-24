"""Init and utils."""

from kitconcept.core.patches.schema import apply_patch
from zope.i18nmessageid import MessageFactory

import logging


__version__ = "2.0.0b5"

PACKAGE_NAME = "kitconcept.core"
DEFAULT_PROFILE = f"{PACKAGE_NAME}:base"
CMF_DEPENDENCIES_PROFILE = f"{PACKAGE_NAME}:cmfdependencies"
DEPENDENCIES_PROFILE = f"{PACKAGE_NAME}:dependencies"

_ = MessageFactory(PACKAGE_NAME)

logger = logging.getLogger(PACKAGE_NAME)


def initialize(context):
    from kitconcept.core.tools import migration
    from Products.CMFPlone.utils import ToolInit

    tools = (migration.MigrationTool,)
    # Register tools and content
    ToolInit(
        "Plone Tool",
        tools=tools,
        icon="tool.gif",
    ).initialize(context)


apply_patch(logger=logger)
