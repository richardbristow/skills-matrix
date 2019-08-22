import React from 'react';
import { Table } from 'react-bootstrap';

import StyledMain from '../../shared/StyledMain';
import useFetch from '../../hooks/useFetch';
import Loading from '../../shared/Loading';
import Error from '../../shared/Error';

const TrainingRequestTable = ({ data }) =>
  data.map(training =>
    training.trainingSessions.map((requested, index) =>
      index === 0 ? (
        <tr key={`${training.skillId}-${requested.userPoolUsername}`}>
          <td rowSpan={training.trainingSessions.length}>
            {training.skillName}
          </td>
          <td>{requested.attendeeName}</td>
          <td>
            <a href={`mailto:${requested.attendeeEmail}`}>
              {requested.attendeeEmail}
            </a>
          </td>
          <td>{new Date(requested.createdAt).toLocaleDateString()}</td>
        </tr>
      ) : (
        <tr key={`${training.skillId}-${requested.userPoolUsername}`}>
          <td>{requested.attendeeName}</td>
          <td>
            <a href={`mailto:${requested.attendeeEmail}`}>
              {requested.attendeeEmail}
            </a>
          </td>
          <td>{new Date(requested.createdAt).toLocaleDateString()}</td>
        </tr>
      ),
    ),
  );

const TrainingRequests = () => {
  const [{ data, isLoading, isError }] = useFetch(
    'skillsMatrix',
    '/admin/training',
    { skillsList: { Items: [] }, trainingReport: { Items: [] } },
  );

  const reformatData = () => {
    const reformattedTrainingReport = [];
    const reformattedSkillsList = [];

    data.skillsList.Items.forEach(skill => {
      const trainingSessions = data.trainingReport.Items.filter(
        training => training.skillId === skill.skillId,
      );
      if (trainingSessions.length > 0) {
        return reformattedTrainingReport.push({
          trainingSessions,
          skillDescription: skill.skillDescription,
          skillName: skill.skillName,
          skillId: skill.skillId,
        });
      }
      return reformattedSkillsList.push(skill);
    });

    return reformattedTrainingReport;
  };

  const reformattedTrainingReport = reformatData();

  return (
    <StyledMain>
      <h2>Training Requests</h2>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isError ? (
            <Error error={isError} header />
          ) : (
            <>
              {reformattedTrainingReport.length > 0 ? (
                <Table hover>
                  <thead>
                    <tr>
                      <th>Skill</th>
                      <th>Requestor</th>
                      <th>Email</th>
                      <th>Requested on</th>
                    </tr>
                  </thead>
                  <tbody>
                    <TrainingRequestTable data={reformattedTrainingReport} />
                  </tbody>
                </Table>
              ) : (
                <p>No training requests have been made.</p>
              )}
            </>
          )}
        </>
      )}
    </StyledMain>
  );
};

export default TrainingRequests;
