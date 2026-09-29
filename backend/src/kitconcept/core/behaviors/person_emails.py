from kitconcept.core import _
from plone.autoform.directives import read_permission
from plone.autoform.directives import write_permission
from plone.autoform.interfaces import IFormFieldProvider
from plone.schema import Email
from plone.supermodel import model
from zope import schema
from zope.interface import provider


@provider(IFormFieldProvider)
class IPersonEmails(model.Schema):
    """Email addresses of a Person that represents a user.

    Same fields as the ``pas.plugins.identity.email_addresses`` behavior, but
    optional: a Person that is not a user does not need an address.
    """

    model.fieldset(
        "email",
        label=_("Email"),
        fields=["emails", "email"],
    )

    emails = schema.Tuple(
        title=_("label_person_emails", default="Email addresses"),
        description=_(
            "help_person_emails",
            default="The addresses this person uses to sign in, most preferred first.",
        ),
        value_type=Email(title=_("Email")),
        required=False,
        missing_value=(),
        default=(),
    )

    email = Email(
        title=_("Email"),
        description=_(
            "help_person_email",
            default="The first verified address above, or the first one when "
            "none is verified.",
        ),
        required=False,
        readonly=True,
    )

    write_permission(emails="pas.plugins.identity.content.edit")
    read_permission(
        emails="pas.plugins.identity.content.viewpii",
        email="pas.plugins.identity.content.viewpii",
    )
