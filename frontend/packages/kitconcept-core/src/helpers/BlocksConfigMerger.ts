import type { BlocksConfig, StyleDefinition } from '@plone/types';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import type { BlockMutator, MutatorDSL } from '../types';

// Utility type for deep recursive Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : DeepPartial<T[P]>
    : T[P];
};

/**
 * The reserved key of the mutator DSL that holds the site-wide settings.
 */
export const GLOBAL_MUTATOR_KEY = '*';

/**
 * The name of the theme that blocks without a selected theme fall back to.
 */
const DEFAULT_THEME_NAME = 'default';

/**
 * Block-specific color lists that the DSL can replace, for blocks that keep
 * their colors outside `themes`. Each one is only applied to blocks that
 * already have it in code.
 */
const PALETTE_KEYS = ['descriptionColors', 'flagColors'] as const;

export type BlocksSettings = {
  blocksConfig: BlocksConfig['blocksConfig'];
  themes: BlocksConfig['themes'];
};

export type PartialBlocksSettings = {
  blocksConfig: DeepPartial<BlocksConfig['blocksConfig']>;
  themes?: BlocksConfig['themes'];
};

const warn = (message: string) => {
  // eslint-disable-next-line no-console
  console.warn(`[kitconcept.blocks.config] ${message}`);
};

/**
 * Returns the site-wide themes of the mutator, or `undefined` when it does not
 * set valid ones. Warns about anything in the `"*"` entry that is ignored.
 */
const getGlobalThemes = (merger: MutatorDSL): StyleDefinition[] | undefined => {
  const globalMutator = merger[GLOBAL_MUTATOR_KEY];
  if (!globalMutator) return undefined;

  const ignoredKeys = Object.keys(globalMutator).filter(
    (key) => key !== 'themes',
  );
  if (ignoredKeys.length) {
    warn(
      `The "${GLOBAL_MUTATOR_KEY}" entry only supports "themes". Ignoring: ${ignoredKeys.join(', ')}.`,
    );
  }

  if (globalMutator.themes === undefined) return undefined;
  if (!Array.isArray(globalMutator.themes)) {
    warn(`"${GLOBAL_MUTATOR_KEY}.themes" must be a list. Ignoring it.`);
    return undefined;
  }
  if (
    !globalMutator.themes.some((theme) => theme?.name === DEFAULT_THEME_NAME)
  ) {
    warn(
      `"${GLOBAL_MUTATOR_KEY}.themes" has no theme named "${DEFAULT_THEME_NAME}". Blocks without a selected theme fall back to it, so they are shown without theme colors.`,
    );
  }
  return globalMutator.themes;
};

/**
 * Applies the mutator DSL to the blocks settings (`config.blocks.blocksConfig`
 * and `config.blocks.themes`) and returns new ones. The input is not modified.
 *
 * Precedence, from lowest to highest:
 * 1. The settings from code.
 * 2. The site-wide themes (`"*".themes`). They replace `config.blocks.themes`,
 *    which blocks without their own `themes` already fall back to. Blocks
 *    whose `themes` in code are a copy of the site-wide themes get them too.
 *    Blocks with their own palette in code keep it.
 * 3. The block's own entry (`disable`, `variations`, `themes`).
 */
export function mergeBlocksSettings(
  settings: PartialBlocksSettings,
  merger: MutatorDSL,
): BlocksSettings {
  const blocksConfig = cloneDeep(settings.blocksConfig);
  let themes = settings.themes;

  // 2. Site-wide themes
  const globalThemes = getGlobalThemes(merger);
  if (globalThemes) {
    Object.values(blocksConfig).forEach((blockConfig) => {
      if (
        blockConfig?.themes !== undefined &&
        settings.themes !== undefined &&
        isEqual(blockConfig.themes, settings.themes)
      ) {
        blockConfig.themes = globalThemes;
      }
    });
    themes = globalThemes;
  }

  // 3. Per-block entries
  Object.entries(merger).forEach(([blockId, entry]) => {
    if (blockId === GLOBAL_MUTATOR_KEY || !entry) return;
    const dsl = entry as BlockMutator;
    const blockConfig = blocksConfig[blockId];
    if (!blockConfig) return;

    // Disable block
    if (dsl.disable) {
      blockConfig.restricted = true;
    }

    // Filter variations
    if (Array.isArray(dsl.variations) && blockConfig.variations) {
      blockConfig.variations = blockConfig.variations.filter((v) =>
        dsl.variations!.includes(v!.id!),
      );
    }

    // Assign themes
    if (Array.isArray(dsl.themes)) {
      blockConfig.themes = dsl.themes;
    }

    // Assign block-specific palettes
    PALETTE_KEYS.forEach((key) => {
      const palette = dsl[key];
      if (palette === undefined) return;
      if (!Array.isArray(palette) || !palette.length) {
        warn(`"${blockId}.${key}" must be a non-empty list. Ignoring it.`);
        return;
      }
      if (!(key in blockConfig)) {
        warn(`The "${blockId}" block has no "${key}". Ignoring it.`);
        return;
      }
      (blockConfig as Record<string, unknown>)[key] = palette;
    });
  });

  return {
    blocksConfig: blocksConfig as BlocksConfig['blocksConfig'],
    themes: themes as BlocksConfig['themes'],
  };
}

/**
 * Applies the mutator DSL to `config.blocks.blocksConfig` only.
 *
 * Kept for backwards compatibility. It ignores the site-wide `"*"` entry,
 * because that also changes `config.blocks.themes`: use `mergeBlocksSettings`.
 */
export function BlocksConfigMerger(
  blocksConfig: DeepPartial<BlocksConfig['blocksConfig']>,
  merger: MutatorDSL,
): BlocksConfig['blocksConfig'] {
  const { [GLOBAL_MUTATOR_KEY]: _global, ...blockMutators } = merger;
  return mergeBlocksSettings({ blocksConfig }, blockMutators).blocksConfig;
}
