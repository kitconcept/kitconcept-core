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
            "provider": "identity-keycloak",
            "identity-server_url": "http://localhost:8180",
            "identity-realm_name": "site",
            "identity-client_id": "plone",
            "identity-client_secret": "12345678",
            "identity-site-url": "http://localhost:3000",
            "identity-scope": ["openid", "profile", "email"],
        },
    }
