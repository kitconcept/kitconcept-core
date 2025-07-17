import { LogosBlockSchema } from './components/schema';
import LogoBlockView from './components/View';
import LogoBlockEdit from './components/Edit';
import freedomSVG from '@plone/volto/icons/freedom.svg';
import type { ConfigType } from '@plone/registry';
import type { BlocksObjectWidgetProps } from '@kitconcept/volto-light-theme/components/Widgets/BlocksObjectWidget';
import type { BlockConfigBase } from '@plone/types';
import type { Logo } from '@kitconcept/volto-light-theme/types';

declare module '@plone/types' {
  export interface BlocksConfigData {
    logos: BlockConfigBase;
  }

  export interface WidgetsConfigByType {
    addLogo: BlocksObjectWidgetProps;
  }

  export interface BlocksFormData {
    logos: Array<Logo>;
    logo_size: string;
    logo_width: string;
  }
}

const applyConfig = (config: ConfigType) => {
  config.blocks.blocksConfig.logos = {
    id: 'logos',
    title: 'Logos',
    group: 'common',
    icon: freedomSVG,
    view: LogoBlockView,
    edit: LogoBlockEdit,
    mostUsed: true,
    sidebarTab: 1,
    blockSchema: LogosBlockSchema,
  };

  return config;
};

export default applyConfig;
