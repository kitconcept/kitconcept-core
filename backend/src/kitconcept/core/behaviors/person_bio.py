from collective.person.behaviors.person import IPersonData
from kitconcept.core import _
from plone.app.dexterity.textindexer import searchable
from plone.app.textfield import RichText as RichTextField
from plone.autoform import directives as form
from plone.autoform.interfaces import IFormFieldProvider
from plone.supermodel import model
from zope.interface import provider


@provider(IFormFieldProvider)
class IPersonBiography(model.Schema):
    """A behavior to add a biography field to a person."""
    # Modify the existing description field
    IPersonData["description"].__dict__['title'] = _(
        "label_person_description_title", default="Summary"
    )
    IPersonData["description"].__dict__['description'] = _(
        "label_person_description_help", default=""
    )

    text = RichTextField(
        title=_("label_person_biography", default="Biography"),
        required=False,
    )
    model.primary("text")
    searchable("text")
    form.order_after(
        text= "collective.person.behaviors.person.IPersonData.last_name"
    )
