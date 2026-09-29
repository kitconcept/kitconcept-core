"""Use ``Person`` as the user content type of ``pas.plugins.identity``.

``pas.plugins.identity`` hardcodes ``UserProfile`` as the portal type of a
user in several places (``PROFILE_PORTAL_TYPE``), and resets the
``user_content_type`` and ``group_content_type`` registry records to its own
types whenever the container settings change. Until the add-on reads the type
from the registry, point every copy of those constants at ``Person``, and at no
group type, so groups stay in ``source_groups``.

The ``Person`` class also gets the attributes the identity catalog and the
PAS plugins read from a ``UserProfile``.
"""

from importlib import import_module
from logging import Logger


PROFILE_PORTAL_TYPE = "Person"

# Empty: groups are not content, they stay in source_groups
GROUP_PORTAL_TYPE = ""

# Modules holding a copy of PROFILE_PORTAL_TYPE
PROFILE_TYPE_MODULES = (
    "pas.plugins.identity.core.catalog",
    "pas.plugins.identity.core.completeness",
    "pas.plugins.identity.core.doctor",
    "pas.plugins.identity.core.profiles",
    "pas.plugins.identity.core.subscribers.principals",
    "pas.plugins.identity.core.pas.profile",
    "pas.plugins.identity.core.services.types",
    "pas.plugins.identity.core.services.myprofile",
    "pas.plugins.identity.core.services.groups",
    "pas.plugins.identity.exportimport.importer",
    "pas.plugins.identity.exportimport.exporter",
)


def _patch_portal_types(logger: Logger):
    for name in PROFILE_TYPE_MODULES:
        vars(import_module(name))["PROFILE_PORTAL_TYPE"] = PROFILE_PORTAL_TYPE
    catalog = vars(import_module("pas.plugins.identity.core.catalog"))
    catalog["CATALOGUED_TYPES"] = (PROFILE_PORTAL_TYPE, catalog["GROUP_PORTAL_TYPE"])
    # Only used by sync_core_records, to fill group_content_type
    principals = vars(import_module("pas.plugins.identity.core.subscribers.principals"))
    principals["GROUP_PORTAL_TYPE"] = GROUP_PORTAL_TYPE
    logger.info(f"Patched pas.plugins.identity to use {PROFILE_PORTAL_TYPE}")


def _patch_person(logger: Logger):
    from collective.person.content.person import Person
    from kitconcept.core.content import person

    for name in person.USER_ATTRIBUTES:
        setattr(Person, name, getattr(person.PersonUserMixin, name))
    logger.info("Patched collective.person Person with user attributes")


def apply_patch(logger: Logger):
    """Apply the pas.plugins.identity patches.

    :param logger: Logger used to report the patches.
    """
    _patch_portal_types(logger)
    _patch_person(logger)
