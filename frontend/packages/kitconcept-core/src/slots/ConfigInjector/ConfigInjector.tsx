import config from '@plone/volto/registry';
import { useSelector } from 'react-redux';
import { applyBlocksConfigMutator } from '../../helpers/applyBlocksConfigMutator';
import type { BlocksConfig, Content } from '@plone/types';
import type { MutatorDSL } from '../../types';

type FormState = {
  content: {
    data: Content;
  };
};

const ConfigInjector = () => {
  const blockConfigData = useSelector<FormState, MutatorDSL | undefined>(
    (state) =>
      state.content.data?.['@components']?.inherit?.['kitconcept.blocks.config']
        ?.data?.blocks_config_mutator,
  );

  // Merges onto the settings from code, and puts them back when the current
  // content has no blocks configuration.
  applyBlocksConfigMutator(config.blocks as BlocksConfig, blockConfigData);

  // This component does not render anything, it just injects config from the Redux
  // store in the global config
  return null;
};

export default ConfigInjector;
