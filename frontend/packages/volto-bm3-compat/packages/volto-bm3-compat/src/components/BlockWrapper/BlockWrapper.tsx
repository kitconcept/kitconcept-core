import MaybeWrap from '@plone/volto/components/manage/MaybeWrap/MaybeWrap';
import cx from 'classnames';
import type { BlockViewProps } from '@plone/types';
import type { ComponentType, ReactNode } from 'react';

const LegacyWrapper = (props: BlockViewProps & { children: ReactNode }) => {
  return (
    <div
      className={cx('block', props?.data?.['@type'], props.className)}
      style={props.style}
    >
      {props.children}
    </div>
  );
};

type BlockWrapperProps = BlockViewProps & {
  children: ReactNode;
  ExtraWrapper?: ComponentType<any>;
};

const BlockWrapper = (props: BlockWrapperProps) => {
  const isBlockModelv3 =
    props.blocksConfig?.[props.data?.['@type']]?.blockModel === 3;

  const ExtraWrapper = props.ExtraWrapper;
  return (
    <MaybeWrap {...props} condition={!isBlockModelv3} as={LegacyWrapper}>
      {ExtraWrapper ? (
        <MaybeWrap {...props} condition={!isBlockModelv3} as={ExtraWrapper}>
          {props.children}
        </MaybeWrap>
      ) : (
        props.children
      )}
    </MaybeWrap>
  );
};

export default BlockWrapper;
