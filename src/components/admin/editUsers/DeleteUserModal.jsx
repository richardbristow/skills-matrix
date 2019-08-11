import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { AWS } from '../../../awsConfig';
import Loading from '../../../shared/Loading';
import Error from '../../../shared/Error';

const DeleteUserModal = ({
  modalOpen,
  setOpenModal,
  clickedModalData,
  setClickedModalData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const handleCloseModal = () => {
    setOpenModal(false);
    setClickedModalData(null);
  };

  const handleDeleteUser = async ({ Username }) => {
    setIsError(null);
    setIsLoading(true);
    const userPool = new AWS.CognitoIdentityServiceProvider();
    const params = {
      UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      Username,
    };
    try {
      await userPool.adminDeleteUser(params).promise();
      // TODO: also delete the users data in the database
      handleCloseModal();
    } catch (error) {
      setIsError(error);
    }
    setIsLoading(false);
  };

  return (
    <Modal show={modalOpen} onHide={handleCloseModal}>
      {clickedModalData && (
        <>
          <Modal.Header>
            <Modal.Title>Please confirm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isError && <Error error={isError} />}
            <p>
              Are you sure you want to delete the user,{' '}
              <strong>{clickedModalData.name}</strong>?{' '}
            </p>
            <p>
              This will <strong>permanently</strong> delete all the users skill
              ratings and training requests.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="danger"
              onClick={() => handleDeleteUser(clickedModalData)}
            >
              {isLoading ? (
                <Loading button buttonLoadingText="Deleting..." />
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

DeleteUserModal.defaultProps = {
  clickedModalData: {
    Username: '',
    name: '',
  },
};

DeleteUserModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  clickedModalData: PropTypes.shape({
    Username: PropTypes.string,
    name: PropTypes.string,
  }),
  setClickedModalData: PropTypes.func.isRequired,
};

export default DeleteUserModal;
