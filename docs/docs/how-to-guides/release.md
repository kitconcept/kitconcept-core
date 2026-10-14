---
myst:
  html_meta:
    "description": "How to release kitconcept add-ons, distributions, and projects with repoplone or release-it"
    "property=og:description": "How to release kitconcept add-ons, distributions, and projects with repoplone or release-it"
    "property=og:title": "How to make package releases"
    "keywords": "kitconcept, release, repoplone, release-it, towncrier, PyPI, npm"
---

# How to make package releases

kitconcept packages use two release workflows, depending on the repository type:

- Repositories with a `repository.toml` file use [`repoplone`](https://pypi.org/project/repoplone/).
  This covers projects, distributions such as `kitconcept.core` and `kitconcept.intranet`, and add-ons that ship a backend package, a frontend package, or both from the same repository.
- Frontend-only add-ons without a `repository.toml` use `release-it` directly, usually through `make release`.

This page documents both cases.

## Versioning

Releases follow semantic versioning.
Pre-releases use the Python notation in `version.txt` and Git tags, for example `2.0.0a1`, `2.0.0b8`, or `2.0.0rc1`.
For npm, `repoplone` converts these to their semver equivalent, for example `2.0.0-beta.8`.

The backend and frontend packages in a `repoplone` repository are always released together, with the same version.

## Requisites

To start a release, you must fulfill the following requirements:

- Have permission to push commits and tags to the `main` branch of the repository
- Have access to the required package registries, see {ref}`release-grant-access`:
  - the kitconcept PyPI token in 1Password for Python packages
  - the [`@kitconcept` organization on npm](https://www.npmjs.com/org/kitconcept) for frontend packages
- Have your credentials configured locally, see {ref}`release-local-credentials`
- Install the tooling required by the repository:
  - [`uv`](https://docs.astral.sh/uv/) 0.8.15 or later for `repoplone`-based repositories
  - `pnpm` and Node.js for frontend packages

(release-grant-access)=

## Grant access to the package registries

These steps are done once per person, by someone who already has access.

### PyPI

kitconcept packages are published to PyPI with the shared kitconcept PyPI API token, stored in kitconcept's 1Password.
You don't need a personal PyPI account or per-project permissions to release.

To get access, ask a kitconcept 1Password administrator to share the item with the kitconcept PyPI token with you.

When the first release of a new package is uploaded with this token, PyPI creates the project under the kitconcept account, so no further setup is needed.

### npm

npm grants publish permissions through the `@kitconcept` organization:

1. The new releaser creates an account on [npmjs.com](https://www.npmjs.com/signup) and enables two-factor authentication.
2. An owner or admin of the [`@kitconcept` organization](https://www.npmjs.com/org/kitconcept) invites the releaser from {menuselection}`Members --> Invite Members`.
3. The releaser accepts the invitation from the email sent by npm.
4. The organization owner makes sure the releaser's team has **read and write** access to the packages they release, from {menuselection}`Teams --> <team> --> Packages`.

### GitHub

The releaser needs **write** access to the repository, to push to `main` and create tags and releases.
A repository admin grants it from {menuselection}`Settings --> Collaborators and teams`, preferably by adding the person to the corresponding kitconcept team.

If `main` is protected, the releaser must also be allowed to push directly to it, or bypass the branch protection rules.

(release-local-credentials)=

## Configure your credentials locally

### PyPI token

`repoplone` publishes the backend package with `uv publish`, which needs a PyPI API token.
Use the kitconcept PyPI token from 1Password.
Don't create a personal token for releases.

Store the token with `uv`, so it's available to every release:

```shell
uv auth login pypi.org --token "pypi-the_kitconcept_token_from_1password"
```

Check that it's stored:

```shell
uv auth token pypi.org
```

This is the same check `repoplone` does before starting a release.

Alternatively, export the token only for the current shell session:

```shell
export UV_PUBLISH_TOKEN="pypi-the_kitconcept_token_from_1password"
```

If you use the [1Password CLI](https://developer.1password.com/docs/cli/), you can read the token directly from 1Password instead of pasting it.
Replace the placeholder with the secret reference of the item, which you can copy from 1Password with {menuselection}`Copy Secret Reference`:

```shell
export UV_PUBLISH_TOKEN="$(op read 'op://<vault>/<item>/<field>')"
```

`UV_PUBLISH_TOKEN` takes precedence over the credentials stored with `uv auth login`.

### npm login

Log in to npm before releasing a frontend package:

```shell
npm login
```

This opens the browser to authenticate, and stores a session token in your `~/.npmrc` file.
Check that you are logged in:

```shell
npm whoami
```

`repoplone` runs the same check before starting a release.

With two-factor authentication enabled, npm asks for a one-time password when publishing.
Keep your authenticator app at hand during the release.

### GitHub token

The release tooling creates a GitHub Release for each version, and needs a GitHub personal access token for it.

1. In GitHub, go to {menuselection}`Settings --> Developer settings --> Personal access tokens --> Fine-grained tokens --> Generate new token`.
2. Set the resource owner to `kitconcept`, and select the repositories you release, or all repositories.
3. Under {menuselection}`Repository permissions`, set **Contents** to **Read and write**.
4. Generate the token and copy it.

If the `kitconcept` organization requires approval for fine-grained tokens, the token works only after an organization owner approves it.

Export `GITHUB_TOKEN` in your shell session before starting the release:

```shell
export GITHUB_TOKEN="github_pat_my_looooong_github_token"
```

To avoid exporting it each time, you can add the line to your shell profile, such as `~/.zshrc`, or load it from your password manager.
Don't commit it to any repository.

See the [`release-it` documentation for GitHub releases](https://www.npmjs.com/package/release-it#github-releases) and the GitHub documentation on [About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases).

## Projects and add-ons using `repoplone`

Use this workflow for any repository that has a `repository.toml` file at its root.

### What gets released

`repository.toml` declares what `repoplone` releases.
The relevant keys are:

```toml
[repository]
name = "kitconcept-core"
changelog = "CHANGELOG.md"       # project changelog at the repository root
version = "version.txt"          # single source of truth for the version
compose = "docker-compose.yml"   # version references are updated on release

[repository.towncrier]
section = "Project"
settings = "towncrier.toml"      # repository-level news fragments in news/

[backend.package]
name = "kitconcept.core"
path = "backend"
changelog = "backend/CHANGELOG.md"
towncrier_settings = "backend/pyproject.toml"
publish = true                   # publish to PyPI

[frontend.package]
name = "@kitconcept/core"
path = "frontend/packages/kitconcept-core"
changelog = "frontend/packages/kitconcept-core/CHANGELOG.md"
towncrier_settings = "frontend/packages/kitconcept-core/towncrier.toml"
publish = true                   # publish to npm
```

The `publish` setting decides whether a package gets uploaded:

`publish = true`
: The package version and changelog are updated, and the package is built and published to PyPI or npm.
  Use this for add-ons and distributions.

`publish = false`
: The package version and changelog are updated, but nothing is uploaded.
  Use this for client projects, where the deliverable is the Git tag and the container images built from it.

A repository with only a backend or only a frontend package omits the other section, and `repoplone` skips its release step.

### Check the repository before releasing

1. Make sure you are on an up-to-date `main` branch, and that CI is passing for it:

   ```shell
   git switch main
   git pull
   ```

2. Make sure there are news fragments describing the changes since the last release.
   They live in `news/`, `backend/news/`, and the frontend package's `news/` folder.
   See {doc}`plone:contributing/index` for the fragment naming conventions.

3. Review the current and next versions:

   ```shell
   uvx repoplone versions current
   uvx repoplone versions next
   ```

4. Preview the changelog that the release will produce:

   ```shell
   uvx repoplone changelog
   ```

### Dry run

Do a dry run first, especially for major releases or when the release setup of the repository has changed:

```shell
uvx repoplone release --dry-run
```

A dry run builds the packages and runs `release-it` in dry-run mode, but doesn't modify any files, create tags, push, publish, or create a GitHub release.

### Release command

From the repository root, run:

```shell
uvx repoplone release
```

You can also pass the next version, either as a version number or as a segment, to skip the version prompt:

```shell
uvx repoplone release minor
uvx repoplone release 2.1.0
uvx repoplone release a
```

Without an argument, `repoplone` asks you to select the next version.
The options depend on the current version:

| Current version | Offered bumps |
|---|---|
| Final, for example `2.1.0` | micro (`2.1.1`), minor (`2.2.0`), major (`3.0.0`), minor alpha (`2.2.0a0`), major alpha (`3.0.0a0`) |
| Alpha, for example `3.0.0a1` | next alpha, first beta, final release |
| Beta, for example `3.0.0b8` | next beta, first release candidate, final release |
| Release candidate, for example `3.0.0rc1` | next release candidate, final release |

(what-the-release-does)=

### What the release does

Before starting, `repoplone` checks that you are authenticated to PyPI and npm for each package with `publish = true`, and stops if you are not.
It warns if `GITHUB_TOKEN` is missing, in which case the GitHub release step is skipped.

The release then runs these steps in order:

`changelog`
: Displays the draft changelog assembled from all news fragments, and asks for confirmation.

`version`
: Selects and confirms the next version.
  A version that already exists as a Git tag is rejected.

`repository`
: Updates the root `CHANGELOG.md`, `version.txt`, and the version references in `docker-compose.yml`.

`release_backend`
: Compiles translations, sets the backend package version, builds its changelog from `backend/news/`, builds the package with `uv build`, and publishes it with `uv publish`.

`release_frontend`
: Runs `release-it` in the frontend package to set the version, build the changelog from its news fragments, and publish it to npm.

`git`
: Commits all changes as `Release <version>`, creates the `<version>` tag, and pushes both to `origin`.

`gh_release`
: Creates a GitHub release on `main` for the new tag, using the changelog as the release notes.

`bye`
: Prints a summary.

### After the release

- Check that the new versions are listed on PyPI and npm.
- Check the GitHub release page.
  `repoplone` always creates a regular release, so mark a pre-release as such manually if needed.
- Pushing the tag triggers the `Tag` workflow in GitHub Actions, which builds and publishes the container images for the new version.
  Check that it completes.

### Resume a failed release

If a release fails part way, for example because a registry upload failed, fix the cause and resume from the failed step, instead of starting again.
Pass the version that was being released, because the `version` step is skipped:

```shell
uvx repoplone release 2.1.0 --start-step release_frontend
```

The step ids are the ones listed in {ref}`what-the-release-does`.
Steps before the given one are skipped.

```{warning}
Don't resume from a step before `release_backend` or `release_frontend` if that package was already published.
A version can't be uploaded to PyPI or npm twice.
```

## Frontend-only add-ons using `release-it`

Use this workflow for repositories that only publish a frontend add-on package, and don't have a `repository.toml` file.

In these repositories, the release process is usually wrapped by a `Makefile` target that calls `release-it` directly.

### Release command

From the repository root, run:

```shell
make release
```

Follow the prompts to select the release type.
The tool handles version bumping, changelog generation, tagging, GitHub release creation, and npm publishing according to the repository configuration in `.release-it.json`.

## Stamping the Volto version for distributions

When the package being released is a Volto **distribution**, its published `package.json` must advertise the Volto core version it targets in a `volto_version` field. That field is what lets downstream projects detect the distribution and enforce its dependencies (see {doc}`/how-to-guides/ensure-versions-distribution-projects`).

RepoPlone stamps this field from the `@plone/volto` tag in `mrs.developer.json`:

```shell
uvx repoplone deps stamp-volto-version
```

This is typically wired into the distribution package's `.release-it.json` so it runs automatically during a release. For example:

```json
{
  "hooks": {
    "after:bump": [
      "uvx repoplone deps stamp-volto-version",
      "git add package.json"
    ]
  }
}
```

The command locates `repository.toml` by walking up the directory tree, so it works from the package directory where `release-it` runs.
