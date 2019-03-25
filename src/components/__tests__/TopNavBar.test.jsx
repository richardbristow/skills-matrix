import React from 'react';
import { shallow } from 'enzyme';
import TopNavBar from '../TopNavBar';

describe('TopNavBar', () => {
  it('should render TopNavBar without any errors', () => {
    const wrapper = shallow(<TopNavBar />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });
});
