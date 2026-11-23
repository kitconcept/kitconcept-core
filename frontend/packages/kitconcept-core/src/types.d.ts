import type { StyleDefinition } from '@plone/types';

/**
 * The value types that a block can allow to be changed through the web. Each
 * one has a check in `helpers/validateMutatorValue.ts`.
 */
export type TTWConfigurableType = 'styleDefinitions';

declare module '@plone/types' {
  export interface BlockConfigBase {
    themes?: StyleDefinition[];
    /**
     * Extra keys of this block config that the blocks configuration DSL may
     * replace, and the type their value must have. For example:
     * `{ flagColors: 'styleDefinitions' }`. The type must be a
     * `TTWConfigurableType`; unknown types are refused when the configuration
     * is applied.
     *
     * Typed loosely on purpose: add-ons declare the same property without
     * depending on this package, and the declarations must be identical.
     */
    ttwConfigurable?: Record<string, string>;
  }
}

/**
 * Changes for a single block, keyed by its block id.
 *
 * Besides `disable`, `variations` and `themes`, it accepts the keys that the
 * block lists in its `ttwConfigurable` config.
 */
export type BlockMutator = {
  disable?: boolean;
  variations?: string[];
  themes?: StyleDefinition[];
  [key: string]: unknown;
};

/**
 * Site-wide changes, under the reserved `"*"` key. Only `themes` is supported:
 * it replaces `config.blocks.themes` and the themes of every block that
 * inherits them. A block's own `themes` entry still takes precedence.
 */
export type GlobalMutator = {
  themes?: StyleDefinition[];
};

export type MutatorDSL = {
  '*'?: GlobalMutator;
} & Record<string, BlockMutator | undefined>;

export type BlocksConfigSettings = {
  blocks_config_mutator: MutatorDSL;
};

export type CustomInheritBehavior<T> = {
  data: T;
  from: {
    '@id': string;
    title: string;
  };
};
