import React from 'react';
import {
  render,
  fireEvent,
  getByLabelText,
  getByText,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';

import renderWithRouter from '../../../testFunctions/renderWithRouter';
import Login from '../login/Login';

const setAuthenticated = jest.fn();
const history = createMemoryHistory();

describe('Login', () => {
  it('should render the login form without throwing an error', () => {
    const { container } = renderWithRouter(
      <Login setAuthenticated={setAuthenticated} history={history} />,
    );
    expect(getByLabelText(container, 'Email address')).toBeInTheDocument();
    expect(getByLabelText(container, 'Password')).toBeInTheDocument();
    expect(
      getByText(container, 'Login', { selector: 'button' }),
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});

describe('checkForEmptyForm', () => {
  it('should enable the login button only when both email and password fields have values', () => {
    const { container } = render(
      <Login setAuthenticated={setAuthenticated} history={history} />,
    );
    const input = getByLabelText(container, 'Email address');
    const password = getByLabelText(container, 'Password');
    const submit = getByText(container, 'Login', { selector: 'button' });

    expect(input.value).toBe('');
    expect(password.value).toBe('');
    expect(submit.disabled).toBe(true);

    fireEvent.change(input, {
      target: { value: 'email@example.com' },
    });
    expect(input.value).toBe('email@example.com');
    expect(password.value).toBe('');
    expect(submit.disabled).toBe(true);

    fireEvent.change(password, {
      target: { value: 'testPassword' },
    });
    expect(input.value).toBe('email@example.com');
    expect(password.value).toBe('testPassword');
    expect(submit.disabled).toBe(false);
  });
});
