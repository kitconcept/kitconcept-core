import type { ConfigType } from '@plone/registry';
import ExportImport from '../components/Controlpanels/ExportImport';
import syncSVG from '@plone/volto/icons/sync.svg';

import { defineMessages } from 'react-intl';

defineMessages({
  'Content Transfer': {
    id: 'Content Transfer',
    defaultMessage: 'Content Transfer',
  },
});

export default function install(config: ConfigType) {
  config.settings.controlpanels = [
    ...config.settings.controlpanels,
    {
      '@id': '/content-transfer',
      group: 'General',
      title: 'Content Transfer',
    },
  ];

  config.settings.controlPanelsIcons = {
    ...config.settings.controlPanelsIcons,
    'content-transfer': syncSVG,
  };

  config.addonRoutes = [
    ...config.addonRoutes,
    {
      path: '/controlpanel/content-transfer',
      component: ExportImport,
    },
  ];

  return config;
}
