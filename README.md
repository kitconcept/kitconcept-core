# Volto Logos Block

[![NPM](https://img.shields.io/npm/v/@kitconcept/volto-logos-block.svg)](https://www.npmjs.com/package/@kitconcept/volto-logos-block)
[![Build Status](https://github.com/kitconcept/volto-logos-block/actions/workflows/code.yml/badge.svg)](https://github.com/kitconcept/volto-logos-block/actions)
[![Build Status](https://github.com/kitconcept/volto-logos-block/actions/workflows/unit.yml/badge.svg)](https://github.com/kitconcept/volto-logos-block/actions)
[![Build Status](https://github.com/kitconcept/volto-logos-block/actions/workflows/acceptance.yml/badge.svg)](https://github.com/kitconcept/volto-logos-block/actions)

![kitconcept GmbH](https://github.com/kitconcept/volto-blocks/raw/master/kitconcept.png)

The Volto Logos Block allows editors to add a row of up to 4 logos to a Volto page. 
## Screenshot

![Screenshot 2023-12-05 at 15-43-30 Logos examples](https://github.com/kitconcept/volto-logos-block/assets/44289551/c17e7061-f8c8-4974-ae50-32ed3fdc5aa8)

## Screencast 

Coming soon...

## Installation

Create a new Volto project (you can skip this step if you already have one):

```
npm install -g yo @plone/generator-volto
yo @plone/volto my-volto-project --addon @kitconcept/volto-logos-block
cd my-volto-project
```

Add `@kitconcept/volto-logos-block`to your package.json:

```
"addons": [
    "@kitconcept/volto-logos-block"
],

"dependencies": {
    "@kitconcept/volto-logos-block": "*"
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

## Usage
1. Go to http://localhost:3000, login, add the logos you want to use as image content objects to your site.
2. Create a new page. The logos block will show up in the Volto blocks chooser. Add it to the page
3. Select the number of items
4. Choose the Logos you uploaded earlier as content


## Credits

![phpThumb_generated_thumbnail](https://github.com/kitconcept/volto-logos-block/assets/44289551/3b2ca2ad-3b85-4a2c-9e86-55eda2689374)

The development of this plugin has been kindly sponsored by [Deutsches Zentrum für Luft- und Raumfahrt (DLR)](https://www.dlr.de/de).

## License

The project is licensed under the MIT license.
