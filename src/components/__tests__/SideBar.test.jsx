import React from 'react';
import { shallow } from 'enzyme';
import SideBar from '../SideBar';

describe('SideBar', () => {
  it('should render SideBar without any errors', () => {
    const wrapper = shallow(<SideBar />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });
});
