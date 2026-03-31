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
      '@id': '/import-export',
      group: 'General',
      title: 'Import/Export',
    },
  ];

  config.settings.controlPanelsIcons = {
    ...config.settings.controlPanelsIcons,
    'import-export': syncSVG,
  };

  config.addonRoutes = [
    ...config.addonRoutes,
    {
      path: '/controlpanel/import-export',
      component: ExportImport,
    },
  ];

  return config;
}
