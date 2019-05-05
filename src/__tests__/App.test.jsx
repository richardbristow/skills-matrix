import React from 'react';
import App from '../App';
import renderWithRouter from '../../testFunctions/renderWithRouter';

describe('App', () => {
  it('renders without throwing errors', () => {
    const { container } = renderWithRouter(<App />);
    expect(container).toMatchSnapshot();
  });
});
