from kitconcept.core import DEPENDENCIES_PROFILE
from kitconcept.core import logger
from kitconcept.core.utils.users import create_persons_for_users
from Products.GenericSetup.tool import SetupTool


IDENTITY_PROFILE = "pas.plugins.identity:default"

# Import steps of the dependencies profile touched by this upgrade
STEPS = ("typeinfo", "plone.app.registry")


def install_identity(tool: SetupTool):
    """Install pas.plugins.identity, and use Person as the user content type.

    :param tool: The GenericSetup tool of the site being upgraded.
    """
    if tool.getLastVersionForProfile(IDENTITY_PROFILE) == "unknown":
        tool.runAllImportStepsFromProfile(f"profile-{IDENTITY_PROFILE}")
        logger.info(f"- Installed {IDENTITY_PROFILE}.")
    for step in STEPS:
        tool.runImportStepFromProfile(
            f"profile-{DEPENDENCIES_PROFILE}", step, run_dependencies=False
        )
        logger.info(f"- Imported {step} from {DEPENDENCIES_PROFILE}.")


def create_persons(tool: SetupTool):
    """Create a Person for every user in source_users.

    :param tool: The GenericSetup tool of the site being upgraded.
    """
    created = create_persons_for_users()
    logger.info(f"- Created {len(created)} Person objects for existing users.")
