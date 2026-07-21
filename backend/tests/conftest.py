from dataclasses import dataclass
from kitconcept.core.factory import add_site
from kitconcept.core.testing import ACCEPTANCE_TESTING
from kitconcept.core.testing import FUNCTIONAL_TESTING
from kitconcept.core.testing import INTEGRATION_TESTING
from plone import api
from plone.app.testing.interfaces import SITE_OWNER_NAME
from Products.CMFPlone.Portal import PloneSite
from pytest_plone import fixtures_factory
from typing import Any

import pytest


pytest_plugins = ["pytest_plone"]


globals().update(
    fixtures_factory(
        (
            (ACCEPTANCE_TESTING, "acceptance"),
            (FUNCTIONAL_TESTING, "functional"),
            (INTEGRATION_TESTING, "integration"),
        ),
        keep_session=True,
    )
)


@pytest.fixture
def traverse():
    def func(data: dict | list, path: str | list[str]) -> Any:
        func = None
        path = path.split(":") if isinstance(path, str) else path
        if len(path) == 2:
            func, path = path
        else:
            path = path[0]
        parts: list[str | int] = [part for part in path.split("/") if part.strip()]
        value = data
        for part in parts:
            if isinstance(value, list) and isinstance(part, str):
                part = int(part)
            value = value[part]
        match func:
            # Add other functions here
            case "len":
                value = len(value)
            case "type":
                # This makes it easier to compare
                value = type(value).__name__
            case "is_uuid4":
                value = len(value) == 32 and value[15] == "4"
            case "keys":
                value = list(value.keys())
        return value

    return func


@dataclass
class CurrentVersions:
    base: str
    dependencies: str
    package: str


@pytest.fixture(scope="session")
def current_versions() -> CurrentVersions:
    from kitconcept.core import __version__

    return CurrentVersions(
        base="20260706001",
        dependencies="1000",
        package=__version__,
    )


@pytest.fixture(scope="session")
def distribution_name() -> str:
    return "testing"


@pytest.fixture(scope="session")
def prepare_answers():
    def func() -> dict:
        return {
            "site_id": "plone2",
            "title": "Test Site",
            "description": "Testing site.",
            "available_languages": ["en"],
            "default_language": "en",
            "portal_timezone": "UTC",
            "authentication": {"provider": "internal"},
            "setup_content": False,
        }

    return func


@pytest.fixture(scope="session")
def answers(prepare_answers) -> dict:
    return prepare_answers()


@pytest.fixture(scope="session")
def create_site(distribution_name):
    def func(app, answers: dict) -> PloneSite:
        with api.env.adopt_user(SITE_OWNER_NAME):
            site_id = answers.get("site_id")
            if site_id and (site_id in app.objectIds()):
                app.manage_delObjects(site_id)
            site = add_site(app, distribution=distribution_name, **answers)
        return site

    return func
