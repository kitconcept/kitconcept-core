import { describe, it, expect, beforeEach } from 'vitest';
import { createBlocksConfigMutatorApplier } from './applyBlocksConfigMutator';

const theme = (name: string) => ({ style: {}, name, label: name });
const codeThemes = [theme('default'), theme('grey')];
const globalThemes = [theme('default'), theme('dlr-blue')];

const makeBlocks = (): any => ({
  themes: codeThemes,
  blocksConfig: {
    teaser: { restricted: false, themes: [...codeThemes] },
  },
});

describe('applyBlocksConfigMutator', () => {
  let apply: ReturnType<typeof createBlocksConfigMutatorApplier>;
  let blocks: any;
  let codeBlocksConfig: any;

  beforeEach(() => {
    apply = createBlocksConfigMutatorApplier();
    blocks = makeBlocks();
    codeBlocksConfig = blocks.blocksConfig;
  });

  it('applies the mutator', () => {
    apply(blocks, { '*': { themes: globalThemes }, teaser: { disable: true } });
    expect(blocks.themes).toEqual(globalThemes);
    expect(blocks.blocksConfig.teaser.restricted).toBe(true);
    expect(blocks.blocksConfig.teaser.themes).toEqual(globalThemes);
  });

  it('puts the settings from code back when there is no mutator', () => {
    apply(blocks, { '*': { themes: globalThemes }, teaser: { disable: true } });
    apply(blocks, undefined);
    expect(blocks.themes).toBe(codeThemes);
    expect(blocks.blocksConfig).toBe(codeBlocksConfig);
    expect(blocks.blocksConfig.teaser.restricted).toBe(false);
  });

  it('puts the settings from code back for an empty mutator', () => {
    apply(blocks, { teaser: { disable: true } });
    apply(blocks, {});
    expect(blocks.blocksConfig).toBe(codeBlocksConfig);
  });

  it('merges onto the settings from code, not onto the previous result', () => {
    apply(blocks, { teaser: { disable: true } });
    apply(blocks, { '*': { themes: globalThemes } });
    expect(blocks.blocksConfig.teaser.restricted).toBe(false);
    expect(blocks.themes).toEqual(globalThemes);
  });

  it('does not merge again for the same mutator object', () => {
    const mutator = { teaser: { disable: true } };
    apply(blocks, mutator);
    const merged = blocks.blocksConfig;
    apply(blocks, mutator);
    expect(blocks.blocksConfig).toBe(merged);
  });

  it('does not modify the settings from code', () => {
    apply(blocks, { '*': { themes: globalThemes }, teaser: { disable: true } });
    expect(codeBlocksConfig.teaser.restricted).toBe(false);
    expect(codeBlocksConfig.teaser.themes).toEqual(codeThemes);
  });
});
