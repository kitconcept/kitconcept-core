import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import ButtonsWidget, { type ButtonsWidgetProps } from './ButtonsWidget';

import imageFitSVG from '@plone/volto/icons/image-fit.svg';
import imageWideSVG from '@plone/volto/icons/image-wide.svg';

const messages = defineMessages({
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  layout: {
    id: 'Layout',
    defaultMessage: 'Layout',
  },
});

export const defaultActionsInfo = ({ intl }: { intl: IntlShape }) => ({
  default: [imageFitSVG, intl.formatMessage(messages.default)],
  layout: [imageWideSVG, intl.formatMessage(messages.layout)],
});

const DEFAULT_ACTIONS = [
  {
    name: 'default',
    label: 'Default',
  },
  {
    name: 'layout',
    label: 'Layout',
  },
];

const LogoBlockWidthWidget = (props: ButtonsWidgetProps) => {
  const intl = useIntl();

  const { actions = DEFAULT_ACTIONS, actionsInfoMap, filterActions } = props;
  let filteredActions;
  if (filterActions) {
    filteredActions = actions.filter((action) =>
      filterActions.includes(action.name),
    );
  } else {
    filteredActions = actions;
  }

  const actionsInfo = {
    ...defaultActionsInfo({ intl }),
    ...actionsInfoMap,
  };

  return (
    <ButtonsWidget
      {...props}
      actions={filteredActions}
      actionsInfoMap={actionsInfo}
    />
  );
};

export default LogoBlockWidthWidget;
