import React, { useState } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
// eslint-disable-next-line no-unused-vars
import styled, { css } from 'styled-components/macro';

import StyledMain from '../../shared/StyledMain';
import useFetch from '../../hooks/useFetch';
import Error from '../../shared/Error';
import Loading from '../../shared/Loading';
import RequestTrainingModal from './RequestTrainingModal';

const Training = () => {
  const reformattedAvailableTraining = [];
  const reformattedAttendingTraining = [];
  const reformattedSkillsList = [];
  const [{ data, isLoading, isError }, setData] = useFetch(
    'skillsMatrix',
    '/user/training',
    { skillsList: { Items: [] }, trainingList: { Items: [] } },
  );
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  data.skillsList.Items.forEach(skill => {
    const trainingSession = data.trainingList.Items.find(
      training => training.skillId === skill.skillId,
    );
    if (trainingSession) {
      const attendingSession = trainingSession.attendees.find(
        // TODO: Remove the hardcoded user-uuid and replace with current user id
        attendee => attendee.userId === 'user-uuid-1',
      );
      if (attendingSession) {
        return reformattedAttendingTraining.push({
          ...trainingSession,
          skillDescription: skill.skillDescription,
          skillName: skill.skillName,
          skillId: skill.skillId,
        });
      }
      return reformattedAvailableTraining.push({
        ...trainingSession,
        skillDescription: skill.skillDescription,
        skillName: skill.skillName,
        skillId: skill.skillId,
      });
    }
    return reformattedSkillsList.push(skill);
  });

  return (
    <StyledMain>
      <h2>Training</h2>
      <p>
        Use this page to request new training, or request attendance to a
        scheduled session.
      </p>
      <Button
        disabled={isLoading}
        css="margin-bottom: 40px"
        onClick={() => setRequestModalOpen(true)}
      >
        Request New Training Session
      </Button>
      {isError ? (
        <Error error={isError} contentWidth header />
      ) : (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div>
                <h5>My Scheduled Training</h5>
                <p>You have requested to attend the below training sessions:</p>
                <ListGroup>
                  {reformattedAttendingTraining.map(training => (
                    <ListGroup.Item
                      action
                      css={css`
                        &:hover {
                          cursor: pointer;
                        }
                      `}
                      key={training.skillId}
                    >
                      {training.skillName}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
              <div css="margin-top: 40px">
                <h5>Other Available Training</h5>
                <p>
                  The below training sessions have been requested by other users
                  and are available for attendance:
                </p>
                <ListGroup>
                  {reformattedAvailableTraining.map(training => (
                    <ListGroup.Item
                      action
                      css={css`
                        &:hover {
                          cursor: pointer;
                        }
                      `}
                      key={training.skillId}
                    >
                      {training.skillName}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>

              {reformattedSkillsList.length >= 1 && (
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
