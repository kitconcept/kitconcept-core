import React from 'react';
import { render } from '@testing-library/react';

import BlockWrapper from './BlockWrapper';

describe('<BlockWrapper />', () => {
  it('renders the component wrapped in the specified component', () => {
    const blocksConfig = {
      button: {
        id: 'button',
        title: 'Custom block',
        blockModel: 3,
      },
    };
    const data = {
      '@type': 'button',
    };
    const BlockView = (props) => <div>The block view</div>;
    const props = {
      blocksConfig,
      className: 'extra-classname flex items-center bg-quanta-sapphire',
      data,
      style: { '--blockWidth': 'var(--container-default-width)' },
    };
    const { container } = render(
      <BlockWrapper {...props}>
        <BlockView />
      </BlockWrapper>,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders the component not wrapped (condition false)', () => {
    const blocksConfig = {
      button: {
        id: 'button',
        title: 'Custom block',
      },
    };
    const data = {
      '@type': 'button',
    };
    const BlockView = (props) => <div>The block view</div>;
    const props = {
      blocksConfig,
      className: 'extra-classname flex items-center bg-quanta-sapphire',
      data,
      style: { '--blockWidth': 'var(--container-default-width)' },
    };
    const { container } = render(
      <BlockWrapper {...props}>
        <BlockView />
      </BlockWrapper>,
    );

    expect(container).toMatchSnapshot();
  });
});
