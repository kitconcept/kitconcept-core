from collective.person.content.person import Person
from kitconcept.core import logger
from kitconcept.core.content.person import split_fullname
from plone import api


def create_person_for_user(userid: str) -> Person | None:
    """Create the Person representing an existing user account.

    Does nothing when the user already has a profile.

    :param userid: The userid.
    :returns: The new Person, or ``None`` when none was created.
    """
    from pas.plugins.identity.core.container import get_container
    from pas.plugins.identity.core.profiles import get_profile

    if get_profile(userid) is not None:
        return None
    user = api.user.get(userid=userid)
    if user is None:
        logger.warning(f"User {userid} not found, no Person created")
        return None
    login = user.getUserName()
    first_name, last_name = split_fullname(user.getProperty("fullname", "") or "")
    first_name = first_name or login
    email = user.getProperty("email", "") or ""
    with api.env.adopt_roles(["Manager"]):
        container = get_container(create=True)
        person = api.content.create(
            container=container,
            type="Person",
            id=userid,
            login=login,
            first_name=first_name,
            last_name=last_name,
            emails=(email,) if email else (),
        )
    logger.info(f"Created Person for user {userid}")
    return person


def create_persons_for_users() -> list[str]:
    """Create a Person for every user in ``source_users``.

    :returns: The userids a Person was created for.
    """
    portal = api.portal.get()
    created = []
    for userid in portal.acl_users.source_users.getUserIds():
        if create_person_for_user(userid) is not None:
            created.append(userid)
    return created
