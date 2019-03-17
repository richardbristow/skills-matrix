import React from 'react';
import { shallow } from 'enzyme';
import Login from '../Login';

describe('Login', () => {
  it('should render the login form without throwing an error', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render an email input', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find({ controlId: 'email' })).toHaveLength(1);
  });

  it('should render a password input', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find({ controlId: 'password' })).toHaveLength(1);
  });

  it('should render a login/submit button', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find({ type: 'submit' })).toHaveLength(1);
  });
});
