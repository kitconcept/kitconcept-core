import type { ConfigType } from '@plone/registry';
import TTWCustomCSS from '../slots/TTWCustomCSS/TTWCustomCSS';
import ConfigInjector from '../slots/ConfigInjector/ConfigInjector';

export default function install(config: ConfigType) {
  config.registerSlotComponent({
    slot: 'aboveHeader',
    name: 'ConfigInjector',
    component: ConfigInjector,
  });

  config.registerSlotComponent({
    slot: 'aboveHeader',
    name: 'TTWCustomCSS',
    component: TTWCustomCSS,
  });

  return config;
}
