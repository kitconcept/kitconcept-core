import React from 'react';
import LogoBlockEdit from './Logo/Edit';
import { SidebarPortal, BlockDataForm } from '@plone/volto/components';
import { layoutSchema } from './Logo/layoutSchema';
import type { logoData } from '../types/Logo';

interface logosEditProps {
  '@type': string;
  data: logoData;
  block: string;
  onChangeBlock: (blockId: string, newData: logoData) => void;
  selected: boolean;
}

const Edit: React.FC<logosEditProps> = (props: {
  data: logoData;
  block: string;
  onChangeBlock: (blockId: string, newData: logoData) => void;
  selected: boolean;
}) => {
  const { data, block, onChangeBlock, selected } = props;

  return (
    <>
      <LogoBlockEdit {...props} />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          {...props}
          data={data}
          block={block}
          schema={layoutSchema(props)}
          onChangeBlock={onChangeBlock}
          formData={data}
          onChangeField={(id, value) => {
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
