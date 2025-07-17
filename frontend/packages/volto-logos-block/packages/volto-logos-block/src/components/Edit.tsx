import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import { LogosBlockSchema } from './schema';
import View from './View';
import type { BlockEditProps } from '@plone/types';
import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';

const messages = defineMessages({
  PleaseChooseLogo: {
    id: 'Please set logos as source for this block',
    defaultMessage: 'Please set logos as source for this block',
  },
});

const Edit = (props: BlockEditProps) => {
  const { data, block, onChangeBlock, selected } = props;
  const intl = useIntl();
  return (
    <>
      <View {...props} />
      {(!data?.logos || data.logos?.length === 0) && (
        <div className="grid-teaser-item default">
          <img src={imageBlockSVG} alt="" />
          <p>{intl.formatMessage(messages.PleaseChooseLogo)}</p>
        </div>
      )}
      {/* @ts-ignore */}
      <SidebarPortal selected={selected}>
        <BlockDataForm
          {...props}
          data={data}
          block={block}
          schema={LogosBlockSchema({ props, intl })}
          onChangeBlock={onChangeBlock}
          formData={data}
          onChangeField={(id: string, value: any) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
        />
      </SidebarPortal>
    </>
  );
};

export default Edit;
