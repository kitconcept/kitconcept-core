import React from 'react';
import { BlockDataForm } from '@plone/volto/components';
import { LogoBlockSchema } from './schema';
import { useIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  Logo: {
    id: 'Logo',
    defaultMessage: 'Logo',
  },
});

const LogoBlockData = (props) => {
  const { data, block, onChangeBlock } = props;
  const intl = useIntl();

  const schema = LogoBlockSchema(props);

  return (
    <BlockDataForm
      schema={schema}
      title={intl.formatMessage(messages.Logo)}
      onChangeField={(id, value) => {
        onChangeBlock(block, {
          ...data,
          [id]: value,
        });
      }}
      formData={data}
      block={block}
    />
  );
};

export default LogoBlockData;
