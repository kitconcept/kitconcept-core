import BannerBlockEdit from '@kitconcept/volto-banner-block/components/Edit';
import BannerBlockView from '@kitconcept/volto-banner-block/components/View';
import { BannerBlockSchema } from '@kitconcept/volto-banner-block/components/schema';
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
