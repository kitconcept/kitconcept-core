from pathlib import Path

import json
import logging


LOCAL_DEFINITIONS = Path(__file__).parent / "local_definitions.json"


def load_local_definitions() -> dict:
    """Load local definitions from JSON file."""
    return json.loads(LOCAL_DEFINITIONS.read_text())


def _add_local_definitions(schema: dict) -> dict:
    """Add local definitions to the schema."""
    local_definitions = load_local_definitions()
    existing_definitions = schema.get("definitions", {})
    definitions_to_add = {}
    for key, value in local_definitions.items():
        if key in existing_definitions:
            logging.warning(
                f"Definition '{key}' already exists in schema.\n"
                "Ignoring local definition."
            )
            continue
        definitions_to_add[key] = value
    schema.setdefault("definitions", {}).update(definitions_to_add)
    return schema


def apply_patch(logger: logging.Logger) -> None:
    """Patch the plone.distribution.utils.schema.enrich_jsonschema to
    inject local definitions into the generated JSON schema.
    This allows us to have a leaner JSON schema in the codebase,
    while still providing all necessary definitions.
    ."""
    from plone.distribution.utils import schema as schema_utils

    old_enrich_jsonschema = schema_utils.enrich_jsonschema
    schema_utils._enrich_jsonschema = old_enrich_jsonschema

    def enrich_jsonschema(schema: dict) -> dict:
        """Process a jsonschema, adding definitions."""
        schema = schema_utils._enrich_jsonschema(schema)
        schema = _add_local_definitions(schema)
        return schema

    schema_utils.enrich_jsonschema = enrich_jsonschema
    logger.info(
        "Applied schema patch to plone.distribution.utils.schema.enrich_jsonschema."
    )
