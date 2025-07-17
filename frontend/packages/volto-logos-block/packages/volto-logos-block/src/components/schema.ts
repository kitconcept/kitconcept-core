import { type IntlShape, defineMessages } from 'react-intl';
import type { BlockEditProps } from '@plone/types';

const messages = defineMessages({
  Small: {
    id: 'small',
    defaultMessage: 'Small',
  },
  Large: {
    id: 'large',
    defaultMessage: 'Large',
  },
  logos: {
    id: 'Logos',
    defaultMessage: 'Logos',
  },
  logosSize: {
    id: 'Logos Size',
    defaultMessage: 'Logos Size',
  },
  logosContainerWidth: {
    id: 'Logos Container Width',
    defaultMessage: 'Logos Container Width',
  },
  Target: {
    id: 'Target',
    defaultMessage: 'Target',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  AltText: {
    id: 'Alt text',
    defaultMessage: 'Alt text',
  },
  description: {
    id: 'Description',
    defaultMessage: 'Description',
  },
  logo: {
    id: 'Logo image',
    defaultMessage: 'Logo image',
  },
  item: {
    id: 'Logo',
    defaultMessage: 'Logo',
  },
  addLogo: {
    id: 'Add logo',
    defaultMessage: 'Add logo',
  },
  headline: {
    id: 'Headline',
    defaultMessage: 'Headline',
  },
  hideDescription: {
    id: 'Hide description',
    defaultMessage: 'Hide description',
  },
  settings: {
    id: 'Settings',
    defaultMessage: 'Settings',
  },
  openLinkInNewTab: {
    id: 'Open in a new tab',
    defaultMessage: 'Open in a new tab',
  },
});

const logoSchema = ({
  props,
  intl,
}: {
  props: BlockEditProps;
  intl: IntlShape;
}) => {
  return {
    title: intl.formatMessage(messages.item),
    addMessage: intl.formatMessage(messages.addLogo),
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['logo', 'alt', 'href', 'openLinkInNewTab'],
      },
    ],

    properties: {
      title: {
        title: intl.formatMessage(messages.title),
      },
      logo: {
        title: intl.formatMessage(messages.logo),
        widget: 'object_browser',
        selectedItemAttrs: ['Title', 'Description', 'image_field', '@type'],
        mode: 'image',
        allowExternals: true,
      },
      alt: {
        title: intl.formatMessage(messages.AltText),
        default: '',
      },
      href: {
        title: intl.formatMessage(messages.Target),
        widget: 'object_browser',
        mode: 'link',
        selectedItemAttrs: ['Title', 'Description', '@type'],
        allowExternals: true,
      },
      openLinkInNewTab: {
        title: intl.formatMessage(messages.openLinkInNewTab),
        type: 'boolean',
      },
    },

    required: [],
  };
};

export const LogosBlockSchema = ({
  props,
  intl,
}: {
  props: BlockEditProps;
  intl: IntlShape;
}) => {
  return {
    title: intl.formatMessage(messages.logos),
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['logos', 'logos_size', 'logos_container_width'],
      },
    ],
    properties: {
      logos: {
        title: intl.formatMessage(messages.logos),
        widget: 'object_list',
        schema: logoSchema({ props, intl }),
        default: [],
      },

      logos_size: {
        title: intl.formatMessage(messages.logosSize),
        widget: 'size',
        default: 's',
        actions: [
          {
            name: 's',
            label: intl.formatMessage(messages.Small),
          },
          {
            name: 'l',
            label: intl.formatMessage(messages.Large),
          },
        ],
      },
      logos_container_width: {
        title: intl.formatMessage(messages.logosContainerWidth),
        widget: 'blockWidth',
        default: 'default',
        actions: [
          {
            name: 'default',
            label: 'Default',
          },
          {
            name: 'layout',
            label: 'Layout',
          },
        ],
      },
    },
    required: ['logos'],
  };
};
