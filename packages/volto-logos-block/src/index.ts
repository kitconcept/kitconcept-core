import { layoutSchema } from './components/schema';
import { LogoBlockView, LogoBlockEdit } from './components';
import freedomSVG from '@plone/volto/icons/freedom.svg';
import type { ConfigType } from '@plone/registry';
import type { BlocksObjectWidgetProps } from '@kitconcept/volto-light-theme/components/Widgets/BlocksObjectWidget';
import BlocksObjectWidget from '@kitconcept/volto-light-theme/components/Widgets/BlocksObjectWidget';
import BlockWidthWidget from '@kitconcept/volto-light-theme/components/Widgets/BlockWidthWidget';
import SizeWidget from '@kitconcept/volto-light-theme/components/Widgets/SizeWidget';

declare module '@plone/types' {
  export interface BlocksConfigData {
    //logo
    logo: React.ComponentType<any>;
  }
  export interface WidgetsConfigByWidget {
    blocksObjectWidget: React.ComponentType<BlocksObjectWidgetProps>;
  }
  export interface WidgetsConfigByType {
    addLogo: BlocksObjectWidgetProps;
  }
}

const applyConfig = (config: ConfigType) => {
  config.blocks.blocksConfig.logo = {
    id: 'logo',
    title: 'Logo',
    group: 'common',
    icon: freedomSVG,
    view: LogoBlockView,
    edit: LogoBlockEdit,
    mostUsed: true,
    sidebarTab: 1,
    schema: layoutSchema,
  };

  config.widgets.widget.blocksObjectWidget = BlocksObjectWidget;
  config.widgets.widget.blockWidth = BlockWidthWidget;
  config.widgets.type.addLogo = BlocksObjectWidget;
  config.widgets.widget.sizeWidget = SizeWidget;

  return config;
};

export default applyConfig;
