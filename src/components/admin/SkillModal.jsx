import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { API } from 'aws-amplify';

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

SkillModal.defaultProps = {
  addSkill: false,
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

export default SkillModal;
