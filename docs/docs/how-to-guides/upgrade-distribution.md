---
myst:
  html_meta:
    "description": "Upgrade a distribution version"
    "property=og:description": "Upgrade a distribution version"
    "property=og:title": "Upgrade a distribution version"
    "keywords": "kitconcept distribution, upgrade distribution, RepoPlone"
---

# How to upgrade a distribution version

This document describes how to upgrade a distribution version in a monorepo managed by RepoPlone.

1. Verify the current base package version and identify the latest available version:

```bash
uvx repoplone deps check
```

2. Execute the upgrade command with your target version:

```bash
uvx repoplone deps upgrade <component> <version>
```

Replace `<component>` with the component to update (for example `backend`). To display all available components, execute `uvx repoplone deps check` 

## Upgrade backend component

To upgrade the backend component to the latest version, execute:

```bash
uvx repoplone deps upgrade backend
```

## Upgrade frontend component

To upgrade the frontend component to the latest version, execute:

```bash
uvx repoplone deps upgrade frontend
```


```{note}
Review the changelog and release notes for the new version to understand the changes introduced in the distribution.
```

