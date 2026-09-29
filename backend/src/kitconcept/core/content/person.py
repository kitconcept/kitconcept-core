"""Person as the user content type of pas.plugins.identity.

A ``Person`` is a user only when it represents an account: it was created with
a ``login``, and it provides :class:`IUserProfile`. Other ``Person`` objects,
like team pages, remain plain content.
"""

from collective.person.content.person import IPerson as IBasePerson
from kitconcept.core import logger
from pas.plugins.identity.core.interfaces import IUserContent
from pas.plugins.identity.core.utils.emails import clean
from pas.plugins.identity.core.utils.emails import normalize
from pas.plugins.identity.core.utils.emails import preferred_address
from pas.plugins.identity.core.utils.emails import verified_addresses
from typing import TYPE_CHECKING


class IPerson(IBasePerson, IUserContent):
    """A Person that can represent a user.

    pas.plugins.identity only creates users of a type whose schema extends
    :class:`IUserContent`.
    """


def split_fullname(fullname: str) -> tuple[str, str]:
    """Split a full name into first and last name.

    :param fullname: The full name.
    :returns: First name and last name, empty when there is no full name.
    """
    parts = fullname.strip().split(maxsplit=1)
    if not parts:
        return "", ""
    return parts[0], parts[1] if len(parts) > 1 else ""


# Attributes copied into collective.person's Person class
USER_ATTRIBUTES = (
    "login",
    "email_confirmation_pending",
    "userid",
    "fullname",
    "emails",
    "email",
    "verified_emails",
)


class PersonUserMixin:
    """User attributes of a Person, mirroring pas.plugins.identity UserProfile."""

    if TYPE_CHECKING:
        title: str
        first_name: str
        last_name: str

        def getId(self) -> str: ...

    login = ""

    email_confirmation_pending = False

    @property
    def userid(self) -> str:
        """Return the userid, which is the object id.

        :returns: The userid.
        """
        return self.getId()

    @userid.setter
    def userid(self, value: str) -> None:
        """Ignore writes: the userid is derived from the object id.

        :param value: The value being written.
        """
        if value and value != self.getId():
            logger.warning(
                f"Ignoring an attempt to set userid to {value!r} on {self.getId()!r}"
            )

    @property
    def fullname(self) -> str:
        """Return the full name, which is the Person title.

        :returns: The full name.
        """
        return self.title or ""

    @fullname.setter
    def fullname(self, value: str) -> None:
        """Store a full name in the first and last name fields.

        :param value: The full name. An empty value is ignored.
        """
        first_name, last_name = split_fullname(value or "")
        if not first_name:
            return
        self.first_name = first_name
        self.last_name = last_name

    @property
    def emails(self) -> tuple[str, ...]:
        """Return the addresses of this person, most preferred first.

        :returns: The addresses.
        """
        return getattr(self, "_emails", ())

    @emails.setter
    def emails(self, value: object) -> None:
        """Store the addresses, normalized and de-duplicated.

        :param value: The addresses.
        """
        self._emails = clean(value)

    @property
    def email(self) -> str:
        """Return the address that stands for this person.

        :returns: The first verified address, else the first address.
        """
        return preferred_address(self.getId(), self.emails)

    @email.setter
    def email(self, value: str) -> None:
        """Move an address to the front of :attr:`emails`.

        :param value: The address.
        """
        address = normalize(value)
        if not address:
            return
        self.emails = (address, *(a for a in self.emails if a != address))

    @property
    def verified_emails(self) -> tuple[str, ...]:
        """Return the addresses this site verified for this person.

        :returns: The verified addresses.
        """
        return verified_addresses(self.getId(), self.emails)
