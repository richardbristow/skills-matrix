import React, { useState, useEffect } from 'react';
import {
  Card,
  OverlayTrigger,
  Tooltip,
  Modal,
  Button,
  Form,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';
import { Trash2, Edit } from 'react-feather';
import { API } from 'aws-amplify';

import StyledMain from '../../shared/StyledMain';

const StyledSkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  grid-gap: 40px;
`;

const StyledButton = styled.button`
  border: none;
  cursor: pointer;
  align-self: center;
  &:focus {
    outline: none;
  }
  background-color: transparent;
`;

const SkillModal = ({ addSkill, modalOpen, setOpenModal }) => (
  <Modal show={modalOpen} onHide={() => setOpenModal(false)}>
    <Modal.Header>
      <Modal.Title>{addSkill ? 'Add New Skill' : 'Edit Skill'}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group
          controlId={addSkill ? 'formAddSkillName' : 'formEditSkillName'}
        >
          <Form.Label>Skill Name</Form.Label>
          <Form.Control type="text" placeholder="Skill" />
        </Form.Group>
        <Form.Group
          controlId={
            addSkill ? 'formAddSkillDescription' : 'formEditSkillDescription'
          }
        >
          <Form.Label>Skill Description</Form.Label>
          <Form.Control as="textarea" rows="3" />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={() => setOpenModal(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={() => setOpenModal(false)}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
);

const EditSkills = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addSkillModalOpen, setAddSkillModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [data, setData] = useState({ Items: [] });

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(null);
      setIsLoading(true);
      try {
        const response = await API.get('skillsList', '/skillslist');
        setData(response);
      } catch (error) {
        setIsError(error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <StyledMain>
      <h2>Edit Skills</h2>
      <p>Use this page to add, edit an delete skills.</p>
      <Button
        disabled={isLoading}
        css="margin-bottom: 40px"
        onClick={() => setAddSkillModalOpen(true)}
      >
        Add new skill
      </Button>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <StyledSkillsGrid>
          {data.Items.map(skill => {
            const { skillName, skillDescription } = skill;
            return (
              <Card key={skillName}>
                <Card.Body>
                  <Card.Title>
                    <div css="float: right">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Edit</Tooltip>}
                      >
                        <StyledButton
                          name={skillName}
                          type="button"
                          onClick={() => setEditModalOpen(true)}
                        >
                          <Edit size={18} />
                        </StyledButton>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete</Tooltip>}
                      >
                        <StyledButton
                          type="button"
                          onClick={() => setDeleteModalOpen(true)}
                        >
                          <Trash2 size={18} />
                        </StyledButton>
                      </OverlayTrigger>
                    </div>
                    {skillName}
                  </Card.Title>
                  <Card.Text>{skillDescription}</Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </StyledSkillsGrid>
      )}

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

      <SkillModal
        addSkill
        modalOpen={addSkillModalOpen}
        setOpenModal={setAddSkillModalOpen}
      />

      <SkillModal modalOpen={editModalOpen} setOpenModal={setEditModalOpen} />
    </StyledMain>
  );
};

SkillModal.defaultProps = {
  addSkill: false,
};

SkillModal.propTypes = {
  addSkill: PropTypes.bool,
  modalOpen: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
};

export default EditSkills;
