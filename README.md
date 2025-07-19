# kitconcept.core 🚀

[![Built with Cookieplone](https://img.shields.io/badge/built%20with-Cookieplone-0083be.svg?logo=cookiecutter)](https://github.com/plone/cookieplone-templates/)
[![CI](https://github.com/kitconcept/kitconcept-core/actions/workflows/main.yml/badge.svg)](https://github.com/kitconcept/kitconcept-core/actions/workflows/main.yml)

Core setup for kitconcept GmbH distributions built on top of Plone

It is composed of the following packages:

- Volto Light Theme ([@kitconcept/volto-light-theme](https://github.com/kitconcept/kitconcept-core/tree/main/frontend/packages/volto-light-theme))
- Button Block ([@kitconcept/volto-button-block](https://github.com/kitconcept/kitconcept-core/tree/main/frontend/packages/volto-button-block))
- Highlight Block ([@kitconcept/volto-highlight-block](https://github.com/kitconcept/kitconcept-core/tree/main/frontend/packages/volto-highlight-block))
- Introduction Block ([@kitconcept/volto-introduction-block](https://github.com/kitconcept/kitconcept-core/tree/main/frontend/packages/volto-introduction-block))
- Logos Block ([@kitconcept/volto-logos-block](https://github.com/kitconcept/kitconcept-core/tree/main/frontend/packages/volto-logos-block))
- Separator Block ([@kitconcept/volto-separator-block](https://github.com/kitconcept/kitconcept-core/tree/main/frontend/packages/volto-separator-block))
- Heading Block ([@kitconcept/volto-heading-block](https://github.com/kitconcept/kitconcept-core/tree/main/frontend/packages/volto-heading-block))
- Banner Block ([@kitconcept/volto-banner-block](https://github.com/kitconcept/kitconcept-core/tree/main/frontend/packages/volto-banner-block))
- Slider Block ([@kitconcept/volto-slider-block](https://github.com/kitconcept/kitconcept-core/tree/main/frontend/packages/volto-slider-block))
- Carousel Block ([@kitconcept/volto-carousel-block](https://github.com/kitconcept/kitconcept-core/tree/main/frontend/packages/volto-carousel-block))
- Accordion Block ([@eeacms/volto-accordion-block](https://www.npmjs.com/package/@eeacms/volto-accordion-block))
- DSGVO Banner ([@kitconcept/volto-dsgvo-banner](https://github.com/kitconcept/kitconcept-core/tree/main/frontend/packages/volto-dsgvo-banner))
- Volto BM3 Compatibility Layer ([@kitconcept/volto-bm3-compat](https://github.com/kitconcept/kitconcept-core/tree/main/frontend/packages/volto-bm3-compat))

You will find them in the `frontend/packages` directory.
They are all built on the top of VLT (Volto Light Theme) but they can be used independently if you load the corresponding CSS in the way that VLT does.
They are all released independently on npm.
`@kitconcept/core` is a package that is the aggregator and the glue for all these packages.
It is released on npm as well, and you can use it in your projects to install all the packages at once.

## Quick Start 🏁

### Prerequisites ✅

-   An [operating system](https://6.docs.plone.org/install/create-project-cookieplone.html#prerequisites-for-installation) that runs all the requirements mentioned.
-   [uv](https://6.docs.plone.org/install/create-project-cookieplone.html#uv)
-   [nvm](https://6.docs.plone.org/install/create-project-cookieplone.html#nvm)
-   [Node.js and pnpm](https://6.docs.plone.org/install/create-project.html#node-js) 22
-   [Make](https://6.docs.plone.org/install/create-project-cookieplone.html#make)
-   [Git](https://6.docs.plone.org/install/create-project-cookieplone.html#git)
-   [Docker](https://docs.docker.com/get-started/get-docker/) (optional)


### Installation 🔧

1.  Clone this repository, then change your working directory.

    ```shell
    git clone git@github.com:kitconcept/kitconcept-core.git
    cd kitconcept-core
    ```

2.  Install this code base.

    ```shell
    make install
    ```


### Fire Up the Servers 🔥

1.  Create a new Plone site on your first run.

    ```shell
    make backend-create-site
    ```

2.  Start the backend at http://localhost:8080/.

    ```shell
    make backend-start
    ```

3.  In a new shell session, start the frontend at http://localhost:3000/.

    ```shell
    make frontend-start
    ```

Voila! Your Plone site should be live and kicking! 🎉

### Local Stack Deployment 📦

Deploy a local `Docker Compose` environment that includes:

- Docker images for Backend and Frontend 🖼️
- A stack with a Traefik router and a Postgres database 🗃️
- Accessible at [http://kitconcept-core.localhost](http://kitconcept-core.localhost) 🌐

Execute the following:

```shell
make stack-start
make stack-create-site
```

And... you're all set! Your Plone site is up and running locally! 🚀

## Project Structure 🏗️

This monorepo consists of the following distinct sections:

- **backend**: Houses the API and Plone installation, utilizing pip instead of buildout, and includes a policy package named kitconcept.core.
- **frontend**: Contains the React (Volto) package.
- **devops**: Encompasses Docker Stack, Ansible playbooks, and Cache settings.
- **docs**: Scaffold for writing documentation for your project.

### Why This Structure? 🤔

- All necessary codebases to run the site are contained within the repo (excluding existing addons for Plone and React).
- Specific GitHub Workflows are triggered based on changes in each codebase (refer to .github/workflows).
- Simplifies the creation of Docker images for each codebase.
- Demonstrates Plone installation/setup without buildout.

## Code Quality Assurance 🧐

To automatically format your code and ensure it adheres to quality standards, execute:

```shell
make check
```

### Format the codebase

To format the codebase, it is possible to run `format`:

```shell
make format
```

| Section | Tool | Description | Configuration |
| --- | --- | --- | --- |
| backend | Ruff | Python code formatting, imports sorting  | [`backend/pyproject.toml`](./backend/pyproject.toml) |
| backend | `zpretty` | XML and ZCML formatting  | -- |
| frontend | ESLint | Fixes most common frontend issues | [`frontend/.eslintrc.js`](.frontend/.eslintrc.js) |
| frontend | prettier | Format JS and Typescript code  | [`frontend/.prettierrc`](.frontend/.prettierrc) |
| frontend | Stylelint | Format Styles (css, less, sass)  | [`frontend/.stylelintrc`](.frontend/.stylelintrc) |

Formatters can also be run within the `backend` or `frontend` folders.

### Linting the codebase
or `lint`:

 ```shell
make lint
```

| Section | Tool | Description | Configuration |
| --- | --- | --- | --- |
| backend | Ruff | Checks code formatting, imports sorting  | [`backend/pyproject.toml`](./backend/pyproject.toml) |
| backend | Pyroma | Checks Python package metadata  | -- |
| backend | check-python-versions | Checks Python version information  | -- |
| backend | `zpretty` | Checks XML and ZCML formatting  | -- |
| frontend | ESLint | Checks JS / Typescript lint | [`frontend/.eslintrc.js`](.frontend/.eslintrc.js) |
| frontend | prettier | Check JS / Typescript formatting  | [`frontend/.prettierrc`](.frontend/.prettierrc) |
| frontend | Stylelint | Check Styles (css, less, sass) formatting  | [`frontend/.stylelintrc`](.frontend/.stylelintrc) |

Linters can be run individually within the `backend` or `frontend` folders.

## Internationalization 🌐

Generate translation files for Plone and Volto with ease:

```shell
make i18n
```

## Credits and Acknowledgements 🙏

Generated using [Cookieplone (0.9.7)](https://github.com/plone/cookieplone) and [cookieplone-templates (0beeb9f)](https://github.com/plone/cookieplone-templates/commit/0beeb9f07d04cdd732c487422c94ed975b73507d) on 2025-04-28 11:48:40.459239. A special thanks to all contributors and supporters!
