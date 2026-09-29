from plone import api

import json
import pytest


KEY = "pas.plugins.authomatic.interfaces.IPasPluginsAuthomaticSettings.json_config"


@pytest.fixture(scope="session")
def authomatic_config():
    def func() -> dict:
        return json.loads(api.portal.get_registry_record(KEY))

    return func


@pytest.fixture(scope="session")
def identity_provider():
    from pas.plugins.identity.api import provider

    def func(provider_id: str):
        return provider.get(provider_id)

    return func
