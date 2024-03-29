import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { API } from 'aws-amplify';

import Error from '../../../shared/Error';
import Loading from '../../../shared/Loading';

const DeleteSkillModal = ({
  modalOpen,
  setOpenModal,
  clickedModalData,
  setClickedModalData,
  setData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const handleCloseModal = () => {
    setOpenModal(false);
    setClickedModalData(null);
  };

  const handleDelete = async () => {
    setIsError(null);
    setIsLoading(true);
    try {
      await API.del('skillsMatrix', `/skillslist/${clickedModalData.skillId}`);
      const response = await API.get('skillsMatrix', '/skillslist');
      setData(response);
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
              Are you sure you want to delete the skill,{' '}
              <strong>{clickedModalData.skillName}</strong>?{' '}
            </p>
            <p>
              This will <strong>permanently</strong> delete all related user
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
              onClick={handleDelete}
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

DeleteSkillModal.defaultProps = {
  clickedModalData: {
    skillName: '',
    skillDescription: '',
    skillId: '',
  },
};

DeleteSkillModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  clickedModalData: PropTypes.shape({
    skillName: PropTypes.string,
    skillDescription: PropTypes.string,
    skillId: PropTypes.string,
  }),
  setClickedModalData: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
};

export default DeleteSkillModal;
