import type { BlocksConfig } from '@plone/types';
import { mergeBlocksSettings } from './BlocksConfigMerger';
import type { MutatorDSL } from '../types';

type BlocksSettingsTarget = Pick<BlocksConfig, 'blocksConfig' | 'themes'>;

/**
 * Creates a function that applies the blocks configuration mutator to
 * `config.blocks`.
 *
 * The first call takes a snapshot of `config.blocks.blocksConfig` and
 * `config.blocks.themes` as they are set by code. Every later call merges the
 * mutator onto that snapshot, never onto a previous result, and puts the
 * snapshot back when there is no mutator. So the settings of a site or subsite
 * do not stick when navigating to another one, and do not leak into the next
 * server-side render.
 *
 * The merge only runs again when the mutator object changes.
 */
export function createBlocksConfigMutatorApplier() {
  let snapshot: BlocksSettingsTarget | undefined;
  let applied: { mutator: MutatorDSL | undefined } | undefined;

  return function applyBlocksConfigMutator(
    blocks: BlocksSettingsTarget,
    mutator: MutatorDSL | undefined,
  ): void {
    if (!snapshot) {
      snapshot = { blocksConfig: blocks.blocksConfig, themes: blocks.themes };
    }
    if (applied && applied.mutator === mutator) return;
    applied = { mutator };

    if (mutator && Object.keys(mutator).length) {
      const merged = mergeBlocksSettings(snapshot, mutator);
      blocks.blocksConfig = merged.blocksConfig;
      blocks.themes = merged.themes;
    } else {
      blocks.blocksConfig = snapshot.blocksConfig;
      blocks.themes = snapshot.themes;
    }
  };
}

export const applyBlocksConfigMutator = createBlocksConfigMutatorApplier();
