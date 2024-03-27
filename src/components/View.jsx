import { flattenToAppURL } from '@plone/volto/helpers';
import React from 'react';
import ImageInput from './Image/ImageInput';

const View = (props) => {
  const { data, isEditMode } = props;

  return (
    <div className="block banner">
      {data.url ? (
        <div>
          <img
            src={`${flattenToAppURL(data.url)}/${
              data?.image_scales?.image[0]?.download
            }}`}
            alt={data.alt}
            className="image"
            loading="lazy"
          />
          <div className="text">
            <p>{data?.text}</p>
            <p>{data?.additionalText}</p>
          </div>
        </div>
      ) : (
        isEditMode && <ImageInput {...props} />
      )}
    </div>
  );
};

export default View;
