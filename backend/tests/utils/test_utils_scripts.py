from kitconcept.core.utils import scripts
from pathlib import Path

import pytest


@pytest.fixture
def answers_file():
    path = Path(__file__).parent / "default.json"
    return path


@pytest.mark.parametrize(
    "key,value,expected",
    (
        ("site_id", "", "Plone"),
        ("site_id", "Site", "Site"),
        ("title", "", "Core!"),
        ("title", "Foo Bar", "Foo Bar"),
        ("description", "A new site", "A new site"),
        (
            "description",
            "",
            "kitconcept core distribution",
        ),
        ("available_languages", "", ["en"]),
        ("available_languages", ["de", "en"], ["de", "en"]),
        ("default_language", "", "en"),
        ("default_language", "de", "de"),
        ("portal_timezone", "", "UTC"),
        ("portal_timezone", "America/Sao_Paulo", "America/Sao_Paulo"),
        ("setup_content", "", False),
        ("setup_content", "f", False),
        ("setup_content", "t", True),
    ),
)
def test_parse_answers(answers_file, key: str, value: str, expected: str | bool):
    answers = {key: value}
    result = scripts.parse_answers(answers_file, answers)
    assert result[key] == expected


@pytest.mark.parametrize(
    "value,expected",
    (
        (None, False),
        (True, True),
        (False, False),
        ("t", True),
        ("true", True),
        ("True", True),
        ("TRUE", True),
        ("y", True),
        ("yes", True),
        ("on", True),
        ("1", True),
        ("  yes  ", True),
        ("", False),
        ("f", False),
        ("false", False),
        ("no", False),
        ("0", False),
        ("maybe", False),
    ),
)
def test_as_bool(value, expected: bool):
    assert scripts.as_bool(value) is expected


@pytest.mark.parametrize(
    "value,expected",
    (
        ("", []),
        (None, []),
        ("en", ["en"]),
        ("en,de,fr", ["en", "de", "fr"]),
        ("en, de, fr", ["en", "de", "fr"]),
        ("  en ,  de ", ["en", "de"]),
        ("en,", ["en", ""]),
    ),
)
def test_as_list(value, expected: list[str]):
    assert scripts.as_list(value) == expected


class TestGetEnvironmentalVariables:
    options = scripts.OPTIONS

    def test_empty_when_no_env_vars(self, monkeypatch):
        """No relevant variables set yields an empty mapping."""
        for env_var in (
            "SITE_ID",
            "SITE_TITLE",
            "SITE_AVAILABLE_LANGUAGES",
            "SITE_SETUP_CONTENT",
            "SITE_AUTHENTICATION_PROVIDER",
        ):
            monkeypatch.delenv(env_var, raising=False)
        assert scripts.get_environmental_variables(self.options) == {}

    def test_plain_value(self, monkeypatch):
        monkeypatch.setenv("SITE_ID", "Plone")
        assert scripts.get_environmental_variables(self.options)["site_id"] == "Plone"

    def test_only_set_keys_are_returned(self, monkeypatch):
        monkeypatch.setenv("SITE_ID", "Plone")
        monkeypatch.delenv("SITE_TITLE", raising=False)
        result = scripts.get_environmental_variables(self.options)
        assert "site_id" in result
        assert "title" not in result

    def test_empty_string_is_kept(self, monkeypatch):
        """An explicitly empty variable is included (it is not ``marker``)."""
        monkeypatch.setenv("SITE_TITLE", "")
        assert scripts.get_environmental_variables(self.options)["title"] == ""

    def test_as_list_transform(self, monkeypatch):
        monkeypatch.setenv("SITE_AVAILABLE_LANGUAGES", "en, de")
        assert scripts.get_environmental_variables(self.options)[
            "available_languages"
        ] == ["en", "de"]

    @pytest.mark.parametrize(
        "value,expected",
        (("1", True), ("false", False)),
    )
    def test_as_bool_transform(self, monkeypatch, value: str, expected: bool):
        monkeypatch.setenv("SITE_SETUP_CONTENT", value)
        assert (
            scripts.get_environmental_variables(self.options)["setup_content"]
            is expected
        )

    def test_nested_authentication_keys(self, monkeypatch):
        monkeypatch.setenv("SITE_AUTHENTICATION_PROVIDER", "oidc")
        monkeypatch.setenv(
            "SITE_AUTHENTICATION_OIDC-SERVER_URL", "https://auth.example.com"
        )
        monkeypatch.setenv("SITE_AUTHENTICATION_OIDC-SCOPE", "openid, email")
        result = scripts.get_environmental_variables(self.options)
        assert result["authentication"] == {
            "provider": "oidc",
            "oidc-server_url": "https://auth.example.com",
            "oidc-scope": ["openid", "email"],
        }

    def test_mixed_plain_and_nested(self, monkeypatch):
        monkeypatch.setenv("SITE_ID", "Plone")
        monkeypatch.setenv("SITE_AUTHENTICATION_PROVIDER", "oidc")
        result = scripts.get_environmental_variables(self.options)
        assert result["site_id"] == "Plone"
        assert result["authentication"] == {"provider": "oidc"}


class TestCreateSite:
    distribution = "testing"

    @pytest.fixture(autouse=True)
    def _setup(self, app, answers_file):
        self.app = app
        self.answers_file = answers_file

    def test_create_site(self):
        site = scripts.create_site(
            app=self.app,
            answers_file=self.answers_file,
            env_answers={},
            package_iface=None,
            env_options=scripts.OPTIONS,
            distribution=self.distribution,
        )
        assert site is not None
        assert site.id == "Plone"
