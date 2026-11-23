import type { StyleDefinition } from '@plone/types';

declare module '@plone/types' {
  export interface BlockConfigBase {
    themes?: StyleDefinition[];
  }
}

/**
 * Changes for a single block, keyed by its block id.
 */
export type BlockMutator = {
  disable?: boolean;
  variations?: string[];
  themes?: StyleDefinition[];
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
