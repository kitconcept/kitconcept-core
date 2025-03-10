import MaybeWrap from '@plone/volto/components/manage/MaybeWrap/MaybeWrap';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import config from '@plone/volto/registry';
import cx from 'classnames';
import React from 'react';

const LegacyWrapper = (props) => (
  <div className={cx('block banner', props.className)} style={props.style}>
    {props.children}
  </div>
);

const View = (props) => {
  const { data, blocksConfig } = props;
  const isBlockModelv3 = blocksConfig?.banner?.blockModel === 3;
  const Image = config.getComponent({ name: 'Image' }).component;

  return (
    <MaybeWrap {...props} condition={!isBlockModelv3} as={LegacyWrapper}>
      {data.url && (
        <>
          <Image
            src={`${flattenToAppURL(data.url)}/@@images/image`}
            alt={data.alt}
            className="image"
            loading="lazy"
          />
          <div className="text">
            {data.text && <p>{data?.text}</p>}
            {data.additionalText && <p>{data?.additionalText}</p>}
          </div>
        </>
      )}
    </MaybeWrap>
  );
};

export default View;
