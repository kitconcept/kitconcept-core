import pytest


@pytest.fixture(scope="session")
def identity_provider():
    from pas.plugins.identity.api import provider

    def func(provider_id: str):
        return provider.get(provider_id)

    return func
