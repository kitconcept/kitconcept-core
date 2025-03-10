# Volto Banner Block

[![NPM](https://img.shields.io/npm/v/@kitconcept/volto-banner-block.svg)](https://www.npmjs.com/package/@kitconcept/volto-banner-block)
[![Build Status](https://github.com/kitconcept/volto-banner-block/actions/workflows/code.yml/badge.svg)](https://github.com/kitconcept/volto-banner-block/actions)
[![Build Status](https://github.com/kitconcept/volto-banner-block/actions/workflows/unit.yml/badge.svg)](https://github.com/kitconcept/volto-banner-block/actions)
[![Build Status](https://github.com/kitconcept/volto-banner-block/actions/workflows/acceptance.yml/badge.svg)](https://github.com/kitconcept/volto-banner-block/actions)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://kitconcept.com/kitconcept-white.svg">
  <img width="300" alt="kitconcept, GmbH" src="https://kitconcept.com/kitconcept-black.svg">
</picture>

The Volto Banner Block allows editors to add a banner with text to a Volto page.

**This add-on is [volto-light-theme](https://github.com/kitconcept/volto-light-theme) compatible.**

## Installation

Create a new Volto project (you can skip this step if you already have one):

```
npm install -g yo @plone/generator-volto
yo @plone/volto my-volto-project --addon @kitconcept/volto-banner-block
cd my-volto-project
```

Add `@kitconcept/volto-banner-block`to your package.json:

```
"addons": [
    "@kitconcept/volto-banner-block"
],

"dependencies": {
    "@kitconcept/volto-banner-block": "*"
}
```

Download and install the new add-on by running:

```
yarn install
```

Start Volto with:

```
yarn start
```

Go to http://localhost:3000, login, create a new page. The banner block will show up in the Volto blocks chooser.

## Block configuration

This block does not have any configuration options.

## Credits

<img alt="Deutsches Zentrum für Luft- und Raumfahrt (DLR)" width="200px" src="https://www.dlr.de/static/media/Logo-de.697a8e1f.svg" style="background-color:white">

The development of this plugin has been kindly sponsored by [German Aerospace Center (DLR)](https://dlr.de/de).

# License

The project is licensed under the MIT license.
