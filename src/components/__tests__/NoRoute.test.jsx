import React from 'react';
import { getByText, queryByText } from 'react-testing-library';
import App from '../../App';
import renderWithRouter from '../../../testFunctions/renderWithRouter';

describe('NoRoute', () => {
  it('should render the NoRoute component without errors on non matching route', () => {
    const { container } = renderWithRouter(<App />, {
      route: '/non-matching-route',
    });
    expect(getByText(container, '404', { selector: 'h1' })).toBeInTheDocument();
    expect(getByText(container, 'Page does not exist.')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render the NoRoute component without errors on non matching route', () => {
    const { container } = renderWithRouter(<App />, {
      route: '/login',
    });
    expect(
      queryByText(container, '404', { selector: 'h1' }),
    ).not.toBeInTheDocument();
    expect(
      queryByText(container, 'Page does not exist.'),
    ).not.toBeInTheDocument();
  });
});
