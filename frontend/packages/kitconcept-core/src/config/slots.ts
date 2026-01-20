import type { ConfigType } from '@plone/registry';
import TTWCustomCSS from '../slots/TTWCustomCSS/TTWCustomCSS';
import ConfigInjector from '../slots/ConfigInjector/ConfigInjector';
import type { Content } from '@plone/types';
import CoreFooter from '../slots/Footer/CoreFooter';

export function hasInheritedBehavior(behavior: string) {
  return ({ content }: { content: Content }) =>
    Object.keys(content?.['@components']?.inherit || {}).includes(behavior);
}

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

  config.registerSlotComponent({
    name: 'coreFooter',
    slot: 'footer',
    component: CoreFooter,
    predicates: [hasInheritedBehavior('kitconcept.footer')],
  });

  return config;
}
