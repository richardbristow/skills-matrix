import React, { useState, useEffect } from 'react';
import {
  Card,
  OverlayTrigger,
  Tooltip,
  Modal,
  Button,
  Form,
  Spinner,
  Alert,
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

const SkillModal = ({
  addSkill,
  modalOpen,
  setOpenModal,
  clickedModalData,
  setClickedModalData,
}) => {
  const [values, setValues] = useState(clickedModalData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    setValues(clickedModalData);
  }, [clickedModalData]);

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setValues({ ...values, [name]: value });
    setIsError(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setClickedModalData(null);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const { skillName, skillDescription } = values;
    const params = {
      body: { skillName, skillDescription },
    };
    setIsError(null);
    setIsLoading(true);
    try {
      if (addSkill) {
        await API.post('skillsList', '/skillslist', params);
      } else {
        await API.patch(
          'skillsList',
          `/skillslist/${clickedModalData.skillId}`,
          params,
        );
      }
      handleCloseModal();
      // setIsLoading(false);
    } catch (error) {
      setIsError(error);
      setIsLoading(false);
    }
  };

  return (
    <Modal show={modalOpen} onHide={handleCloseModal}>
      {values && (
        <>
          <Modal.Header>
            <Modal.Title>
              {addSkill ? 'Add New Skill' : 'Edit Skill'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isError && (
              <Alert variant="danger">
                <strong>Error:</strong> {isError.message}
              </Alert>
            )}
            <Form id="skills-list-form" onSubmit={handleSubmit}>
              <Form.Group
                controlId={addSkill ? 'formAddSkillName' : 'formEditSkillName'}
              >
                <Form.Label>Skill Name</Form.Label>
                <Form.Control
                  name="skillName"
                  type="text"
                  value={values.skillName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </Form.Group>
              <Form.Group
                controlId={
                  addSkill
                    ? 'formAddSkillDescription'
                    : 'formEditSkillDescription'
                }
              >
                <Form.Label>Skill Description</Form.Label>
                <Form.Control
                  name="skillDescription"
                  as="textarea"
                  rows="3"
                  value={values.skillDescription}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
              form="skills-list-form"
              variant="primary"
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    variant="primary"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

const DeleteModal = ({
  modalOpen,
  setOpenModal,
  clickedModalData,
  setClickedModalData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const handleCloseModal = () => {
    setClickedModalData(null);
    setOpenModal(false);
  };

  const handleDelete = async () => {
    setIsError(null);
    setIsLoading(true);
    try {
      await API.del('skillsList', `/skillslist/${clickedModalData.skillId}`);
      handleCloseModal();
      // setIsLoading(false);
    } catch (error) {
      setIsError(error);
      setIsLoading(false);
    }
  };

  return (
    <Modal show={modalOpen} onHide={handleCloseModal}>
      {clickedModalData && (
        <>
          <Modal.Header>
            <Modal.Title>Please confirm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isError && (
              <Alert variant="danger">
                <strong>Error:</strong> {isError.message}
              </Alert>
            )}
            Are you sure you want to delete the skill,{' '}
            {clickedModalData.skillName}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="danger"
              onClick={handleDelete}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    variant="light"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

const EditSkills = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addSkillModalOpen, setAddSkillModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clickedModalData, setClickedModalData] = useState(null);

  const [data, setData] = useState({ Items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    if (!clickedModalData) {
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
    }
  }, [clickedModalData]);

  return (
    <StyledMain>
      <h2>Edit Skills</h2>
      <p>Use this page to add, edit an delete skills.</p>
      <Button
        disabled={isLoading}
        css="margin-bottom: 40px"
        onClick={() => {
          setClickedModalData({
            skillName: '',
            skillDescription: '',
            skillId: '',
          });
          setAddSkillModalOpen(true);
        }}
      >
        Add new skill
      </Button>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <StyledSkillsGrid>
            {data.Items.map((skill, index) => {
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
                            onClick={() => {
                              setClickedModalData(data.Items[index]);
                              setEditModalOpen(true);
                            }}
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
                            onClick={() => {
                              setClickedModalData(data.Items[index]);
                              setDeleteModalOpen(true);
                            }}
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

          <SkillModal
            addSkill
            modalOpen={addSkillModalOpen}
            setOpenModal={setAddSkillModalOpen}
            clickedModalData={clickedModalData}
            setClickedModalData={setClickedModalData}
          />

          <SkillModal
            modalOpen={editModalOpen}
            setOpenModal={setEditModalOpen}
            clickedModalData={clickedModalData}
            setClickedModalData={setClickedModalData}
          />

          <DeleteModal
            modalOpen={deleteModalOpen}
            setOpenModal={setDeleteModalOpen}
            clickedModalData={clickedModalData}
            setClickedModalData={setClickedModalData}
          />
        </>
      )}
    </StyledMain>
  );
};

SkillModal.defaultProps = {
  addSkill: false,
  clickedModalData: {
    skillName: '',
    skillDescription: '',
    skillId: '',
  },
};

DeleteModal.defaultProps = {
  clickedModalData: {
    skillName: '',
    skillDescription: '',
    skillId: '',
  },
};

SkillModal.propTypes = {
  addSkill: PropTypes.bool,
  modalOpen: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  clickedModalData: PropTypes.shape({
    skillName: PropTypes.string,
    skillDescription: PropTypes.string,
    skillId: PropTypes.string,
  }),
  setClickedModalData: PropTypes.func.isRequired,
};

DeleteModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  clickedModalData: PropTypes.shape({
    skillName: PropTypes.string,
    skillDescription: PropTypes.string,
    skillId: PropTypes.string,
  }),
  setClickedModalData: PropTypes.func.isRequired,
};

export default EditSkills;
