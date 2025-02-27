import BannerBlockEdit from './components/Edit';
import BannerBlockView from './components/View';
import BannerBlockSchema from './components/schema';
import './theme/main.scss';

import showcaseSVG from '@plone/volto/icons/showcase.svg';

const applyConfig = (config) => {
  config.blocks.blocksConfig.banner = {
    id: 'banner',
    title: 'Banner',
    group: 'common',
    icon: showcaseSVG,
    view: BannerBlockView,
    edit: BannerBlockEdit,
    blockSchema: BannerBlockSchema,
    sidebarTab: 1,
  };

  return config;
};

export default applyConfig;
