import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';

describe('App', () => {
  it('renders without throwing errors', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });
});
