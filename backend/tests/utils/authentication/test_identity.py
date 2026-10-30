from kitconcept.core.utils.authentication import identity as utils

import pytest


@pytest.fixture
def answers() -> dict:
    return {
        "provider": "identity-keycloak",
        "identity-server_url": "http://localhost:8180/",
        "identity-realm_name": "site",
        "identity-client_id": "plone",
        "identity-client_secret": "12345678",
        "identity-site-url": "http://localhost:3000/",
        "identity-scope": ["openid", "profile", "email"],
    }


class TestPrepareAnswers:
    def test_strips_prefix(self, answers):
        result = utils._prepare_answers(answers)
        assert result["client_id"] == "plone"
        assert "provider" not in result

    @pytest.mark.parametrize("value", [None, "", []])
    def test_drops_empty_values(self, answers, value):
        answers["identity-scope"] = value
        result = utils._prepare_answers(answers)
        assert "scope" not in result


class TestPrepareConfig:
    @pytest.mark.parametrize(
        "key,expected",
        [
            ["issuer", "http://localhost:8180/realms/site"],
            ["client_id", "plone"],
            ["client_secret", "12345678"],
            ["scope", ["openid", "profile", "email"]],
        ],
    )
    def test_keycloak(self, answers, key: str, expected: str | list[str]):
        result = utils._prepare_config(
            "identity-keycloak", utils._prepare_answers(answers)
        )
        assert result[key] == expected

    @pytest.mark.parametrize("key", ["site-url", "server_url", "realm_name"])
    def test_non_config_keys_removed(self, answers, key: str):
        result = utils._prepare_config(
            "identity-keycloak", utils._prepare_answers(answers)
        )
        assert key not in result

    def test_keycloak_explicit_issuer_wins(self, answers):
        answers["identity-issuer"] = "https://sso.example.com/realms/other"
        result = utils._prepare_config(
            "identity-keycloak", utils._prepare_answers(answers)
        )
        assert result["issuer"] == "https://sso.example.com/realms/other"

    def test_github_has_no_issuer(self):
        answers = {
            "provider": "identity-github",
            "identity-client_id": "gh-123",
            "identity-client_secret": "12345678",
        }
        result = utils._prepare_config(
            "identity-github", utils._prepare_answers(answers)
        )
        assert result == {"client_id": "gh-123", "client_secret": "12345678"}


class TestCallbackUrl:
    def test_from_site_url(self, answers):
        result = utils._callback_url(utils._prepare_answers(answers))
        assert result == "http://localhost:3000/login-identity"

    def test_without_site_url(self, answers):
        answers.pop("identity-site-url")
        result = utils._callback_url(utils._prepare_answers(answers))
        assert result is None
