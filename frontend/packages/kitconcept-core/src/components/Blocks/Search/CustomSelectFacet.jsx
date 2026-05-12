import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import {
  Option,
  DropdownIndicator,
  MultiValueContainer,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
import {
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Blocks/Search/SelectStyling';
import isEmpty from 'lodash/isEmpty';

const CustomSelectFacet = (props) => {
  const { facet, choices, reactSelect, onChange, value, isEditMode } = props;
  const Select = reactSelect.default;

  const allValues = value || [];
  const options = facet.choices?.length ? facet.choices : choices;
  const filteredValue = allValues.find((el) =>
    options.some((option) => option.value === el.value),
  );

  return (
    <Select
      placeholder={facet?.title ?? (facet?.field?.label || 'select...')}
      className="react-select-container"
      classNamePrefix="react-select"
      options={options}
      styles={customSelectStyles}
      theme={selectTheme}
      components={{
        DropdownIndicator,
        Option,
        MultiValueContainer,
      }}
      isDisabled={isEditMode}
      onChange={(data) => {
        const newValues = [
          // keep values that aren't included in this facet's custom choices
          ...allValues
            .filter((v) => !options.some((option) => option.value === v.value))
            .map((v) => v.value),
          // add the current selection from this facet
          ...(data ? [data.value] : []),
        ];
        onChange(facet.field.value, newValues);
      }}
      isMulti={false}
      isClearable
      value={filteredValue}
    />
  );
};

const customSelectFacetSchemaEnhancer = ({ schema, formData }) => {
  const fields = schema.fieldsets[0].fields;
  debugger;
  fields.splice(fields.indexOf('type') + 1, 0, 'choices');
  schema.properties.choices = {
    widget: 'custom_choices',
    widgetOptions: { field: formData.field },
  };
  return schema;
};

const customSelectFacetStateToValue = ({
  facetSettings,
  index,
  selectedValue,
}) => {
  const getLabel = (v) => {
    const choice = facetSettings.choices?.find((item) => item.value === v);
    return choice?.label || index.values?.[v]?.title;
  };
  return (selectedValue || []).map((v) => ({
    value: v,
    label: getLabel(v),
  }));
};

const customSelectFacetValueToQuery = ({ value, facet }) => {
  return !isEmpty(value)
    ? {
        i: facet.field.value,
        o: 'plone.app.querystring.operation.selection.all',
        v: value,
      }
    : undefined;
};

CustomSelectFacet.schemaEnhancer = customSelectFacetSchemaEnhancer;
CustomSelectFacet.stateToValue = customSelectFacetStateToValue;
CustomSelectFacet.valueToQuery = customSelectFacetValueToQuery;

export default injectLazyLibs('reactSelect')(CustomSelectFacet);
