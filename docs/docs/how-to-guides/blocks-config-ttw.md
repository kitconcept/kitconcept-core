---
myst:
  html_meta:
    "description": "Blocks configuration Through the Web (TTW)"
    "property=og:description": "Blocks configuration Through the Web (TTW)"
    "property=og:title": "Blocks configuration Through the Web (TTW)"
    "keywords": "kitconcept Intranet Distribution, blocks configuration, TTW"
---

# Blocks configuration Through the Web (TTW)

This document describes how to configure blocks TTW (through the web) in a Plone site or subsite.

This is a feature that relies on the `kitconcept.blocks.config` behavior to be enabled on the Plone site or subsite.
This behavior have a field that allows you to define some aspects of the default (hardcoded in the configuration object) blocks configuration.

These are the things that you can configure TTW:
- Enabled blocks
- Themes of a block
- Enabled variations of a block

These configurations are modeled through the definition of a mutator field in JSON format.
The mutator definition will be applied to the hardcoded blocks configuration, modifying the default values with the instructions contained in the mutator field.

## Enabling the behavior

The behavior is enabled by default on the Plone site for the kitconcept intranet distribution, but you can also enable it on a subsite.

## Accessing the configuration field

You find it in the "Plone Site" tab of the site or subsite settings, under the name "Blocks configuration".

```{image} ../_static/ttwblocksconfig.png
:alt: Blocks configuration TTW screenshot
:width: 600px
:align: center
```

A modal will open with the mutator field, where you can define the configuration in JSON format.

```{image} ../_static/ttwconfigjsonfieldmodal.png
:alt: blocks modal configuration TTW screenshot
:width: 600px
:align: center
```

The field will validate the JSON format, and will show an error if the format is not valid. Take into account that all has to be with double quotes, and no trailing commas as per JSON standard.

## The mutator field DSL

You define the configuration in a JSON format, which is stored in the `blocks_config_mutator` field of the `kitconcept.blocks.config` behavior.

The mutator field is a JSON object that contains the block id that you want to configure, and the configuration options that you want to apply to that block.

This is the shape of the mutator field:
```ts
export type BlockMutator = {
  disable?: boolean;
  variations?: string[];
  themes?: StyleDefinition[];
  descriptionColors?: StyleDefinition[];
  flagColors?: StyleDefinition[];
};

export type GlobalMutator = {
  themes?: StyleDefinition[];
};

export type MutatorDSL = {
  '*'?: GlobalMutator;
} & Record<string, BlockMutator | undefined>;
```

Where:
- `disable`: If set to `true`, the block will be disabled and not available in the blocks chooser.
- `variations`: An array of strings that defines the enabled variations for the block. If not defined, all variations are enabled.
- `themes`: An array of style definitions that defines the themes for the block. If not defined, the block will use the default themes.

Given this mutator field, the blocks configuration:

```json
{
  "teaser": {
    "disable": true,
    "variations": ["variation1", "variation2"],
    "themes": [
      {
        "style": {
          "--theme-color": "#fff",
          "--theme-high-contrast-color": "#ecebeb",
          "--theme-foreground-color": "#000",
          "--theme-low-contrast-foreground-color": "#555555"
        },
        "name": "default",
        "label": "Default"
      }
    ]
  },
  "gridBlock": {
    "variations": ["variationB"]
  },
  "description": {
    "disable": true
  }
}
```

This mutator will:
- Disable the `teaser` block, so it won't be available in the blocks chooser.
- Enable only the `variation1` and `variation2` variations for the `teaser` block.
- Define a custom theme for the `teaser` block with specific styles.
- Enable only the `variationB` variation for the `gridBlock`.
- Disable the `description` block, so it won't be available in the blocks chooser.

## Site-wide themes

The reserved `"*"` key sets the themes of all blocks at once.
It only supports `themes`, and any other key in it is ignored with a warning in the browser console.

```json
{
  "*": {
    "themes": [
      {
        "style": {
          "--theme-color": "#fff",
          "--theme-high-contrast-color": "#ecebeb",
          "--theme-foreground-color": "#000",
          "--theme-low-contrast-foreground-color": "#555555"
        },
        "name": "default",
        "label": "Default"
      },
      {
        "style": {
          "--theme-color": "#CFE7F9",
          "--theme-high-contrast-color": "#fff",
          "--theme-foreground-color": "#000",
          "--theme-low-contrast-foreground-color": "#333333"
        },
        "name": "light-blue",
        "label": "Light blue"
      }
    ]
  },
  "__button": {
    "themes": [
      {
        "style": {
          "--theme-color": "#fff",
          "--theme-high-contrast-color": "#ecebeb",
          "--theme-foreground-color": "#000",
          "--theme-low-contrast-foreground-color": "#555555"
        },
        "name": "default",
        "label": "Default"
      }
    ]
  }
}
```

The settings are applied in this order, and a later step takes precedence over an earlier one:

1. The blocks configuration from code.
2. The `"*"` themes. They replace `config.blocks.themes`, which blocks without their own themes fall back to. Blocks whose themes in code are a copy of `config.blocks.themes` get them too. Blocks with their own palette in code keep it.
3. The block's own entry. In the example above, the Button block only offers the `default` theme, and all other blocks offer both themes.

Keep these points in mind:

- Include a theme named `default`. Blocks without a selected theme fall back to it. Without it, they are shown without theme colors, and a warning is shown in the browser console.
- Content stores the name of the selected theme. If you remove or rename a theme, blocks that use it lose their colors without any error.
- Blocks inside a Grid block inherit the theme of the Grid by its name. If a block's own `themes` entry leaves out names of the site-wide themes, that block cannot inherit them.

## Block-specific color lists

Some blocks keep their colors outside `themes`, with their own CSS custom properties:

| Block | Key | CSS custom properties |
|---|---|---|
| Highlight (`highlight`) | `descriptionColors` | `--descriptionColor`, `--descriptionColor-foreground` |
| Slider (`slider`) | `flagColors` | `--flagColor`, `--flagColor-foreground` |

You can replace these lists in the block's entry.
The `"*"` themes don't change them.

```json
{
  "highlight": {
    "descriptionColors": [
      {
        "style": {
          "--descriptionColor": "#00678B",
          "--descriptionColor-foreground": "#fff"
        },
        "name": "highlight-custom-color-1",
        "label": "DLR blue"
      }
    ]
  },
  "slider": {
    "flagColors": [
      {
        "style": {
          "--flagColor": "#00678B",
          "--flagColor-foreground": "#fff"
        },
        "name": "slider-custom-color-1",
        "label": "DLR blue"
      }
    ]
  }
}
```

Keep these points in mind:

- The list must not be empty. A list for a block that doesn't have it is ignored, with a warning in the browser console.
- New blocks get the first color of the Highlight list, and the color named `slider-custom-color-1` of the Slider list. Keep a color with that name in the Slider list.
- Content stores the name of the selected color. If you remove or rename a color, blocks that use it lose their colors without any error. To change the colors of existing blocks, keep their names and change the values.
- These lists need versions of `@kitconcept/volto-highlight-block` and `@kitconcept/volto-slider-block` that read the colors from the blocks configuration when rendering the page.

## How the configuration is applied

The configuration is merged onto the blocks configuration from code every time it changes, never onto a previous result.
When you navigate to content without a blocks configuration, the configuration from code is restored.
So the settings of a site or subsite do not stay active after you leave it.
