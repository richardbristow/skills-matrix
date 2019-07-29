import React, { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { API } from 'aws-amplify';
import PropTypes from 'prop-types';

import Error from '../../shared/Error';
import Loading from '../../shared/Loading';
import AuthenticatedUserContext from '../../AuthenticatedUserContext';

const RequestTrainingModal = ({
  requestModalOpen,
  setRequestModalOpen,
  reformattedSkillsList,
  setData,
}) => {
  const authenticatedUser = useContext(AuthenticatedUserContext);
  const [values, setValues] = useState({
    skillId: reformattedSkillsList[0].skillId,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const handleCloseModal = () => {
    setIsError(null);
    setRequestModalOpen(false);
  };

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setValues({ ...values, [name]: value });
    setIsError(null);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsError(null);
    setIsLoading(true);
    const { skillId } = values;
    const params = {
      body: {
        skillId,
        attendeeName: authenticatedUser.name,
        attendeeEmail: authenticatedUser.email,
      },
    };
    try {
      await API.post('skillsMatrix', '/user/training', params);
      const response = await API.get('skillsMatrix', '/user/training');
      setData(response);
      handleCloseModal();
    } catch (error) {
      setIsError(error);
    }
    setIsLoading(false);
  };

  return (
    <Modal show={requestModalOpen} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Request New Training Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isError && <Error error={isError} />}
        <Form onSubmit={handleSubmit} id="request-training-form">
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Label>
              <strong>Skill:</strong>
            </Form.Label>
            <Form.Control
              as="select"
              autoFocus
              onChange={handleInputChange}
              name="skillId"
              value={values.skillId}
            >
              {reformattedSkillsList.map(skill => (
                <option key={`skill-${skill.skillId}`} value={skill.skillId}>
                  {skill.skillName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
        <i>
          <p>
            If a skill is not available from the dropdown, a training session
            has already been requested.
          </p>
        </i>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button
          disabled={isLoading}
          variant="primary"
          type="submit"
          form="request-training-form"
        >
          {isLoading ? (
            <Loading button buttonLoadingText="Requesting..." />
          ) : (
            'Request'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

RequestTrainingModal.propTypes = {
  requestModalOpen: PropTypes.bool.isRequired,
  setRequestModalOpen: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  reformattedSkillsList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RequestTrainingModal;
