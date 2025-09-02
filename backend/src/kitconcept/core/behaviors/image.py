from plone.autoform.interfaces import IFormFieldProvider
from plone.namedfile import field as namedfile
from plone.supermodel import model
from plone.volto import _
from zope.interface import provider


@provider(IFormFieldProvider)
class IImage(model.Schema):
    image = namedfile.NamedBlobImage(
        title=_("label_image", default="Image"),
        description=_(
            "help_image",
            default="Insert an image that will be used in listing and teaser blocks.",
        ),
        required=False,
    )
