import { defineMessages } from 'react-intl';

const messages = defineMessages({
  logo: {
    id: 'Logo',
    defaultMessage: 'Logo',
  },
  title: {
    id: 'title',
    defaultMessage: 'title',
  },
  description: {
    id: 'description',
    defaultMessage: 'description',
  },
  logoBlock: {
    id: 'Logo',
    defaultMessage: 'Logo',
  },
  svgbest: {
    id: 'It is advised to use a svg graphic.',
    defaultMessage: 'It is advised to use a svg graphic.',
  },
});

export const LogoBlockSchema = (props) => {
  return {
    title: props.intl.formatMessage(messages.logoBlock),
    block: 'logo',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['logo', 'heading'],
      },
    ],
    properties: {
      logo: {
        title: props.intl.formatMessage(messages.logo),
        widget: 'object_browser',
        mode: 'image',
        allowExternals: true,
        description: props.intl.formatMessage(messages.svgbest),
      },
      heading: {
        title: props.intl.formatMessage(messages.title),
      },
      description: {
        title: props.intl.formatMessage(messages.description),
        widget: 'text',
      },
    },
    required: ['logo'],
  };
};
