import pytest


class TestSitesEndpoint:
    @pytest.fixture(autouse=True)
    def _setup(self, api_manager_request, distribution):
        self.api_session = api_manager_request
        self.url = f"@sites/{distribution}"

    def test_get(self):
        response = self.api_session.get(self.url)
        data = response.json()
        assert response.status_code == 200
        assert isinstance(data, dict)

    @pytest.mark.parametrize(
        "key",
        (
            "languages",
            "timezones",
            "field-scope",
            "keycloak",
            "oidc",
            "authomatic-github",
            "authomatic-google",
        ),
    )
    def test_get_add_definitions(self, key: str):
        """Test patch that adds our local definitions to the schema."""
        response = self.api_session.get(self.url)
        data = response.json()
        schema = data.get("schema", {})
        definitions = schema.get("definitions", {})
        assert key in definitions

    def test_post(self, answers):
        response = self.api_session.post(self.url, json=answers)
        data = response.json()
        assert response.status_code == 200
        assert isinstance(data, dict)
        assert data["id"] == answers["site_id"]
        assert data["_profile_id"] == "kitconcept.core:base"
