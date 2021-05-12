import React from 'react';
import { getByText, waitFor } from '@testing-library/react';
import App from '../App';
import renderWithRouter from '../../testFunctions/renderWithRouter';

describe('App', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders without throwing errors', async () => {
    const { container } = renderWithRouter(<App />);
    // console.error = jest.fn();
    await waitFor(() => {
      expect(
        getByText(container, 'Login', { selector: 'h3' }),
      ).toBeInTheDocument();
    });
    expect(container).toMatchSnapshot();
  });
});
