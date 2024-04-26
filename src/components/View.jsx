import { flattenToAppURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import React from 'react';
import ImageInput from './Image/ImageInput';

const View = (props) => {
  const { data, isEditMode } = props;
  const Image = config.getComponent({ name: 'Image' }).component;

  return (
    <div className="block banner">
      {data.url ? (
        <>
          <Image
            src={`${flattenToAppURL(data.url)}/@@images/image`}
            alt={data.alt}
            className="image"
            loading="lazy"
          />
          <div className="text">
            <p>{data?.text}</p>
            <p>{data?.additionalText}</p>
          </div>
        </>
      ) : (
        isEditMode && <ImageInput {...props} />
      )}
    </div>
  );
};

export default View;
