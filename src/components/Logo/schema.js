import { defineMessages } from 'react-intl';

const messages = defineMessages({
  logo: {
    id: 'Logo',
    defaultMessage: 'Logo',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
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
  link: {
    id: 'Link',
    defaultMessage: 'Link',
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
        fields: ['logo', 'heading', 'link'],
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
      //description currently unused
      description: {
        title: props.intl.formatMessage(messages.description),
        widget: 'text',
      },
      link: {
        title: props.intl.formatMessage(messages.link),
        widget: 'object_browser',
        mode: 'link',
        allowExternals: true,
      },
    },
    required: ['logo'],
  };
};
