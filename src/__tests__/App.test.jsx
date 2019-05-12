import React from 'react';
import { waitForDomChange, getByText } from 'react-testing-library';
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
