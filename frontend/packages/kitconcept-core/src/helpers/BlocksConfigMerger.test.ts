import { BlocksConfigMerger, mergeBlocksSettings } from './BlocksConfigMerger';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const baseBlocksConfig = {
  teaser: {
    restricted: false,
    variations: [
      { id: 'variation1', label: 'Variation 1' },
      { id: 'variation2', label: 'Variation 2' },
      { id: 'variation3', label: 'Variation 3' },
    ],
    themes: [],
  },
  gridBlock: {
    restricted: false,
    variations: [
      { id: 'variationA', label: 'Variation A' },
      { id: 'variationB', label: 'Variation B' },
    ],
    themes: [],
  },
};

const mutator = {
  teaser: {
    disable: true,
    variations: ['variation1', 'variation2'],
    themes: [
      {
        style: {
          '--theme-color': '#fff',
          '--theme-high-contrast-color': '#ecebeb',
          '--theme-foreground-color': '#000',
          '--theme-low-contrast-foreground-color': '#555555',
        },
        name: 'default',
        label: 'Default',
      },
    ],
  },
  gridBlock: {
    variations: ['variationB'],
  },
  description: {
    disable: true,
  },
};

describe('BlocksConfigMerger', () => {
  it('disables the block if disable is true', () => {
    const result = BlocksConfigMerger(baseBlocksConfig, mutator);
    expect(result.teaser.restricted).toBe(true);
  });

  it('filters variations according to mutator', () => {
    const result = BlocksConfigMerger(baseBlocksConfig, mutator);
    expect(result.teaser.variations.map((v) => v.id)).toEqual([
      'variation1',
      'variation2',
    ]);
    expect(result.gridBlock.variations.map((v) => v.id)).toEqual([
      'variationB',
    ]);
  });

  it('assigns themes from mutator', () => {
    const result = BlocksConfigMerger(baseBlocksConfig, mutator);
    expect(result.teaser.themes).toEqual([
      {
        style: {
          '--theme-color': '#fff',
          '--theme-high-contrast-color': '#ecebeb',
          '--theme-foreground-color': '#000',
          '--theme-low-contrast-foreground-color': '#555555',
        },
        name: 'default',
        label: 'Default',
      },
    ]);
  });

  it('does not modify blocks not present in mutator', () => {
    const result = BlocksConfigMerger(baseBlocksConfig, mutator);
    expect(result.teaser.variations.length).toBe(2);
    expect(result.gridBlock.restricted).toBe(false);
  });

  it('ignores blocks in mutator that do not exist in blocksConfig', () => {
    const result = BlocksConfigMerger(baseBlocksConfig, mutator);
    expect(result.description).toBeUndefined();
  });

  it('does not mutate the original blocksConfig', () => {
    const original = JSON.parse(JSON.stringify(baseBlocksConfig));
    BlocksConfigMerger(baseBlocksConfig, mutator);
    expect(baseBlocksConfig).toEqual(original);
  });
});

const theme = (name: string, color: string) => ({
  style: {
    '--theme-color': color,
    '--theme-high-contrast-color': '#fff',
    '--theme-foreground-color': '#000',
    '--theme-low-contrast-foreground-color': '#333333',
  },
  name,
  label: name,
});

const codeThemes = [theme('default', '#fff'), theme('grey', '#ecebeb')];
const globalThemes = [theme('default', '#fff'), theme('dlr-blue', '#00678B')];
const buttonThemes = [theme('default', '#fff')];
const sliderPalette = [theme('slider-custom-color-1', '#000')];

const baseSettings = {
  themes: codeThemes,
  blocksConfig: {
    // Copy of the site-wide themes, like VLT does for the Grid block
    gridBlock: { themes: [...codeThemes] },
    // Falls back to config.blocks.themes
    __button: {},
    // Own palette in code
    slider: { themes: sliderPalette },
  },
};

describe('mergeBlocksSettings', () => {
  it('replaces config.blocks.themes with the "*" themes', () => {
    const result = mergeBlocksSettings(baseSettings, {
      '*': { themes: globalThemes },
    });
    expect(result.themes).toEqual(globalThemes);
  });

  it('gives the "*" themes to blocks that copy the site-wide themes', () => {
    const result = mergeBlocksSettings(baseSettings, {
      '*': { themes: globalThemes },
    });
    expect(result.blocksConfig.gridBlock.themes).toEqual(globalThemes);
  });

  it('leaves blocks without themes falling back to config.blocks.themes', () => {
    const result = mergeBlocksSettings(baseSettings, {
      '*': { themes: globalThemes },
    });
    expect(result.blocksConfig.__button.themes).toBeUndefined();
  });

  it('keeps the own palette of a block from code', () => {
    const result = mergeBlocksSettings(baseSettings, {
      '*': { themes: globalThemes },
    });
    expect(result.blocksConfig.slider.themes).toEqual(sliderPalette);
  });

  it('lets the block entry take precedence over the "*" themes', () => {
    const result = mergeBlocksSettings(baseSettings, {
      '*': { themes: globalThemes },
      __button: { themes: buttonThemes },
      gridBlock: { themes: buttonThemes },
    });
    expect(result.themes).toEqual(globalThemes);
    expect(result.blocksConfig.__button.themes).toEqual(buttonThemes);
    expect(result.blocksConfig.gridBlock.themes).toEqual(buttonThemes);
  });

  it('keeps the themes from code without a "*" entry', () => {
    const result = mergeBlocksSettings(baseSettings, {
      __button: { themes: buttonThemes },
    });
    expect(result.themes).toBe(codeThemes);
    expect(result.blocksConfig.gridBlock.themes).toEqual(codeThemes);
  });

  it('warns about and ignores unsupported keys in "*"', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = mergeBlocksSettings(baseSettings, {
      '*': { themes: globalThemes, disable: true } as any,
    });
    expect(result.themes).toEqual(globalThemes);
    expect(result.blocksConfig.gridBlock.restricted).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('disable'));
    warn.mockRestore();
  });

  it('ignores "*" themes that are not a list', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = mergeBlocksSettings(baseSettings, {
      '*': { themes: 'nope' } as any,
    });
    expect(result.themes).toBe(codeThemes);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('warns when the "*" themes have no "default" theme', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mergeBlocksSettings(baseSettings, {
      '*': { themes: [theme('dlr-blue', '#00678B')] },
    });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"default"'));
    warn.mockRestore();
  });

  it('does not modify the input settings', () => {
    const original = JSON.parse(JSON.stringify(baseSettings));
    mergeBlocksSettings(baseSettings, {
      '*': { themes: globalThemes },
      __button: { themes: buttonThemes, disable: true },
    });
    expect(baseSettings).toEqual(original);
  });
});

describe('BlocksConfigMerger with a "*" entry', () => {
  it('ignores the "*" entry', () => {
    const result = BlocksConfigMerger(baseBlocksConfig, {
      '*': { themes: globalThemes },
    });
    expect(result).toEqual(baseBlocksConfig);
  });
});

describe('mergeBlocksSettings with keys allowed by the block', () => {
  const highlightColors = [theme('highlight-custom-color-1', '#ECEBEB')];
  const dlrColors = [
    {
      name: 'dlr-blue',
      label: 'DLR blue',
      style: { '--flagColor': '#00678B', '--flagColor-foreground': '#fff' },
    },
  ];
  const view = () => null;
  const settings: any = {
    themes: codeThemes,
    blocksConfig: {
      highlight: {
        descriptionColors: highlightColors,
        ttwConfigurable: { descriptionColors: 'styleDefinitions' },
      },
      slider: {
        flagColors: sliderPalette,
        view,
        ttwConfigurable: {
          flagColors: 'styleDefinitions',
          view: 'styleDefinitions',
          __proto__: 'styleDefinitions',
          ttwConfigurable: 'styleDefinitions',
        },
      },
      teaser: { icon: { content: '<svg />' } },
    },
  };
  let warn: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    warn.mockRestore();
  });

  it('replaces a key the block allows', () => {
    const result: any = mergeBlocksSettings(settings, {
      highlight: { descriptionColors: dlrColors },
      slider: { flagColors: dlrColors },
    });
    expect(result.blocksConfig.highlight.descriptionColors).toEqual(dlrColors);
    expect(result.blocksConfig.slider.flagColors).toEqual(dlrColors);
    expect(warn).not.toHaveBeenCalled();
  });

  it('does not change these keys with the "*" themes', () => {
    const result: any = mergeBlocksSettings(settings, {
      '*': { themes: globalThemes },
    });
    expect(result.blocksConfig.highlight.descriptionColors).toEqual(
      highlightColors,
    );
    expect(result.blocksConfig.slider.flagColors).toEqual(sliderPalette);
  });

  it('ignores a key the block does not allow', () => {
    const result: any = mergeBlocksSettings(settings, {
      teaser: { icon: { content: '<img src=x onerror=alert(1)>' } },
      highlight: { flagColors: dlrColors },
    });
    expect(result.blocksConfig.teaser.icon).toEqual({ content: '<svg />' });
    expect(result.blocksConfig.highlight.flagColors).toBeUndefined();
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('never replaces a function, even if the block allows it', () => {
    const result: any = mergeBlocksSettings(settings, {
      slider: { view: dlrColors },
    });
    expect(result.blocksConfig.slider.view).toBe(view);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('function'));
  });

  it('never applies forbidden keys, even if the block allows them', () => {
    const mutator = JSON.parse(
      '{"slider": {"__proto__": {"polluted": true}, "ttwConfigurable": {"icon": "styleDefinitions"}}}',
    );
    const result: any = mergeBlocksSettings(settings, mutator);
    expect(result.blocksConfig.slider.polluted).toBeUndefined();
    expect(({} as any).polluted).toBeUndefined();
    expect(result.blocksConfig.slider.ttwConfigurable).toEqual(
      settings.blocksConfig.slider.ttwConfigurable,
    );
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('ignores an invalid value', () => {
    const result: any = mergeBlocksSettings(settings, {
      highlight: { descriptionColors: [] },
    });
    expect(result.blocksConfig.highlight.descriptionColors).toEqual(
      highlightColors,
    );
    expect(warn).toHaveBeenCalled();
  });

  it('ignores invalid block themes', () => {
    const result: any = mergeBlocksSettings(baseSettings, {
      __button: {
        themes: [{ name: 'x', label: 'X', style: { color: 'red' } as any }],
      },
    });
    expect(result.blocksConfig.__button.themes).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('not a CSS custom property'),
    );
  });

  it('ignores invalid "*" themes', () => {
    const result = mergeBlocksSettings(baseSettings, {
      '*': {
        themes: [
          {
            name: 'default',
            label: 'Default',
            style: { '--theme-color': 'url(https://example.com/x.png)' },
          },
        ],
      },
    });
    expect(result.themes).toBe(codeThemes);
  });
});
