import React from 'react';
import { waitForDomChange, getByText } from '@testing-library/react';
import App from '../App';
import renderWithRouter from '../../testFunctions/renderWithRouter';

describe('App', () => {
  it('renders without throwing errors', async () => {
    const { container } = renderWithRouter(<App />);
    await waitForDomChange();
    expect(
      getByText(container, 'Login', { selector: 'h3' }),
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
