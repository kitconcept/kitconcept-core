import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Banner: {
    id: 'Banner',
    defaultMessage: 'Banner',
  },
  AltText: {
    id: 'Alt text',
    defaultMessage: 'Alt text',
  },
  openLinkInNewTab: {
    id: 'Open in a new tab',
    defaultMessage: 'Open in a new tab',
  },
  AltTextHint: {
    id: 'Leave empty if the image is purely decorative.',
    defaultMessage: 'Leave empty if the image is purely decorative.',
  },
  AltTextHintLinkText: {
    id: 'Describe the purpose of the image.',
    defaultMessage: 'Describe the purpose of the image.',
  },
  Line1: {
    id: 'Line 1',
    defaultMessage: 'Line 1',
  },
  Line2: {
    id: 'Line 2',
    defaultMessage: 'Line 2',
  },
});

export const BannerBlockSchema = (props) => {
  return {
    block: props.intl.formatMessage(messages.Banner),
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          ...(props.formData?.url ? ['alt', 'text', 'additionalText'] : []),
        ],
      },
    ],

    properties: {
      alt: {
        title: props.intl.formatMessage(messages.AltText),
        description: (
          <>
            <a
              href="https://www.w3.org/WAI/tutorials/images/decision-tree/"
              title={props.intl.formatMessage(messages.openLinkInNewTab)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.intl.formatMessage(messages.AltTextHintLinkText)}
            </a>{' '}
            {props.intl.formatMessage(messages.AltTextHint)}
          </>
        ),
      },
      text: {
        title: propsintl.formatMessage(messages.Line1),
      },
      additionalText: {
        title: props.intl.formatMessage(messages.Line2),
      },
    },
    required: [],
  };
};
