"""The authentication add-ons are pinned, their profiles carry the pinned
versions on disk, and the distribution's add-on list agrees with the sites."""

from importlib.metadata import version as distribution_version
from kitconcept.core.factory import LocalAddonList
from Products.GenericSetup.tool import SetupTool

import pytest


#: Distributions pinned in ``pyproject.toml``.
PINNED_DISTRIBUTIONS = {
    "pas.plugins.authomatic": "3.1.0",
    "pas.plugins.oidc": "2.1.0",
}

#: Profile versions in the add-ons' metadata.xml. Neither moved in these
#: releases, so the values are the ones they already carried.
ADDON_PROFILES = {
    "pas.plugins.authomatic:default": "1000",
    "pas.plugins.oidc:default": "1002",
}


def recorded_version(setup_tool: SetupTool, profile_id: str) -> str:
    """Return the version recorded for a profile as a plain string.

    ``getLastVersionForProfile`` returns a tuple once an upgrade step has run.

    :param setup_tool: The ``portal_setup`` tool.
    :param profile_id: The profile id.
    :returns: The recorded version, or ``unknown``.
    """
    version = setup_tool.getLastVersionForProfile(profile_id)
    if isinstance(version, tuple):
        return version[0] if version else "unknown"
    return version


class TestPinnedDistributions:
    @pytest.mark.parametrize(
        "name,expected",
        list(PINNED_DISTRIBUTIONS.items()),
    )
    def test_installed_version(self, name: str, expected: str):
        """The installed distribution is the pinned version."""
        assert distribution_version(name) == expected


class TestAddonProfileVersions:
    @pytest.fixture(autouse=True)
    def _setup(self, setup_tool: SetupTool) -> None:
        self.setup_tool = setup_tool

    @pytest.mark.parametrize(
        "profile_id,expected",
        list(ADDON_PROFILES.items()),
    )
    def test_filesystem_version(self, profile_id: str, expected: str):
        """The version in the add-on's metadata.xml is the pinned one."""
        assert self.setup_tool.getVersionForProfile(profile_id) == expected


class TestLocalAddonList:
    def test_installed_entries_at_their_profile_version(self, setup_tool: SetupTool):
        """Every entry of the add-on list that is recorded on the site is at the
        version its profile carries on the file system.
        """
        checked = []
        for addon in LocalAddonList.addon_list:
            recorded = recorded_version(setup_tool, addon.profile_id)
            if recorded == "unknown":
                continue
            checked.append(addon.profile_id)
            assert recorded == setup_tool.getVersionForProfile(addon.profile_id), (
                addon.profile_id
            )
        # Guard against the loop silently checking nothing.
        assert len(checked) > 10

    def test_entries_name_known_profiles(self, setup_tool: SetupTool):
        """Every entry of the add-on list names a profile that exists."""
        for addon in LocalAddonList.addon_list:
            assert setup_tool.profileExists(addon.profile_id), addon.profile_id
