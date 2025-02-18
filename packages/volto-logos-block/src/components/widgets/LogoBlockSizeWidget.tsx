import { defineMessages, useIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import ButtonsWidget, { type ButtonsWidgetProps } from './ButtonsWidget';

const messages = defineMessages({
  s: {
    id: 'Small',
    defaultMessage: 'Small',
  },
  l: {
    id: 'Large',
    defaultMessage: 'Large',
  },
});

export const defaultActionsInfo = ({ intl }: { intl: IntlShape }) => ({
  s: ['S', intl.formatMessage(messages.s)],
  l: ['L', intl.formatMessage(messages.l)],
});

const DEFAULT_ACTIONS = [
  {
    name: 's',
    label: 'Small',
  },
  {
    name: 'l',
    label: 'Large',
  },
];

const SizeWidget = (props: ButtonsWidgetProps) => {
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

export default SizeWidget;
