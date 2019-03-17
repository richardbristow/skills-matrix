import React from 'react';
import { shallow } from 'enzyme';
import SkillsMatrix from '../SkillsMatrix';

describe('SkillsMatrix', () => {
  it('renders without throwing errors', () => {
    const wrapper = shallow(<SkillsMatrix />);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });
});
