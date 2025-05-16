import type { ConfigType } from '@plone/registry';

export { default as BlockWrapper } from './components/BlockWrapper/BlockWrapper';

export default function install(config: ConfigType) {
  return config;
}
