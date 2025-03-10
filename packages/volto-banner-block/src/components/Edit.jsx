import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { ImageInput } from '@plone/volto/components/manage/Widgets/ImageWidget';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import config from '@plone/volto/registry';
import React from 'react';

import BannerSidebar from '@kitconcept/volto-banner-block/components/Data';
import View from '@kitconcept/volto-banner-block/components/View';

const Edit = (props) => {
  const {
    data,
    block,
    onChangeBlock,
    selected,
    disableAddBlockOnEnterKey,
    onSelectBlock,
    onAddBlock,
    disableEnter = false,
  } = props;

  const handleChange = React.useCallback(
    async (id, image) => {
      const url = image ? image['@id'] || image : '';

      onChangeBlock(block, {
        ...data,
        url: flattenToAppURL(url),
      });
    },
    [onChangeBlock, block, data],
  );

  return (
    <>
      {data.url ? (
        <View {...props} isEditMode />
      ) : (
        <ImageInput
          onChange={handleChange}
          block={block}
          id={block}
          objectBrowserPickerType={'image'}
        />
      )}
      <SidebarPortal selected={selected}>
        <BannerSidebar
          {...props}
          data={data}
          block={block}
          onChangeBlock={onChangeBlock}
        />
      </SidebarPortal>
    </>
  );
};

export default Edit;
