---
myst:
  html_meta:
    "description": "kitconcept package release reference"
    "property=og:description": "kitconcept package release reference"
    "property=og:title": "How to make package releases"
    "keywords": "kitconcept, release, repoplone, release-it"
---

# How to make package releases

kitconcept packages use two release workflows, depending on the repository type:

- Projects with backend and frontend in the same repository use `repoplone`.
- Frontend-only add-ons use `release-it` directly, usually through `make release`.

This page documents both cases.

## Versioning

The releases follow semantic versioning.

## Requisites

To start a release, you must fulfill the following requirements:

- Have permission to push tags and release from the repository
- Have permission to publish to the required package registry:
  - PyPI for Python packages
  - the [`@kitconcept` organization on npm](https://www.npmjs.com/org/kitconcept) for frontend packages
- Have a `GITHUB_TOKEN` with permissions to create GitHub releases
- Install the tooling required by the repository:
  - [`uv`](https://docs.astral.sh/uv/) for `repoplone`-based repositories
  - `pnpm` for frontend-only add-ons

To request these permissions, contact the maintainers of this repository.

## GitHub personal token

The release tooling creates and publishes a GitHub Release for each version.
Export `GITHUB_TOKEN` in your shell session before starting the release:

```shell
export GITHUB_TOKEN="my_looooong_github_token"
```

See the [`release-it` documentation for GitHub releases](https://www.npmjs.com/package/release-it#github-releases) and the GitHub documentation on [About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases).

## Projects using `repoplone`

Use this workflow for repositories that contain both backend and frontend packages and define them in `repository.toml`.

These repositories release the backend and frontend packages together with the same version.

### Install `uv`

`repoplone` is executed through `uvx`, which is provided by `uv`.

Install `uv` and ensure `uvx` is available on your `$PATH`:

```shell
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Release command

From the repository root, run:

```shell
uvx repoplone release
```

Follow the prompts to select the release type.
The tool handles version bumping, changelog generation, tagging, and publishing the configured backend and frontend packages.

## Frontend-only add-ons using `release-it`

Use this workflow for repositories that only publish a frontend add-on package.

In these repositories, the release process is usually wrapped by a `Makefile` target that calls `release-it` directly.

### Release command

From the repository root, run:

```shell
make release
```

Follow the prompts to select the release type.
The tool handles version bumping, changelog generation, tagging, GitHub release creation, and npm publishing according to the repository configuration.
