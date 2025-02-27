import { BlockDataForm } from '@plone/volto/components';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import trashSVG from '@plone/volto/icons/delete.svg';
import imageSVG from '@plone/volto/icons/image.svg';
import config from '@plone/volto/registry';
import React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { BannerBlockSchema } from './schema';

const messages = defineMessages({
  preview: {
    id: 'Banner preview',
    defaultMessage: 'Banner preview',
  },
  clear: {
    id: 'Clear block',
    defaultMessage: 'Clear block',
  },
});

const BannerBlockData = (props) => {
  const { data, block, onChangeBlock } = props;
  const intl = useIntl();
  const schema = BannerBlockSchema({ formData: data, intl });

  const Image = config.getComponent({ name: 'Image' }).component;

  return (
    <>
      <header className="header pulled">
        <h2>
          <FormattedMessage id="Banner" defaultMessage="Banner" />
        </h2>
        <button
          title={intl.formatMessage(messages.clear)}
          type="button"
          disabled={!data.url}
          onClick={() => {
            onChangeBlock(block, {
              ...data,
              url: undefined,
              alt: undefined,
              text: undefined,
              additionalText: undefined,
            });
          }}
        >
          <Icon name={trashSVG} size="24px" color="red" />
        </button>
      </header>

      <div className="sidebar-metadata-container banner-sidebar">
        {data.url ? (
          <>
            <div>{data.url?.['@id'] ?? data.url.split('/').slice(-1)[0]}</div>
            <Image
              src={
                isInternalURL(data.url)
                  ? `${flattenToAppURL(data.url)}/@@images/image/preview`
                  : data.url
              }
              sizes="188px"
              alt={intl.formatMessage(messages.preview)}
              loading="lazy"
              responsive={true}
              style={{ width: '50%' }}
            />
          </>
        ) : (
          <>
            <FormattedMessage
              id="No image selected"
              defaultMessage="No image selected"
            />
            <Icon name={imageSVG} size="100px" color="#b8c6c8" />
          </>
        )}
      </div>
      <BlockDataForm
        schema={schema}
        onChangeField={(id, value) => {
          onChangeBlock(block, {
            ...data,
            [id]: value,
          });
        }}
        onChangeBlock={onChangeBlock}
        formData={data}
        block={block}
      />
    </>
  );
};

export default BannerBlockData;
