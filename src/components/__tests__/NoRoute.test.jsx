import React from 'react';
import { shallow } from 'enzyme';
import NoRoute from '../NoRoute';

describe('NoRoute', () => {
  it('should render the NoRoute component without errors', () => {
    const wrapper = shallow(<NoRoute />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });
});
