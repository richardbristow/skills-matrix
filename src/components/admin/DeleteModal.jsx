import React, { useState } from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { API } from 'aws-amplify';

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
            <strong>{clickedModalData.skillName}</strong>?
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

DeleteModal.defaultProps = {
  clickedModalData: {
    skillName: '',
    skillDescription: '',
    skillId: '',
  },
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

export default DeleteModal;
