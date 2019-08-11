import React from 'react';
import { fireEvent, getByText } from '@testing-library/react';
import SideBar from '../SideBar';
import renderWithRouter from '../../../testFunctions/renderWithRouter';

describe('SideBar', () => {
  const handleLogout = jest.fn();

  it('should render SideBar without any errors when not authenticated', () => {
    const { container } = renderWithRouter(
      <SideBar authenticated={false} handleLogout={handleLogout} />,
    );
    expect(container.querySelector('aside')).toBeInTheDocument();
    expect(
      getByText(container, 'Skills Matrix', { selector: 'h3' }),
    ).toBeInTheDocument();
    expect(
      getByText(container, 'Login', { selector: 'a' }),
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should add active class to SideBar option matching the current route', () => {
    const { container } = renderWithRouter(
      <SideBar authenticated={false} handleLogout={handleLogout} />,
    );
    const loginLink = getByText(container, 'Login');
    expect(loginLink).not.toHaveClass('active');
    fireEvent.click(loginLink);
    expect(loginLink).toHaveClass('active');
  });
});
