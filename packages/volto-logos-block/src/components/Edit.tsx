import React from 'react';

import type { BlockEditProps } from '@plone/types';
import View from './View';
import { SidebarPortal, BlockDataForm } from '@plone/volto/components';
import { layoutSchema } from './schema';

interface logosEditProps extends BlockEditProps {
  '@type': string;
  data: logoData;
  block: string;
  onChangeBlock: (blockId: string, newData: logoData) => void;
  selected: boolean;
}
export type logoData = {
  data: {
    blocks: logoBlock;
    blocks_layout: {
      items: string[];
    };
  };
  logo_size: string;
  logo_width: string;
};
type logoBlock = {
  alt: string;
  href: link[];
  logo: Logo[];
  openLinkInNewTab: boolean;
};
type link = {
  '@id': string;
  Description: string;
  Title: string;
};
type Logo = {
  '@id': string;
  '@type': string;
  Description: string;
  Title: string;
  image_field: string;
};

const Edit = (props: logosEditProps) => {
  const { data, block, onChangeBlock, selected } = props;

  return (
    <>
      <View {...props} isEditMode />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          {...props}
          data={data}
          block={block}
          schema={layoutSchema(props)}
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
