import React from 'react';
import View from './View';
import { SidebarPortal, BlockDataForm } from '@plone/volto/components';
import { layoutSchema } from './layoutSchema';
import type { logoData } from '@kitconcept/volto-logos-block/types/Logo';

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
