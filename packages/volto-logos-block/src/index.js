import { LogoBlockView, LogoBlockEdit } from './components';
import { LogoBlockSchema } from './components/Logo/schema';

import freedomSVG from '@plone/volto/icons/freedom.svg';

import './theme/main.less';

const applyConfig = (config) => {
  config.blocks.blocksConfig.logo = {
    id: 'logo',
    title: 'Logo',
    group: 'common',
    icon: freedomSVG,
    view: LogoBlockView,
    edit: LogoBlockEdit,
    blockSchema: LogoBlockSchema,
    restricted: true,
    mostUsed: true,
    sidebarTab: 1,
    showDescriptionField: false,
  };
  config.blocks.blocksConfig.logos = {
    ...config.blocks.blocksConfig.gridBlock,
    id: 'logos',
    title: 'Logos',
    group: 'common',
    mostUsed: true,
    icon: freedomSVG,
    allowedBlocks: ['logo'],
    sidebarTab: 1,
  };
  config.blocks.blocksConfig.logos.blocksConfig = {
    ...config.blocks.blocksConfig,
  };
  return config;
};

export default applyConfig;
