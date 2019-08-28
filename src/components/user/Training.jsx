import React, { useState, Fragment } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
// eslint-disable-next-line no-unused-vars
import styled, { css } from 'styled-components/macro';
import { API } from 'aws-amplify';

import StyledMain from '../../shared/StyledMain';
import useFetch from '../../hooks/useFetch';
import Error from '../../shared/Error';
import Loading from '../../shared/Loading';
import RequestTrainingModal from './RequestTrainingModal';

const Training = () => {
  const [{ data, isLoading, isError }, setData] = useFetch(
    'skillsMatrix',
    '/user/training',
    { skillsList: { Items: [] }, trainingList: { Items: [] } },
  );
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [isDeleteError, setIsDeleteError] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleDeleteTraining = async skillId => {
    setIsDeleteError(null);
    setIsDeleteLoading(true);
    try {
      await API.del('skillsMatrix', `/user/training/${skillId}`);
      const response = await API.get('skillsMatrix', '/user/training');
      setData(response);
    } catch (error) {
      setIsDeleteError(error);
    }
    setIsDeleteLoading(false);
  };

  const reformatData = () => {
    const reformattedAttendingTraining = [];
    const reformattedSkillsList = [];

    data.skillsList.Items.forEach(skill => {
      const trainingSession = data.trainingList.Items.find(
        training => training.skillId === skill.skillId,
      );
      if (trainingSession) {
        return reformattedAttendingTraining.push({
          ...trainingSession,
          skillDescription: skill.skillDescription,
          skillName: skill.skillName,
          skillId: skill.skillId,
        });
      }
      return reformattedSkillsList.push(skill);
    });

    return { reformattedAttendingTraining, reformattedSkillsList };
  };

  const {
    reformattedAttendingTraining,
    reformattedSkillsList,
  } = reformatData();

  return (
    <StyledMain>
      <h2>Request Training</h2>
      <p>
        Use this page to request new training, or request attendance to a
        scheduled session.
      </p>
      <Button
        disabled={isLoading || reformattedSkillsList.length === 0}
        css="margin-bottom: 40px"
        onClick={() => setRequestModalOpen(true)}
      >
        Request New Training Session
      </Button>
      {isError ? (
        <Error error={isError} header />
      ) : (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div>
                <h5>My Scheduled Training</h5>
                {reformattedAttendingTraining.length > 0 ? (
                  <p>
                    You have requested to attend the below training sessions:
                  </p>
                ) : (
                  <p>You have not requested any training sessions yet.</p>
                )}
                {isDeleteError && <Error error={isDeleteError} />}
                <ListGroup>
                  {reformattedAttendingTraining.map(training => (
                    <Fragment key={training.skillId}>
                      <ListGroup.Item as="div" action>
                        {training.skillName}
                        <Button
                          disabled={isDeleteLoading}
                          variant="outline-warning"
                          onClick={() => handleDeleteTraining(training.skillId)}
                          css="float: right"
                        >
                          {isDeleteLoading ? (
                            <Loading button buttonLoadingText="Cancelling..." />
                          ) : (
                            'Cancel'
                          )}
                        </Button>
                      </ListGroup.Item>
                    </Fragment>
                  ))}
                </ListGroup>
              </div>

              {reformattedSkillsList.length > 0 && (
                <RequestTrainingModal
                  requestModalOpen={requestModalOpen}
                  setRequestModalOpen={setRequestModalOpen}
                  reformattedSkillsList={reformattedSkillsList}
                  setData={setData}
                />
              )}
            </>
          )}
        </>
      )}
    </StyledMain>
  );
};

export default Training;
