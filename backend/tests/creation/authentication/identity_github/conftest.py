import pytest


@pytest.fixture(scope="session")
def answers():
    return {
        "site_id": "site",
        "title": "Site",
        "description": "Site created with A CMS solution for public websites. Created by kitconcept.",
        "available_languages": ["en"],
        "default_language": "en",
        "portal_timezone": "Europe/Berlin",
        "setup_content": True,
        "authentication": {
            "provider": "identity-github",
            "identity-client_id": "gh-32510011",
            "identity-client_secret": "12345678",
        },
    }
