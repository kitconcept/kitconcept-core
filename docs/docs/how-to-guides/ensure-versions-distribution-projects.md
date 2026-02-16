---
myst:
  html_meta:
    "description": "Ensure versions in distribution projects via an instance script"
    "property=og:description": "Ensure versions in distribution projects via an instance script"
    "property=og:title": "Ensure versions in distribution projects via an instance script"
    "keywords": "kitconcept distribution, ensuring versions, distribution projects, instance script"
---

# How to ensure frontend packages consistent versions in projects based on a distribution

When you have a project that is based on a distribution, you want to make sure that the versions of the frontend packages in the project are consistent with the versions in the distribution.

We can achieve this by running a script `update-distribution-config.js`.

## `update-distribution-config.js`

`frontend/scripts/update-distribution-config.js` keeps local frontend distribution config in sync with `repository.toml` and the add-on package dependencies.

### What it reads

- `repository.toml` (`[frontend.package]`):
  - `base_package` (distribution package name)
  - `path` (path to the frontend add-on package)
- `<path>/package.json`: finds the distribution version declared for `base_package`
- npm metadata via `pnpm view`:
  - distribution `dependencies`
  - distribution `volto_version` (falls back to installed package `volto_version`)
- existing `frontend/volto.config.js` (only to preserve `addons` and `theme`)

### What it writes

- `frontend/volto.config.js`
  - rewrites the file
  - preserves existing `addons` and `theme`
  - updates `distribution` to:
    - `name`
    - `version`
    - `volto_version`
    - `dependencies`
- `frontend/mrs.developer.json`
  - sets `core.tag` to the resolved distribution `volto_version`

### How Makefile uses it

In `frontend/Makefile`, target `install` runs:

1. `node scripts/update-distribution-config.js`
2. `pnpm dlx mrs-developer missdev --no-config --fetch-https`
3. `pnpm i`
4. `pnpm exec prettier --write volto.config.js`
5. `make build-deps`

This means the script is the first step that updates the files it controls (`volto.config.js` and `mrs.developer.json`) before dependency resolution and installation.

From the repository root, `make frontend-install` calls `make -C ./frontend install`, so the same update flow is used there too.

## Setting `update-distribution-config.js` up

In the future it will be included in the `frontend` template for kitconcept projects based on a distribution.

For now, you can follow these instructions:

1. Copy it from `frontend/scripts/update-distribution-config.js` in this repository to your project `frontend` folder.
1. Make sure to have a `repository.toml` in your project root with the required fields (`[frontend.package]` with `base_package` and `path`).
1. Make sure to have the distribution package declared as a dependency in your add-on `package.json`.
1. Copy `frontend/scripts/.pnpmfile.cjs` to your project `frontend` folder.
1. Amend your `frontend/Makefile` to run `node scripts/update-distribution-config.js` as the first step in the `install` target. The `install` target should look like this:

```makefile
install:
  node scripts/update-distribution-config.js
  pnpm dlx mrs-developer missdev --no-config --fetch-https
  pnpm i
  pnpm exec prettier --write volto.config.js
  make build-deps
```

1. Copy `frontend/scripts/internalChecks.test.ts` to your add-on `src` folder. This will add a test that checks that the distribution versions are consistent with the distribution package dependencies. You might have to install `vitest` as a dev dependency to run the test.
1. Run `make frontend-install` from your project root to trigger the update and install flow.
1. Check the changes in `frontend/volto.config.js` and `frontend/mrs.developer.json` to verify the update.
1. Run the tests `make test` to verify the internal check.
