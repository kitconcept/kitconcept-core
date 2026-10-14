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
            "provider": "identity-google",
            "identity-client_id": "google-12345",
            "identity-client_secret": "12345678",
            "identity-scope": ["openid", "email"],
        },
    }
