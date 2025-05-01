# volto-bm3-compat (@kitconcept/volto-bm3-compat)

Add-on for the Volto block model 3 compatibility

[![npm](https://img.shields.io/npm/v/@kitconcept/volto-bm3-compat)](https://www.npmjs.com/package/@kitconcept/volto-bm3-compat)
[![](https://img.shields.io/badge/-Storybook-ff4785?logo=Storybook&logoColor=white&style=flat-square)](https://collective.github.io/volto-bm3-compat/)
[![Code analysis checks](https://github.com/collective/volto-bm3-compat/actions/workflows/code.yml/badge.svg)](https://github.com/collective/volto-bm3-compat/actions/workflows/code.yml)
[![Unit tests](https://github.com/collective/volto-bm3-compat/actions/workflows/unit.yml/badge.svg)](https://github.com/collective/volto-bm3-compat/actions/workflows/unit.yml)

## Features

This add-on provides a set of features to make the Volto block model 3 compatible with the Plone 6.0+ backend.

## Usage

Add this wrapper to the view of your block:

```tsx
import BlockWrapper from '@kitconcept/volto-bm3-compat/components/BlockWrapper/BlockWrapper';

const MyBlockView = (props) => {
  return (
    <BlockWrapper {...props}>
      <div>My block content</div>
    </BlockWrapper>
  );
};

export default MyBlockView;
```

It will add the usual `div` with the classNames `block` and the id of the block (e.g. `highlight`) for you.
You can also pass additional `className` prop to add your own classNames to the block.

If you add the `blockModel` key to your block configuration to 3, it will assume that you want to use the new block model so the block engine will take care of the rest.
It won't add the `div` wrapper and function in full block model 3 mode.

### `ExtraWrapper` prop

You can also pass an `ExtraWrapper` prop to the `BlockWrapper` component.
This prop is a function that takes the block's props and returns a React component.
There are use cases in pre-blockModel 3 scenarios where an extra container is needed.
This allows you to wrap your block in an additional component, where you define that extra container or also can be useful for adding extra functionality or styling.
If the blockModel is set to 3, then the `ExtraWrapper` prop will be ignored, same as the blockModel 2 wrapper.

```tsx
import BlockWrapper from '@kitconcept/volto-bm3-compat/components/BlockWrapper/BlockWrapper';

const MyBlockView = (props) => {
  return (
    <BlockWrapper {...props}>
      <div>My block content</div>
    </BlockWrapper>
  );
};

export default MyBlockView;
```

## Installation

To install your project, you must choose the method appropriate to your version of Volto.


### Volto 18 and later

Add `@kitconcept/volto-bm3-compat` to your `package.json`:

```json
"dependencies": {
    "@kitconcept/volto-bm3-compat": "*"
}
```

Add `@kitconcept/volto-bm3-compat` to your `volto.config.js`:

```javascript
const addons = ['@kitconcept/volto-bm3-compat'];
```

If this package provides a Volto theme, and you want to activate it, then add the following to your `volto.config.js`:

```javascript
const theme = '@kitconcept/volto-bm3-compat';
```

### Volto 17 and earlier

Create a new Volto project (you can skip this step if you already have one):

```
npm install -g yo @plone/generator-volto
yo @plone/volto my-volto-project --addon @kitconcept/volto-bm3-compat
cd my-volto-project
```

Add `@kitconcept/volto-bm3-compat` to your package.json:

```JSON
"addons": [
    "@kitconcept/volto-bm3-compat"
],

"dependencies": {
    "@kitconcept/volto-bm3-compat": "*"
}
```

Download and install the new add-on by running:

```
yarn install
```

Start volto with:

```
yarn start
```

## Test installation

Visit http://localhost:3000/ in a browser, login, and check the awesome new features.


## Development

The development of this add-on is done in isolation using a new approach using pnpm workspaces and latest `mrs-developer` and other Volto core improvements.
For this reason, it only works with pnpm and Volto 18 (currently in alpha).


### Prerequisites ✅

-   An [operating system](https://6.docs.plone.org/install/create-project-cookieplone.html#prerequisites-for-installation) that runs all the requirements mentioned.
-   [nvm](https://6.docs.plone.org/install/create-project-cookieplone.html#nvm)
-   [Node.js and pnpm](https://6.docs.plone.org/install/create-project.html#node-js) 22
-   [Make](https://6.docs.plone.org/install/create-project-cookieplone.html#make)
-   [Git](https://6.docs.plone.org/install/create-project-cookieplone.html#git)
-   [Docker](https://docs.docker.com/get-started/get-docker/) (optional)

### Installation 🔧

1.  Clone this repository, then change your working directory.

    ```shell
    git clone git@github.com:collective/volto-bm3-compat.git
    cd volto-bm3-compat
    ```

2.  Install this code base.

    ```shell
    make install
    ```


### Make convenience commands

Run `make help` to list the available commands.

```text
help                             Show this help
install                          Installs the add-on in a development environment
start                            Starts Volto, allowing reloading of the add-on during development
build                            Build a production bundle for distribution of the project with the add-on
i18n                             Sync i18n
ci-i18n                          Check if i18n is not synced
format                           Format codebase
lint                             Lint, or catch and remove problems, in code base
release                          Release the add-on on npmjs.org
release-dry-run                  Dry-run the release of the add-on on npmjs.org
test                             Run unit tests
ci-test                          Run unit tests in CI
backend-docker-start             Starts a Docker-based backend for development
storybook-start                  Start Storybook server on port 6006
storybook-build                  Build Storybook
acceptance-frontend-dev-start    Start acceptance frontend in development mode
acceptance-frontend-prod-start   Start acceptance frontend in production mode
acceptance-backend-start         Start backend acceptance server
ci-acceptance-backend-start      Start backend acceptance server in headless mode for CI
acceptance-test                  Start Cypress in interactive mode
ci-acceptance-test               Run cypress tests in headless mode for CI
```

### Development environment set up

Install package requirements.

```shell
make install
```

### Start developing

Start the backend.

```shell
make backend-docker-start
```

In a separate terminal session, start the frontend.

```shell
make start
```

### Lint code

Run ESlint, Prettier, and Stylelint in analyze mode.

```shell
make lint
```

### Format code

Run ESlint, Prettier, and Stylelint in fix mode.

```shell
make format
```

### i18n

Extract the i18n messages to locales.

```shell
make i18n
```

### Unit tests

Run unit tests.

```shell
make test
```

### Run Cypress tests

Run each of these steps in separate terminal sessions.

In the first session, start the frontend in development mode.

```shell
make acceptance-frontend-dev-start
```

In the second session, start the backend acceptance server.

```shell
make acceptance-backend-start
```

In the third session, start the Cypress interactive test runner.

```shell
make acceptance-test
```

## License

The project is licensed under the MIT license.

## Credits and Acknowledgements 🙏

Generated using [Cookieplone (0.9.7)](https://github.com/plone/cookieplone) and [cookieplone-templates (0d65af5)](https://github.com/plone/cookieplone-templates/commit/0d65af55872b6c53ea0208a672e0da73dcf2173b) on 2025-04-30 11:41:08.906300. A special thanks to all contributors and supporters!
