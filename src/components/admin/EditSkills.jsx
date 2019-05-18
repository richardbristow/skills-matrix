import React from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import styled from 'styled-components/macro';
import { Trash2, Edit } from 'react-feather';

import StyledMain from '../../shared/StyledMain';

const skillsTest = [
  'Printers',
  'Windows 10',
  'Checkouts',
  'Telephony',
  'Outlook',
];

const StyledSkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 40px;
`;

const StyledButton = styled.button`
  border: none;
  cursor: pointer;
  align-self: center;
  &:focus {
    outline: none;
  }
`;

const EditSkills = () => {
  return (
    <StyledMain>
      <h2>Edit Skills</h2>
      <p>Add a new skill</p>
      <StyledSkillsGrid>
        {skillsTest.map(skill => (
          <Card css="flex-direction: row" className="card" key={skill}>
            <Card.Body>{skill}</Card.Body>
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <StyledButton type="button">
                <Edit size={18} />
              </StyledButton>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <StyledButton type="button">
                <Trash2 size={18} />
              </StyledButton>
            </OverlayTrigger>
          </Card>
        ))}
      </StyledSkillsGrid>
    </StyledMain>
  );
};

export default EditSkills;
