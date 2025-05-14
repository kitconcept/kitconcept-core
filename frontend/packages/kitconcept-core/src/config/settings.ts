import type { ConfigType } from '@plone/registry';

export default function install(config: ConfigType) {
  // Language is Deutsch
  config.settings.defaultLanguage = 'de';
  config.settings.supportedLanguages = ['en', 'de'];

  return config;
}
