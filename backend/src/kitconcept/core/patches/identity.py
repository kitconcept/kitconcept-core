"""Give ``Person`` the user attributes of ``pas.plugins.identity``.

``Person`` is the user content type (``user_content_type``), so the identity
catalog and the PAS plugins read from a ``Person`` the attributes they read
from a ``UserProfile``. The ``collective.person`` class gets them here.
"""

from logging import Logger


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
    _patch_person(logger)
