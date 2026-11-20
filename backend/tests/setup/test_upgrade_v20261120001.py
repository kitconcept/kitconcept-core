"""Upgrade to 20261120001: the authentication add-ons are upgraded on existing sites."""

from kitconcept.core import PACKAGE_NAME
from kitconcept.core.upgrades.v20261120001 import upgrade_addons
from Products.GenericSetup.tool import SetupTool

import pytest


SOURCE = "20261110001"
DESTINATION = "20261120001"
BASE = f"{PACKAGE_NAME}:base"
AUTHOMATIC = "pas.plugins.authomatic:default"
OIDC = "pas.plugins.oidc:default"
#: Versions a site from before this release records for the two add-ons.
OLD_ADDON_VERSIONS = {AUTHOMATIC: "1", OIDC: "1001"}
NEW_ADDON_VERSIONS = {AUTHOMATIC: "1000", OIDC: "1002"}


def recorded_version(setup_tool: SetupTool, profile_id: str) -> str:
    """Return the version recorded for a profile as a plain string.

    :param setup_tool: The ``portal_setup`` tool.
    :param profile_id: The profile id.
    :returns: The recorded version, or ``unknown``.
    """
    version = setup_tool.getLastVersionForProfile(profile_id)
    if isinstance(version, tuple):
        return version[0] if version else "unknown"
    return version


def flatten_upgrades(entries: list) -> list[dict]:
    """Flatten ``listUpgrades`` output, which nests grouped steps in lists.

    :param entries: The return value of ``listUpgrades``.
    :returns: One dict per upgrade step.
    """
    steps: list[dict] = []
    for entry in entries:
        steps.extend(entry if isinstance(entry, list) else [entry])
    return steps


class TestUpgrade:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, setup_tool: SetupTool) -> None:
        """Put the site back at the source version, with the add-ons at their
        old versions. Each test runs in its own transaction, so nothing leaks.
        """
        self.portal = portal
        self.setup_tool = setup_tool
        setup_tool.setLastVersionForProfile(BASE, SOURCE)
        for profile_id, version in OLD_ADDON_VERSIONS.items():
            setup_tool.setLastVersionForProfile(profile_id, version)

    def test_offered_from_source(self):
        """A site at the source version is offered exactly this step."""
        steps = flatten_upgrades(self.setup_tool.listUpgrades(BASE))

        assert [(s["ssource"], s["sdest"]) for s in steps] == [(SOURCE, DESTINATION)]

    def test_base_version_is_current(self):
        """The base profile's filesystem version is the destination."""
        assert self.setup_tool.getVersionForProfile(BASE) == DESTINATION

    def test_runs_addon_upgrades(self):
        """Running the step brings both add-ons to their new versions."""
        upgrade_addons(self.setup_tool)

        for profile_id, expected in NEW_ADDON_VERSIONS.items():
            assert recorded_version(self.setup_tool, profile_id) == expected
            assert self.setup_tool.listUpgrades(profile_id) == []

    def test_runs_through_migration_tool(self):
        """The migration tool runs the step and the add-on list on a site."""
        assert flatten_upgrades(self.setup_tool.listUpgrades(BASE)) != []

        self.portal.portal_migration.upgrade()

        assert recorded_version(self.setup_tool, BASE) == DESTINATION
        for profile_id, expected in NEW_ADDON_VERSIONS.items():
            assert recorded_version(self.setup_tool, profile_id) == expected

    def test_leaves_uninstalled_addon_alone(self):
        """An add-on the site does not have is not installed or upgraded."""
        self.setup_tool.setLastVersionForProfile(AUTHOMATIC, "unknown")

        upgrade_addons(self.setup_tool)

        assert recorded_version(self.setup_tool, AUTHOMATIC) == "unknown"
        assert recorded_version(self.setup_tool, OIDC) == NEW_ADDON_VERSIONS[OIDC]
