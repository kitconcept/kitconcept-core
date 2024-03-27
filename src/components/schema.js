import { defineMessages } from 'react-intl';

const messages = defineMessages({
  banner: {
    id: 'Banner',
    defaultMessage: 'Banner',
  },
  Source: {
    id: 'Source',
    defineMessage: 'Source',
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
    id: 'Alt text hint',
    defaultMessage: 'Leave empty if the image is purely decorative.',
  },
  AltTextHintLinkText: {
    id: 'Alt text hint link text',
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

export const BannerBlockSchema = ({ formData, intl }) => {
  return {
    block: 'banner',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          ...(formData?.url ? ['url', 'alt', 'text', 'additionalText'] : []),
        ],
      },
    ],

    properties: {
      url: {
        title: intl.formatMessage(messages.Source),
        widget: 'url',
      },
      alt: {
        title: intl.formatMessage(messages.AltText),
        description: (
          <>
            <a
              href="https://www.w3.org/WAI/tutorials/images/decision-tree/"
              title={intl.formatMessage(messages.openLinkInNewTab)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {intl.formatMessage(messages.AltTextHintLinkText)}
            </a>{' '}
            {intl.formatMessage(messages.AltTextHint)}
          </>
        ),
      },
      text: {
        title: intl.formatMessage(messages.Line1),
      },
      additionalText: {
        title: intl.formatMessage(messages.Line2),
      },
    },
    required: [],
  };
};
