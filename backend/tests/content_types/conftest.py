from collections.abc import Generator
from kitconcept.core.factory import add_site
from plone import api
from plone.app.testing.interfaces import SITE_OWNER_NAME
from Products.CMFPlone.Portal import PloneSite

import pytest


@pytest.fixture(scope="class")
def portal(portal_class) -> Generator[PloneSite, None, None]:
    yield portal_class


@pytest.fixture(scope="session")
def create_site(distribution):
    def func(app, answers: dict) -> PloneSite:
        with api.env.adopt_user(SITE_OWNER_NAME):
            site = add_site(app, distribution=distribution, **answers)
        return site

    return func
