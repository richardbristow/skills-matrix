import React from 'react';
import { getByText, queryByText, waitFor } from '@testing-library/react';
import App from '../../App';
import renderWithRouter from '../../../testFunctions/renderWithRouter';

describe('NoRoute', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render the NoRoute component without errors on non matching route', async () => {
    const { container } = renderWithRouter(<App />, {
      route: '/non-matching-route',
    });
    await waitFor(() => {
      expect(
        getByText(container, '404', { selector: 'h1' }),
      ).toBeInTheDocument();
      expect(getByText(container, 'Page does not exist.')).toBeInTheDocument();
    });
    expect(container).toMatchSnapshot();
  });

  it('should not render the NoRoute component on matching route', async () => {
    const { container } = renderWithRouter(<App />, {
      route: '/login',
    });
    await waitFor(() => {
      expect(
        queryByText(container, '404', { selector: 'h1' }),
      ).not.toBeInTheDocument();
      expect(
        queryByText(container, 'Page does not exist.'),
      ).not.toBeInTheDocument();
      expect(
        getByText(container, 'Login', { selector: 'h3' }),
      ).toBeInTheDocument();
    });
  });
});
