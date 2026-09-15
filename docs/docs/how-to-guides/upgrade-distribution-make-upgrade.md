---
myst:
  html_meta:
    "description": "Upgrade a distribution-based frontend project using make upgrade"
    "property=og:description": "Upgrade a distribution-based frontend project using make upgrade"
    "property=og:title": "Upgrade a distribution-based frontend project using make upgrade"
    "keywords": "kitconcept distribution, make upgrade, volto distribution upgrade, repoplone"
---

# How to upgrade a distribution-based project

Use this guide in projects based on a frontend distribution where `frontend/Makefile` provides an `upgrade` target that wraps RepoPlone.

## Prerequisites

- `repository.toml` contains `[frontend.package]` with:
  - `base_package` (the distribution package name)
  - `path` (the path to your frontend add-on package)
- The add-on package at `path` declares the distribution package in `package.json`.
- `frontend/.pnpmfile.cjs` reads `frontend/distribution.json` to enforce the distribution versions.
- `frontend/Makefile` has an `upgrade` target that runs RepoPlone:

  ```makefile
  upgrade:
  	cd .. && uvx repoplone deps upgrade frontend
  ```

For setup details, see {doc}`/how-to-guides/ensure-versions-distribution-projects`.

## Upgrade steps

1. From the project root, upgrade the frontend distribution.

   To upgrade to the latest version, run:

   ```bash
   uvx repoplone deps upgrade frontend
   ```

   Or pin a specific version:

   ```bash
   uvx repoplone deps upgrade frontend <version>
   ```

   If your `frontend/Makefile` provides the `upgrade` target, you can run it instead:

   ```bash
   make -C frontend upgrade
   ```

2. Review the generated changes in:
   - `frontend/distribution.json`
   - `frontend/mrs.developer.json`

3. Run tests:

   ```bash
   make test
   ```

## What the upgrade does

- Bumps the distribution version pinned in your add-on's `package.json`.
- Because the distribution publishes a `volto_version`, RepoPlone recognizes it as a distribution and, for the target version:
  - writes `frontend/distribution.json` with the distribution `name`, `version`, resolved `volto_version`, and the enforced `dependencies`;
  - updates `frontend/mrs.developer.json` `core.tag` with the resolved `volto_version`.
- Syncs the lockfile by running `make frontend-install`. During install, `frontend/.pnpmfile.cjs` enforces the versions listed in `distribution.json` across the workspace.

```{note}
Review the changelog and release notes for the new version to understand the changes introduced in the distribution.
```
