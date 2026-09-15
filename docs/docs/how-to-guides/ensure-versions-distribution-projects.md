---
myst:
  html_meta:
    "description": "Ensure versions in distribution projects with repoplone and a pnpmfile"
    "property=og:description": "Ensure versions in distribution projects with repoplone and a pnpmfile"
    "property=og:title": "Ensure versions in distribution projects"
    "keywords": "kitconcept distribution, ensuring versions, distribution projects, repoplone, pnpmfile"
---

# How to configure a project based on a distribution to ensure versions are consistent with the distribution

When you have a project that is based on a distribution, you need to make sure that the versions of the frontend packages in the project are consistent with the versions declared by the distribution, and that these versions stay in sync across the whole build.

The enforcement has two parts:

- A generated file, `frontend/distribution.json`, that lists the exact dependency versions and the `volto_version` published by the distribution.
- A custom `pnpm` configuration, `frontend/.pnpmfile.cjs`, that applies those versions when installing dependencies.

`frontend/distribution.json` is generated and kept up to date by [RepoPlone](https://github.com/plone/repoplone). You no longer need a project-local `upgrade-distribution.js` script.

```{note}
`frontend/distribution.json` is machine-generated. Do not edit it by hand — it is rewritten every time you run `uvx repoplone deps upgrade frontend`.
```

## How RepoPlone generates `distribution.json`

A Volto distribution package publishes a custom `volto_version` field in its `package.json`. RepoPlone uses that field to recognize a distribution automatically — no extra configuration flag is required.

When you run `uvx repoplone deps upgrade frontend`, RepoPlone:

- reads `[frontend.package]` from `repository.toml` (`base_package` and `path`);
- fetches, from the npm registry, the distribution's `dependencies` and `volto_version` for the target version;
- writes `frontend/distribution.json` with `name`, `version`, `volto_version`, and `dependencies`;
- aligns `frontend/mrs.developer.json` `core.tag` with the distribution's `volto_version`.

See {doc}`/how-to-guides/upgrade-distribution` for the upgrade command, and {doc}`/how-to-guides/upgrade-distribution-make-upgrade` for the `make upgrade` wrapper.

## How `.pnpmfile.cjs` enforces the versions

During `pnpm install`, `frontend/.pnpmfile.cjs` reads `distribution.json` and, through the `readPackage` hook, overrides the versions of any enforced package it finds across the workspace's `package.json` files. This guarantees the whole build resolves to exactly the versions the distribution shipped with.

## Setting up a project

1. Make sure your project root has a `repository.toml` with `[frontend.package]` containing at least `base_package` (the distribution package name) and `path` (the path to your frontend add-on package).

2. Make sure the distribution package is declared as a dependency in your add-on's `package.json`.

3. Add `frontend/.pnpmfile.cjs` with the following content:

   ```js
   const fs = require('fs');
   const path = require('path');

   const distributionPath = path.join(__dirname, 'distribution.json');

   const catalogPath = path.resolve(__dirname, 'core/catalog.json');
   let catalog = {};
   if (fs.existsSync(catalogPath)) {
     const catalogData = fs.readFileSync(catalogPath, 'utf-8');
     catalog = JSON.parse(catalogData);
   } else {
     console.error('Catalog file does not exist at:', catalogPath);
   }

   function getEnforcedDependencies() {
     try {
       if (!fs.existsSync(distributionPath)) return {};
       const distribution = JSON.parse(fs.readFileSync(distributionPath, 'utf-8'));
       if (distribution?.dependencies) return distribution.dependencies;
     } catch (error) {
       return {};
     }
     return {};
   }

   const enforced = getEnforcedDependencies();
   const enforcedKeys = Object.keys(enforced || {});

   function applyOverrides(section) {
     if (!section || enforcedKeys.length === 0) return;
     for (const name of enforcedKeys) {
       if (section[name]) {
         section[name] = enforced[name];
       }
     }
   }

   module.exports = {
     hooks: {
       // Ensure that the distribution dependencies from distribution.json are always
       // used, overriding any other versions specified in package.json files.
       readPackage(pkg) {
         applyOverrides(pkg.dependencies);
         applyOverrides(pkg.devDependencies);
         applyOverrides(pkg.optionalDependencies);
         applyOverrides(pkg.peerDependencies);
         return pkg;
       },
       // Ensure that the default catalog is set in the configuration, if not already
       // specified.
       updateConfig(config) {
         if (config.catalogs) {
           config.catalogs.default ??= catalog;
         }
         return config;
       },
     },
   };
   ```

4. Generate `frontend/distribution.json` by running the upgrade command from the project root:

   ```bash
   uvx repoplone deps upgrade frontend
   ```

5. (Optional) Add a test that verifies the distribution's `volto_version` stays aligned with `mrs.developer.json` `core.tag`. Place it in your add-on's `src` folder (you may need to install `vitest` as a dev dependency):

   ```ts
   import fs from 'node:fs';
   import path from 'node:path';
   import { describe, expect, it } from 'vitest';

   const frontendRoot = path.resolve(__dirname, '..', '..', '..');
   const mrsDeveloperPath = path.join(frontendRoot, 'mrs.developer.json');
   const distributionPath = path.join(frontendRoot, 'distribution.json');

   describe('internal configuration checks', () => {
     it('keeps distribution.volto_version aligned with mrs.developer core.tag', () => {
       const mrsDeveloper = JSON.parse(fs.readFileSync(mrsDeveloperPath, 'utf8'));
       const distribution = JSON.parse(fs.readFileSync(distributionPath, 'utf8'));

       expect(distribution?.volto_version).toBe(mrsDeveloper?.core?.tag);
     });
   });
   ```

6. Review the changes in `frontend/distribution.json` and `frontend/mrs.developer.json` to verify the update, and run your test suite with `make test`.
