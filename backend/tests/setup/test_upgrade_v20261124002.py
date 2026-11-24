"""Upgrade to 20261124002: LRFs use ``document_view`` instead of ``summary_view``."""

from collections.abc import Generator
from kitconcept.core import PACKAGE_NAME
from kitconcept.core.upgrades.v20261124002 import upgrade_multilingual
from plone.dexterity.fti import DexterityFTI
from Products.CMFPlone.Portal import PloneSite
from Products.GenericSetup.tool import SetupTool

import pytest


SOURCE = "20261124001"
DESTINATION = "20261124002"
BASE = f"{PACKAGE_NAME}:base"
MULTILINGUAL = f"{PACKAGE_NAME}:multilingual"


@pytest.fixture(scope="session")
def answers() -> dict:
    return {
        "site_id": "plone3",
        "title": "Test Site",
        "description": "Testing site.",
        "available_languages": ["de", "en"],
        "default_language": "de",
        "portal_timezone": "UTC",
        "setup_content": False,
    }


@pytest.fixture(scope="class")
def portal(app_class, create_site, answers) -> Generator[PloneSite, None, None]:
    site = create_site(app=app_class, answers=answers)
    yield site


class TestUpgrade:
    @pytest.fixture(autouse=True)
    def _setup(self, portal, get_fti) -> None:
        """Put the site back where a site from before this release was."""
        self.portal = portal
        self.setup_tool: SetupTool = portal.portal_setup
        self.fti: DexterityFTI = get_fti("LRF")
        self.setup_tool.setLastVersionForProfile(BASE, SOURCE)
        self.setup_tool.setLastVersionForProfile(MULTILINGUAL, "1001")
        self.fti.default_view = "summary_view"
        self.fti.view_methods = ("summary_view",)
        self.lrfs = [obj for obj in portal.objectValues() if obj.portal_type == "LRF"]

    def test_offered_from_source(self):
        """A site at the source version is offered exactly this step."""
        steps = []
        for entry in self.setup_tool.listUpgrades(BASE):
            steps.extend(entry if isinstance(entry, list) else [entry])

        assert [(s["ssource"], s["sdest"]) for s in steps] == [(SOURCE, DESTINATION)]

    def test_base_version_is_current(self):
        """The base profile's filesystem version is the destination."""
        assert self.setup_tool.getVersionForProfile(BASE) == DESTINATION

    def test_site_has_lrfs(self):
        assert {lrf.getId() for lrf in self.lrfs} == {"de", "en"}

    def test_lrf_layout_before(self):
        for lrf in self.lrfs:
            assert lrf.getLayout() == "summary_view"

    def test_updates_fti(self):
        upgrade_multilingual(self.setup_tool)

        assert self.fti.default_view == "document_view"
        assert self.fti.view_methods == ("document_view",)
        assert self.setup_tool.getLastVersionForProfile(MULTILINGUAL) == ("1002",)

    def test_removes_stored_summary_view(self):
        self.lrfs[0].setLayout("summary_view")

        upgrade_multilingual(self.setup_tool)

        assert "layout" not in self.lrfs[0].aq_base.__dict__
        for lrf in self.lrfs:
            assert lrf.getLayout() == "document_view"

    def test_runs_through_migration_tool(self):
        self.portal.portal_migration.upgrade()

        assert self.setup_tool.getLastVersionForProfile(BASE) == (DESTINATION,)
        assert self.fti.default_view == "document_view"
