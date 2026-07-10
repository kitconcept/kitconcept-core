from kitconcept.core.interfaces import IBrowserLayer
from kitconcept.core.utils import scripts
from pathlib import Path
from typing import Any

import os


SCRIPT_DIR = Path().cwd() / "scripts"

OPTIONS: tuple[tuple[str, str, Any], ...] = (
    ("site_id", "SITE_ID", None),
    ("title", "SITE_TITLE", None),
    ("description", "SITE_DESCRIPTION", None),
    ("available_languages", "SITE_AVAILABLE_LANGUAGES", scripts.as_list),
    ("distribution", "DISTRIBUTION", None),
    ("default_language", "SITE_DEFAULT_LANGUAGE", None),
    ("portal_timezone", "SITE_PORTAL_TIMEZONE", None),
    ("setup_content", "SITE_SETUP_CONTENT", scripts.as_bool),
)


def main():
    app = globals()["app"]
    filename = os.getenv("ANSWERS", "default.json")
    answers_file = SCRIPT_DIR / filename
    scripts.create_site(
        app=app,
        answers_file=answers_file,
        env_answers={},
        package_iface=[IBrowserLayer],
        env_options=OPTIONS,
    )


if __name__ == "__main__":
    main()
