import type { ConfigType } from '@plone/registry';
import type { CustomInheritBehavior, BlocksConfigSettings } from './types';
import installSettings from './config/settings';
import installSlots from './config/slots';
import installControlPanels from './config/controlPanels';
import installBlocks from './config/blocks';

declare module '@plone/types' {
  export interface GetSiteResponse {
    'kitconcept.intranet.custom_css': string;
  }

  export interface Expanders {
    inherit: {
      'kitconcept.blocks.config': CustomInheritBehavior<BlocksConfigSettings>;
    };
  }
}

const applyConfig = (config: ConfigType) => {
  installSettings(config);
  installSlots(config);
  installControlPanels(config);
  installBlocks(config);

  return config;
};

export default applyConfig;
