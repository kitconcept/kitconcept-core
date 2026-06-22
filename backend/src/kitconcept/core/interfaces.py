"""Module where all interfaces, events and exceptions live."""

from plone.base.interfaces import IAddonList as IAddonListBase
from zope.publisher.interfaces.browser import IDefaultBrowserLayer


class IBrowserLayer(IDefaultBrowserLayer):
    """Marker interface that defines a browser layer."""


class IAddonList(IAddonListBase):
    """DEPRECATED: List of add ons managed by migration tool."""
