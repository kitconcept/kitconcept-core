import { BlocksConfigMerger, mergeBlocksSettings } from './BlocksConfigMerger';
import { describe, it, expect, vi } from 'vitest';

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
