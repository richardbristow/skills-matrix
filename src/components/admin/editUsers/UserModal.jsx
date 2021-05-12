import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';

import { AWS } from '../../../awsConfig';
import Error from '../../../shared/Error';
import Loading from '../../../shared/Loading';

const UserModal = ({
  modalOpen,
  setOpenModal,
  clickedModalData,
  setClickedModalData,
  getUsersInGroup,
  tabKey,
}) => {
  const [values, setValues] = useState(clickedModalData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [validated, setValidated] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { userName, email, group } = values;
    setIsError(null);
    setIsLoading(true);
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setIsLoading(false);
      setValidated(true);
    } else {
      const userPool = new AWS.CognitoIdentityServiceProvider();
      const createUserParams = {
        UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
        Username: email,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: userName },
        ],
      };
      try {
        await userPool.adminCreateUser(createUserParams).promise();
        const addToGroupParams = {
          UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
          GroupName: group,
          Username: email,
        };
        await userPool.adminAddUserToGroup(addToGroupParams).promise();
        getUsersInGroup(tabKey);
        handleCloseModal();
      } catch (error) {
        setIsError(error);
        setValidated(true);
      }
      setIsLoading(false);
    }
  };

  return (
    <Modal show={modalOpen} onHide={handleCloseModal}>
      {values && (
        <>
          <Modal.Header>
            <Modal.Title>Add User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isError && <Error error={isError} />}
            <Form
              validated={validated}
              noValidate
              id="user-form"
              onSubmit={handleSubmit}
            >
              <Form.Group controlId="formUserName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  onChange={handleInputChange}
                  autoFocus
                  name="userName"
                  type="text"
                  required
                  value={values.userName}
                  disabled={isLoading}
                  placeholder="e.g. Joe Bloggs"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide the users name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  onChange={handleInputChange}
                  name="email"
                  type="email"
                  required
                  value={values.email}
                  disabled={isLoading}
                  placeholder="e.g. Joe Bloggs@example.com"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide the users email.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  onChange={handleInputChange}
                  name="group"
                  required
                  value={values.group}
                  disabled={isLoading}
                >
                  <option value="staffUsers">Support Staff</option>
                  <option value="adminUsers">Admin</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit" form="user-form">
              {isLoading ? (
                <Loading button buttonLoadingText="Saving..." />
              ) : (
                'Save User'
              )}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

UserModal.defaultProps = {
  clickedModalData: {
    userName: '',
    email: '',
  },
};

UserModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  clickedModalData: PropTypes.shape({
    userName: PropTypes.string,
    email: PropTypes.string,
  }),
  setClickedModalData: PropTypes.func.isRequired,
  getUsersInGroup: PropTypes.func.isRequired,
  tabKey: PropTypes.string.isRequired,
};

export default UserModal;
