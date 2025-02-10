import { cloneDeepSchema } from '@plone/volto/helpers/Utils/Utils';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Default: {
    defaultMessage: 'Default',
    id: 'default',
  },
  Small: {
    id: 'small',
    defaultMessage: 'Small',
  },
  Large: {
    id: 'large',
    defaultMessage: 'Large',
  },
  Description: {
    id: 'description',
    defaultMessage: 'Description',
  },
  openLinkInNewTab: {
    id: 'Open in a new tab',
    defaultMessage: 'Open in a new tab',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  item: {
    id: 'Item',
    defaultMessage: 'Item',
  },
  addLogo: {
    id: 'Add logo',
    defaultMessage: 'Add logo',
  },
  logo: {
    id: 'Logo image',
    defaultMessage: 'Logo image',
  },
  AltText: {
    id: 'Alt text',
    defaultMessage: 'Alt text',
  },
  Target: {
    id: 'Target',
    defaultMessage: 'Target',
  },
  logo_size: {
    id: 'logo_size',
    defaultMessage: 'Logo size',
  },
});

const logoSchema = (props) => {
  const intl = props.intl;
  return {
    title: intl.formatMessage(messages.item),
    addMessage: intl.formatMessage(messages.addLogo),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.Default),
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
        selectedItemAttrs: ['Title', 'Description'],
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

const toggleIconField = (schema) => {
  const cloned = cloneDeepSchema(schema);
  cloned.fieldsets[0].fields = [...cloned.fieldsets[0].fields];

  return cloned;
};

export const layoutSchema = (props) => {
  const intl = props.intl;
  return {
    title: intl.formatMessage(messages.logo),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.Default),
        fields: ['logo_size', 'data'],
      },
    ],
    properties: {
      data: {
        title: intl.formatMessage(messages.logo),
        type: 'logos',
        schema: logoSchema(props),
        schemaExtender: toggleIconField,
      },

      logo_size: {
        title: intl.formatMessage(messages.logo_size),
        choices: [
          ['s', intl.formatMessage(messages.Small)],
          ['l', intl.formatMessage(messages.Large)],
        ],
        default: 's',
      },
    },
    required: ['data'],
  };
};
