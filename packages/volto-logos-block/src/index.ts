import { Edit } from './components';
import { layoutSchema } from './components/Logo/layoutSchema';
import { LogoBlockView } from './components';
import freedomSVG from '@plone/volto/icons/freedom.svg';
import './theme/logo.scss';
import type { ConfigType } from '@plone/registry';
import { BlocksObjectWidget } from './components/widgets';
import type { BlocksObjectWidgetProps } from './components/widgets/BlocksObjectWidget';
import cloneDeep from 'lodash/cloneDeep';

declare module '@plone/types' {
  export interface BlocksConfigData {
    //logo
    logo: {};
  }
  export interface WidgetsConfigByWidget {
    blocksObject_widget: React.FC<BlocksObjectWidgetProps>;
  }
  export interface WidgetsConfigByType {
    logos: React.FC<BlocksObjectWidgetProps>;
  }
}

const applyConfig = (config: ConfigType) => {
  config.blocks.blocksConfig.logo = {
    id: 'logo',
    title: 'Logo',
    group: 'common',
    icon: freedomSVG,
    view: LogoBlockView,
    edit: Edit,
    mostUsed: true,
    sidebarTab: 1,
    schema: layoutSchema,
    blockHasOwnFocusManagement: true,
    blocksConfig: cloneDeep(config.blocks.blocksConfig),
  };

  config.widgets.widget.blocksObject_widget = BlocksObjectWidget;
  config.widgets.type.logos = BlocksObjectWidget;

  return config;
};

export default applyConfig;
