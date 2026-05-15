import type { ConfigType } from '@plone/registry';
import { defineMessages } from 'react-intl';
import CustomSelectFacet from '../components/Blocks/Search/CustomSelectFacet';
import { SelectFacetFilterListEntry } from '@plone/volto/components/manage/Blocks/Search/components';
import CustomChoicesWidget from '../components/Blocks/Search/CustomChoicesWidget';

defineMessages({
  customSelectFacet: {
    id: 'customSelectFacet',
    defaultMessage: 'Customized Select',
  },
});

// Really we should fix the types in @plone/registry...
type FacetType = {
  id: string;
  title: string;
  view: React.ComponentType<any>;
  isDefault: boolean;
  schemaEnhancer?: (schema: any) => any;
  stateToValue?: (state: any) => any;
  valueToQuery?: (value: any) => any;
  filterListComponent?: React.ComponentType<any>;
};

type SearchBlockExtensions = {
  facetWidgets: {
    types: Array<FacetType>;
  };
};

export default function install(config: ConfigType) {
  const searchBlockExtensions = config.blocks.blocksConfig.search
    .extensions as unknown as SearchBlockExtensions;
  searchBlockExtensions.facetWidgets.types = [
    ...searchBlockExtensions.facetWidgets.types,
    {
      id: 'customSelectFacet',
      title: 'Customized Select',
      view: CustomSelectFacet,
      isDefault: false,
      schemaEnhancer: CustomSelectFacet.schemaEnhancer,
      stateToValue: CustomSelectFacet.stateToValue,
      valueToQuery: CustomSelectFacet.valueToQuery,
      filterListComponent: SelectFacetFilterListEntry,
    },
  ];

  config.widgets.widget.custom_choices = CustomChoicesWidget;

  return config;
}
