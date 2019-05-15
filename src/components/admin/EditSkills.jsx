import React from 'react';
import { Button, Card } from 'react-bootstrap';
import styled from 'styled-components/macro';

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

const EditSkills = () => {
  return (
    <StyledMain>
      <h2>Edit Skills</h2>
      <p>Add a new skill</p>
      <StyledSkillsGrid>
        {skillsTest.map(skill => (
          <Card key={skill}>
            <Card.Body>{skill}</Card.Body>
            <Button>Edit</Button>
            <Button>Delete</Button>
          </Card>
        ))}
      </StyledSkillsGrid>
    </StyledMain>
  );
};

export default EditSkills;
