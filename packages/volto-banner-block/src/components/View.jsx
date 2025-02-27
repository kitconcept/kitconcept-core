import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import cx from 'classnames';
import React from 'react';

const View = (props) => {
  const { className, data } = props;
  const Image = config.getComponent({ name: 'Image' }).component;

  return (
    <div className={cx('block banner', className)}>
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
    </div>
  );
};

export default View;
