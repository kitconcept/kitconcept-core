import React from 'react';
import cx from 'classnames';
import LogosContainer from '@kitconcept/volto-light-theme/components/LogosContainer/LogosContainer';
import type { BlockViewProps } from '@plone/types';

const View = (props: BlockViewProps) => {
  const { className } = props;
  const { logos, logos_size, logos_container_width } = props?.data;

  return (
    <div className={cx('block logos', className)}>
      <LogosContainer
        logos={logos}
        logos_size={logos_size}
        logos_container_width={logos_container_width}
      />
    </div>
  );
};

export default View;
