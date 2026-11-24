"""The Google login settings match the current format of pas.plugins.authomatic."""

from pas.plugins.authomatic.config import validate_cfg_json
from pas.plugins.authomatic.interfaces import IPasPluginsAuthomaticSettings
from pas.plugins.authomatic.plugin import AuthomaticPlugin
from plone import api

import json
import pytest


KEY = "pas.plugins.authomatic.interfaces.IPasPluginsAuthomaticSettings.json_config"
PLUGIN_ID = "authomatic"
PROFILE_ID = "pas.plugins.authomatic:default"


class TestAuthomaticGoogleAddon:
    @pytest.fixture(autouse=True)
    def _setup(self, portal):
        self.portal = portal

    def test_json_config_is_valid(self):
        """The stored JSON passes the add-on's validator and registry field."""
        raw = api.portal.get_registry_record(KEY)
        assert validate_cfg_json(raw) is True
        IPasPluginsAuthomaticSettings["json_config"].validate(raw)

    def test_provider_configured(self):
        """The provider is stored under the key the add-on reads."""
        config = json.loads(api.portal.get_registry_record(KEY))
        assert list(config) == ["google"]

    def test_login_plugin_in_acl_users(self):
        """Logging in finds the plugin in acl_users, with the add-on's class."""
        assert isinstance(self.portal.acl_users.get(PLUGIN_ID), AuthomaticPlugin)

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
        assert version == "1000"
