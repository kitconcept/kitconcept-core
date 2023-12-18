import React from 'react';
import { flattenToAppURL } from '@plone/volto/helpers';
import { UniversalLink } from '@plone/volto/components';
import { Message } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';
import config from '@plone/volto/registry';
import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';

const messages = defineMessages({
  PleaseChooseLogo: {
    id: 'Please choose a logo as source for this element',
    defaultMessage: 'Please choose a logo as source for this element',
  },
});

const View = (props) => {
  const { data, isEditMode } = props;
  const intl = useIntl();
  const logo = data.logo?.[0];

  return (
    <div className="logo-block">
      {!logo && props.isEditMode && (
        <Message>
          <div className="grid-teaser-item default">
            <img src={imageBlockSVG} alt="" />
            <p>{intl.formatMessage(messages.PleaseChooseLogo)}</p>
          </div>
        </Message>
      )}
      {logo &&
        (isEditMode || !data.link?.length > 0 ? (
          <img
            src={flattenToAppURL(`${logo['@id']}/@@images/image/teaser`)}
            alt="placeholder"
            className="logo-image"
          />
        ) : (
          <UniversalLink href={data.link?.[0]?.['@id']}>
            <img
              src={flattenToAppURL(`${logo['@id']}/@@images/image/teaser`)}
              alt="placeholder"
              className="logo-image"
            />
          </UniversalLink>
        ))}

      <h3 className="logo-heading headline">{data.heading}</h3>
      {config.blocks.blocksConfig.logo.showDescriptionField &&
        data.description && <p>{data.description}</p>}
    </div>
  );
};

export default View;
