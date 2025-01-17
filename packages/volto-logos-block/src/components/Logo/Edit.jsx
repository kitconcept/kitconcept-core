import React from 'react';
import View from './View';
import { SidebarPortal } from '@plone/volto/components';
import LogoBlockSidebar from './Data';

const Edit = (props) => {
  const { data, block, onChangeBlock, selected } = props;

  return (
    <div className="block logo-block">
      <View {...props} isEditMode />
      <SidebarPortal selected={selected}>
        <LogoBlockSidebar
          {...props}
          data={data}
          block={block}
          onChangeBlock={onChangeBlock}
        />
      </SidebarPortal>
    </div>
  );
};

export default Edit;
