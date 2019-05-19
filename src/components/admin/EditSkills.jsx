import React, { useState } from 'react';
import {
  Card,
  OverlayTrigger,
  Tooltip,
  Modal,
  Button,
  Form,
} from 'react-bootstrap';
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <StyledMain>
      <h2>Edit Skills</h2>
      <p>Add a new skill</p>
      <StyledSkillsGrid>
        {skillsTest.map(skill => (
          <Card css="flex-direction: row" className="card" key={skill}>
            <Card.Body>{skill}</Card.Body>
            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
              <StyledButton
                name={skill}
                type="button"
                onClick={() => setEditModalOpen(true)}
              >
                <Edit size={18} />
              </StyledButton>
            </OverlayTrigger>
            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
              <StyledButton
                type="button"
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 size={18} />
              </StyledButton>
            </OverlayTrigger>
          </Card>
        ))}
      </StyledSkillsGrid>

      <Modal show={deleteModalOpen} onHide={() => setDeleteModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>Please confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this skill?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={() => setDeleteModalOpen(false)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={editModalOpen} onHide={() => setEditModalOpen(false)}>
        <Modal.Header>
          <Modal.Title>Edit Skill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEditSkillName">
              <Form.Label>Skill Name</Form.Label>
              <Form.Control type="text" placeholder="Skill" />
            </Form.Group>
            <Form.Group controlId="formEditSkillDescription">
              <Form.Label>Skill Description</Form.Label>
              <Form.Control as="textarea" rows="3" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setEditModalOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setEditModalOpen(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </StyledMain>
  );
};

export default EditSkills;
