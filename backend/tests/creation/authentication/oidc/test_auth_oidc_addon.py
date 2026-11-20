"""The OIDC login plugin of a new site is usable with pas.plugins.oidc 2.1.0."""

from pas.plugins.oidc.plugins import OIDCPlugin
from plone import api

import pytest


PLUGIN_ID = "oidc"
PROFILE_ID = "pas.plugins.oidc:default"


class TestOIDCAddon:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    def test_login_plugin_in_acl_users(self):
        """Logging in finds the plugin in acl_users, with the add-on's class."""
        assert isinstance(self.portal.acl_users.get(PLUGIN_ID), OIDCPlugin)

    def test_active_for_every_interface_it_implements(self):
        """The plugin is activated for each PAS interface it implements."""
        acl_users = self.portal.acl_users
        plugin = acl_users.get(PLUGIN_ID)
        types = acl_users.plugins.listPluginTypeInfo()
        implemented = [t["id"] for t in types if plugin.testImplements(t["interface"])]
        active = [
            t["id"]
            for t in types
            if plugin.testImplements(t["interface"])
            and PLUGIN_ID in acl_users.plugins.listPluginIds(t["interface"])
        ]
        assert implemented
        assert active == implemented

    def test_profile_version_recorded(self):
        """The site records the add-on profile at its version."""
        setup_tool = api.portal.get_tool("portal_setup")
        version = setup_tool.getLastVersionForProfile(PROFILE_ID)
        if isinstance(version, tuple):
            version = version[0]
        assert version == "1002"

    @pytest.mark.parametrize(
        "attr,expected",
        [
            ("userinfo_endpoint_method", "POST"),
        ],
    )
    def test_new_attributes_have_defaults(self, attr: str, expected: str):
        """Attributes added in 2.1.0 hold the add-on's default on a new site."""
        assert getattr(self.portal.acl_users.oidc, attr) == expected
