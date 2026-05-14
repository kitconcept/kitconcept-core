import FormFieldWrapper from '@plone/volto/components/manage/Widgets/FormFieldWrapper';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  ModalHeader,
  ModalDescription,
  ModalContent,
  ModalActions,
  Input,
} from 'semantic-ui-react';
import DragDropList from '@plone/volto/components/manage/DragDropList/DragDropList';
import { reorderArray } from '@plone/volto/helpers/Utils/Utils';
import { usePrevious } from '@plone/volto/helpers/Utils/usePrevious';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { defineMessages } from 'react-intl';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';

import deleteSVG from '@plone/volto/icons/clear.svg';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import undoSVG from '@plone/volto/icons/undo.svg';
import { useSelector } from 'react-redux';
import dragSVG from '@plone/volto/icons/drag.svg';
import clearSVG from '@plone/volto/icons/clear.svg';

const messages = defineMessages({
  labelRemoveItem: {
    id: 'Remove item',
    defaultMessage: 'Remove item',
  },
  labelAddItem: {
    id: 'Add item',
    defaultMessage: 'Add item',
  },
  labelReset: {
    id: 'Reset',
    defaultMessage: 'Reset',
  },
  listDescription: {
    id: 'listDescription',
    defaultMessage:
      'Select keywords from the full list by filtering and using the arrow button. These keywords will be added to your custom list on the right.',
  },
  availableChoices: {
    id: 'availableChoices',
    defaultMessage: 'Available choices',
  },
  customListDescription: {
    id: 'customListDescription',
    defaultMessage:
      'Customize your keyword list by reordering the entries and, if needed, renaming the keywords for display purposes.',
  },
  searchKeyword: {
    id: 'Search Keyword',
    defaultMessage: 'Search Keyword',
  },
  customizeList: {
    id: 'Customize list',
    defaultMessage: 'Customize list',
  },
  customList: {
    id: 'Custom list',
    defaultMessage: 'Custom list',
  },
  orderListAlphabetically: {
    id: 'Order list alphabetically',
    defaultMessage: 'Order list alphabetically',
  },
  clearList: {
    id: 'Clear list',
    defaultMessage: 'Clear list',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
  apply: {
    id: 'Apply',
    defaultMessage: 'Apply',
  },
});

const sortAlphabetically = (items, key = 'label') => {
  // Check if array is already sorted alphabetically
  const isAlreadySorted = items.every((item, index) => {
    if (index === 0) return true;
    const prevLabel = items[index - 1][key].toLowerCase();
    const currentLabel = item[key].toLowerCase();
    return prevLabel <= currentLabel;
  });

  // If already sorted, reverse it
  if (isAlreadySorted) {
    return [...items].reverse();
  }

  // Otherwise sort alphabetically
  return [...items].sort((a, b) => {
    const labelA = a[key].toLowerCase();
    const labelB = b[key].toLowerCase();

    if (labelA < labelB) return -1;
    if (labelA > labelB) return 1;
    return 0;
  });
};

const CustomChoicesWidget = (props) => {
  const { id, intl, onChange, value, fieldSet, widgetOptions } = props;
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [customKeywordList, setCustomKeywordList] = useState(value || []);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editValue, setEditValue] = useState('');

  const fieldLabel = widgetOptions?.field?.label;
  const field = widgetOptions?.field?.value;
  const previousField = usePrevious(field);
  const indexes = useSelector((state) => state.querystring?.indexes);
  const keywords = sortAlphabetically(
    Object.entries(indexes[field]?.values || {}).map(([v, item]) => ({
      value: v,
      label: item.title,
    })),
  );

  // Reset value if editor switched to a different field
  useEffect(() => {
    if (previousField && field !== previousField) {
      setCustomKeywordList([]);
    }
  }, [field, previousField]);

  if (!keywords?.length) return null;

  const handleClick = (index, value) => {
    setEditingIndex(index);
    setEditValue(value);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      handleSubmit(index);
    }
  };

  const handleSubmit = (index, newValue = editValue) => {
    if (newValue !== customKeywordList[index]) {
      const newItems = [...customKeywordList];
      newItems[index].label = newValue;
      setCustomKeywordList(newItems);
    }
    setEditingIndex(-1);
  };

  const handleBlur = (index) => {
    handleSubmit(index);
  };

  const isLabelEdited = (item, referenceArray) => {
    return !referenceArray.some(
      (refItem) => refItem.value === item.value && refItem.label === item.label,
    );
  };

  return (
    <FormFieldWrapper {...props} className="custom-choices-widget">
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={
          <Button
            onClick={(e) => {
              e.target.blur();
            }}
            basic
            primary
            className="edit-custom-choices-button"
          >
            {intl.formatMessage(messages.customizeList)}…
          </Button>
        }
        className="custom-choices-widget-modal"
      >
        <ModalHeader>
          {' '}
          <FormattedMessage
            id="listTitle"
            defaultMessage='Customize "{vocabulary}" list'
            values={{
              vocabulary: `${fieldLabel}`,
            }}
          />
        </ModalHeader>
        <div className="lists-wrapper">
          <ModalContent>
            <ModalDescription>
              <strong>{intl.formatMessage(messages.availableChoices)}</strong>
              <p>{intl.formatMessage(messages.listDescription)}</p>
              <div className="search-keyword-input">
                <Input
                  id={'keyword-searchtext'}
                  value={searchText}
                  placeholder={intl.formatMessage(messages.searchKeyword)}
                  fluid
                  onChange={(event, { value }) => {
                    setSearchText(value);
                  }}
                  aria-label="Search"
                />
              </div>
              <div className="table-wrapper">
                <table className="">
                  <tbody className="">
                    {keywords
                      .filter((item) =>
                        item?.label
                          ?.toString()
                          .toLowerCase()
                          .includes(searchText.toString().toLowerCase()),
                      )
                      .map((item) => (
                        <tr key={item.value}>
                          <td className="list-item">
                            {item.label}
                            {!customKeywordList.some(
                              (refItem) => refItem.value === item.value,
                            ) && (
                              <button
                                className="add-button"
                                title={intl.formatMessage(
                                  messages.labelAddItem,
                                )}
                                onClick={() => {
                                  setCustomKeywordList([
                                    ...customKeywordList,
                                    { ...item },
                                  ]);
                                }}
                              >
                                <Icon name={aheadSVG} size="20px" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </ModalDescription>
          </ModalContent>
          <ModalContent>
            <ModalDescription>
              <strong>{intl.formatMessage(messages.customList)}</strong>
              <p>{intl.formatMessage(messages.customListDescription)}</p>
              <div className="buttons-wrapper">
                <Button
                  size="tiny"
                  className="sort-button blue"
                  onClick={(e) => {
                    setCustomKeywordList(sortAlphabetically(customKeywordList));
                    e.target.blur();
                  }}
                >
                  {intl.formatMessage(messages.orderListAlphabetically)}
                </Button>
                <Button
                  className="clear-button"
                  size="tiny"
                  negative
                  onClick={(e) => {
                    setCustomKeywordList([]);
                    e.target.blur();
                  }}
                >
                  {intl.formatMessage(messages.clearList)}
                </Button>
              </div>

              <DragDropList
                forwardedAriaLabelledBy={`fieldset-${
                  fieldSet || 'default'
                }-field-label-${id}`}
                childList={customKeywordList.map((item) => [item.value, item])}
                onMoveItem={(result) => {
                  const { source, destination } = result;
                  if (!destination) {
                    return;
                  }
                  const newValue = reorderArray(
                    customKeywordList,
                    source.index,
                    destination.index,
                  );
                  setCustomKeywordList(newValue);
                  return true;
                }}
              >
                {({ child, childId, index, draginfo }) => {
                  return (
                    <div
                      ref={draginfo.innerRef}
                      {...draginfo.draggableProps}
                      key={childId}
                      className="draggable-list-element"
                    >
                      <div fluid styled>
                        <div className="draggable-list-element-inner">
                          <button
                            style={{
                              visibility: 'visible',
                              display: 'inline-block',
                            }}
                            {...draginfo.dragHandleProps}
                            className="drag handle"
                          >
                            <Icon name={dragSVG} size="18px" />
                          </button>

                          <div
                            className={cx('label-wrapper', {
                              'edited-label': isLabelEdited(child, keywords),
                            })}
                          >
                            {editingIndex === index ? (
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={() => handleBlur(index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="editable-label-input"
                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus
                              />
                            ) : (
                              <div
                                onClick={() => handleClick(index, child.label)}
                                className="editable-label"
                                onKeyDown={(e) => {}}
                                role="none"
                              >
                                {`${child.label}`}
                              </div>
                            )}
                          </div>
                          {isLabelEdited(child, keywords) && (
                            <Button
                              className="reset-button"
                              title={intl.formatMessage(messages.labelReset)}
                              onClick={() => {
                                handleSubmit(
                                  index,
                                  keywords.find(
                                    (item) => item.value === child.value,
                                  ).label,
                                );
                              }}
                            >
                              <Icon name={undoSVG} size="19px" />
                            </Button>
                          )}

                          <button
                            className="remove-item-button"
                            title={intl.formatMessage(messages.labelRemoveItem)}
                            aria-label={`${intl.formatMessage(
                              messages.labelRemoveItem,
                            )} #${index + 1}`}
                            onClick={() => {
                              setCustomKeywordList(
                                customKeywordList.filter((v, i) => i !== index),
                              );
                            }}
                          >
                            <Icon
                              name={deleteSVG}
                              size="20px"
                              color="#e40166"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </DragDropList>
            </ModalDescription>
          </ModalContent>
        </div>
        <ModalActions>
          <Button
            type="button"
            basic
            secondary
            aria-label={intl.formatMessage(messages.cancel)}
            title={intl.formatMessage(messages.cancel)}
            onClick={() => {
              setCustomKeywordList(value || []);
              setOpen(false);
            }}
          >
            <Icon name={clearSVG} className="circled" size="30px" />
          </Button>
          <Button
            basic
            primary
            aria-label={intl.formatMessage(messages.apply)}
            title={intl.formatMessage(messages.apply)}
            onClick={() => {
              setOpen(false);
              onChange(id, customKeywordList);
            }}
          >
            <Icon name={aheadSVG} className="contents circled" size="30px" />
          </Button>
        </ModalActions>
      </Modal>
    </FormFieldWrapper>
  );
};

/**
 * Property types
 * @property {Object} propTypes Property types.
 * @static
 */
CustomChoicesWidget.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
CustomChoicesWidget.defaultProps = {
  description: null,
  required: false,
  error: [],
  value: null,
  onChange: () => {},
};

export default CustomChoicesWidget;
