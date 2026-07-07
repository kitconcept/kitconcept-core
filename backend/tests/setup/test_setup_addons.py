from plone import api

import pytest


class TestAddonsList:
    @pytest.fixture(autouse=True)
    def _setup(self, portal_class) -> None:
        self.portal = portal_class

    def test_addons_list_should_be_empty(self) -> None:
        """Test that the addons list should be empty."""
        with api.env.adopt_roles(["Manager"]):
            addons = api.addon.get_addons()
            assert addons == [], "Expected no addons to be installed, but found some."
