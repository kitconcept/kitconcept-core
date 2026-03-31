import type { ConfigType } from '@plone/registry';
import type { apiExpandersType } from '@plone/types';

export default function install(config: ConfigType) {
  // Language is Deutsch
  config.settings.defaultLanguage = 'de';
  config.settings.supportedLanguages = ['en', 'de'];

  const EXPANDERS_INHERIT_BEHAVIORS = 'kitconcept.blocks.config';

  // Add API expander for inheriting blocks config
  config.settings.apiExpanders = [
    ...config.settings.apiExpanders,
    {
      match: '',
      GET_CONTENT: ['inherit'],
      querystring: (config, querystring) => {
        if (querystring['expand.inherit.behaviors']) {
          return {
            'expand.inherit.behaviors': querystring[
              'expand.inherit.behaviors'
            ].concat(',', EXPANDERS_INHERIT_BEHAVIORS),
          };
        } else {
          return {
            'expand.inherit.behaviors': EXPANDERS_INHERIT_BEHAVIORS,
          };
        }
      },
    } as apiExpandersType,
  ];

  return config;
}
