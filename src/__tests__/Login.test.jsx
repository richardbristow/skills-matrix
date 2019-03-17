import React from 'react';
import ReactDOM from 'react-dom';
import SkillsMatrix from '../SkillsMatrix';

describe('SkillsMatrix', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SkillsMatrix />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
