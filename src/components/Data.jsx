import { BlockDataForm } from '@plone/volto/components';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Segment } from 'semantic-ui-react';
import ImageInput from './Image/ImageInput';
import { BannerBlockSchema } from './schema';

const BannerBlockData = (props) => {
  const { data, block, onChangeBlock, contentType, navRoot } = props;
  const intl = useIntl();
  const schema = BannerBlockSchema({ formData: data, intl });

  return (
    <>
      <header className="header pulled">
        <h2>
          <FormattedMessage id="Banner" defaultMessage="Banner" />
        </h2>
      </header>

      <Segment className="sidebar-metadata-container" secondary attached>
        {data.url ? (
          <>
            <span>{data.url.split('/').slice(-1)[0]}</span>
            {isInternalURL(data.url) && (
              <img
                src={`${flattenToAppURL(data.url)}/@@images/image/mini`}
                alt={data.alt}
              />
            )}
            {!isInternalURL(data.url) && (
              <img src={data.url} alt={data.alt} style={{ width: '50%' }} />
            )}
          </>
        ) : (
          <>
            <ImageInput {...props} />
          </>
        )}
      </Segment>
      <BlockDataForm
        schema={schema}
        title={schema.title}
        onChangeField={(id, value) => {
          onChangeBlock(block, {
            ...data,
            [id]: value,
          });
        }}
        formData={data}
        block={block}
        navRoot={navRoot}
        contentType={contentType}
      />
    </>
  );
};

export default BannerBlockData;
