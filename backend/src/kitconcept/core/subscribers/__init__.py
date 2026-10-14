from collective.person.content.person import Person
from pas.plugins.identity.core.indexers.subscribers import profile_moved
from pas.plugins.identity.core.interfaces import IUserProfile
from zope.interface import alsoProvides
from zope.lifecycleevent.interfaces import IObjectAddedEvent


def is_user(person: Person) -> bool:
    """Report whether a Person represents a user account.

    :param person: The Person.
    :returns: Whether it provides :class:`IUserProfile`.
    """
    return IUserProfile.providedBy(person)


def person_added(person: Person, event: IObjectAddedEvent) -> None:
    """Mark a Person created for a user account as a user profile.

    pas.plugins.identity creates a user's content with a ``login``. Only those
    Persons become users; other Persons remain plain content.

    The identity catalog subscribers are bound to the marker, and they were
    already looked up for this event, so index the Person here.

    :param person: The Person.
    :param event: The added event.
    """
    if is_user(person) or not person.login:
        return
    alsoProvides(person, IUserProfile)
    profile_moved(person, event)
