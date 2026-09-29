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
            "provider": "identity-oidc",
            "identity-issuer": "https://auth.example.com",
            "identity-client_id": "plone",
            "identity-client_secret": "12345678",
            "identity-site-url": "https://www.example.com",
        },
    }
