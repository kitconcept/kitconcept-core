from kitconcept.core import PACKAGE_NAME
from Products.GenericSetup.tool import SetupTool

import pytest


@pytest.fixture(scope="module")
def base_profile_id() -> str:
    """Fixture to provide the profile ID for the package."""
    return f"{PACKAGE_NAME}:base"


@pytest.fixture(scope="module")
def list_upgrades(base_profile_id):
    """Fixture to list available upgrades for the package."""
    from Products.GenericSetup.upgrade import listUpgradeSteps

    def _list_upgrades(setup_tool: SetupTool, source: str, dest: str) -> list:
        return listUpgradeSteps(setup_tool, base_profile_id, source, dest)

    return _list_upgrades


class TestUpgrades:
    @pytest.fixture(autouse=True)
    def _setup(self, portal_class, current_versions) -> None:
        self.portal = portal_class
        self.setup_tool: SetupTool = portal_class.portal_setup
        self.version = current_versions.base

    @pytest.mark.parametrize(
        "src_version",
        [
            "20250523001",
            "20250612001",
            "20250902001",
            "20250903001",
            "20250915001",
            "20250916001",
            "20250917001",
            "20251209001",
            "20260122001",
            "20260504001",
            "20260505001",
            "20260619001",
            "20260620001",
        ],
    )
    def test_upgrade_to_latest(self, list_upgrades, src_version: str) -> None:
        """Test that the upgrade step to the latest version is available."""

        upgrades = list_upgrades(self.setup_tool, src_version, self.version)
        assert len(upgrades) > 0, (
            f"No upgrade path found from {src_version} to {self.version}"
        )
