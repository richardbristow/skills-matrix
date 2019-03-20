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

describe('checkForEmptyForm', () => {
  it('should disable the login button if email and password fields are empty', () => {
    const wrapper = shallow(<Login />);
    const button = wrapper.find({ type: 'submit' });
    expect(wrapper.instance().checkForEmptyForm()).toEqual(true);
    expect(button.props().disabled).toEqual(true);
  });

  it('should disable the login button if email field is empty', () => {
    const wrapper = shallow(<Login />);
    wrapper.setState({ email: 'emailAddress' });
    const button = wrapper.find({ type: 'submit' });
    expect(wrapper.instance().checkForEmptyForm()).toEqual(true);
    expect(button.props().disabled).toEqual(true);
  });

  it('should disable the login button if password field is empty', () => {
    const wrapper = shallow(<Login />);
    wrapper.setState({ password: 'password' });
    const button = wrapper.find({ type: 'submit' });
    expect(wrapper.instance().checkForEmptyForm()).toEqual(true);
    expect(button.props().disabled).toEqual(true);
  });

  it('should enable the login button if email and password fields have values', () => {
    const wrapper = shallow(<Login />);
    wrapper.setState({ email: 'emailAddress', password: 'password' });
    const button = wrapper.find({ type: 'submit' });
    const emailInput = wrapper.find({ type: 'email' });
    const passwordInput = wrapper.find({ type: 'password' });
    expect(emailInput.props().value).toEqual('emailAddress');
    expect(passwordInput.props().value).toEqual('password');
    expect(wrapper.instance().checkForEmptyForm()).toEqual(false);
    expect(button.props().disabled).toEqual(false);
  });
});
