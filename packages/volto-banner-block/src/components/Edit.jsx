import { SidebarPortal } from '@plone/volto/components';
import { ImageInput } from '@plone/volto/components/manage/Widgets/ImageWidget';
import { flattenToAppURL } from '@plone/volto/helpers';
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

  const handleEnterKey = (e, index) => {
    const isMultipleSelection = e.shiftKey;
    if (e.key === 'Enter' && !disableEnter && !isMultipleSelection) {
      if (!disableAddBlockOnEnterKey) {
        onSelectBlock(onAddBlock(config.settings.defaultBlockType, index + 1));
      }
      e.preventDefault();
    }
  };

  return (
    <div
      className="block banner"
      role="presentation"
      onKeyDown={(e) =>
        handleEnterKey(e, props.index, props.id, props.blockNode.current)
      }
    >
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
    </div>
  );
};

export default Edit;
