import { render } from '@testing-library/react';

import MobxReactHooks from './mobx-react-hooks';

describe('MobxReactHooks', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MobxReactHooks />);
    expect(baseElement).toBeTruthy();
  });
});
