import React from 'react';
import { Tabs, Tab, Accordion, Card, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';

import Info from '../../shared/Info';
import StyledMain from '../../shared/StyledMain';
import useFetch from '../../hooks/useFetch';
import Loading from '../../shared/Loading';
import Error from '../../shared/Error';

const groupBy = (objectArray, property) => {
  return objectArray.reduce((accumulator, currentObject) => {
    const key = currentObject[property];
    if (!accumulator[key]) {
      accumulator[key] = [];
    }
    accumulator[key].push(currentObject);
    return accumulator;
  }, {});
};

const StyledCardBody = styled(Card.Body)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 20px;
`;

const MatrixItem = ({ accordionType, matrixItem }) => (
  <div
    css={css`
      text-align: center;
      border-radius: 5px;
      background-color: ${({ theme }) =>
        theme[`trafficRadio${matrixItem.rating}`]};
      padding: 15px;
      border: 2px solid
        ${({ theme }) => theme[`trafficRadioBorder${matrixItem.rating}`]};
    `}
  >
    <span>{`${
      accordionType !== 'byUser' ? matrixItem.name : matrixItem.skillName
    }`}</span>
  </div>
);

const SkillReviewAccordion = ({ data, accordionType }) => (
  <Accordion defaultActiveKey="0">
    {Object.entries(data).map((review, index) => (
      <Card key={review[0]}>
        <Accordion.Toggle as={Card.Header} eventKey={`${index}`}>
          {review[0]}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={`${index}`}>
          <StyledCardBody>
            {(accordionType === 'byUser' || accordionType === 'bySkill') &&
              review[1].map(matrixItem => (
                <MatrixItem
                  key={`${accordionType}-${matrixItem.itemId}-${matrixItem.skillId}`}
                  accordionType={accordionType}
                  matrixItem={matrixItem}
                />
              ))}

            {accordionType === 'byRating' &&
              Object.entries(groupBy(review[1], 'skillName')).map(skill => (
                <React.Fragment key={skill[0]}>
                  <span css="grid-column: 1/-1">{skill[0]}</span>
                  {skill[1].map(matrixItem => (
                    <MatrixItem
                      key={`${accordionType}-${matrixItem.itemId}-${matrixItem.skillId}`}
                      accordionType={accordionType}
                      matrixItem={matrixItem}
                    />
                  ))}
                </React.Fragment>
              ))}
          </StyledCardBody>
        </Accordion.Collapse>
      </Card>
    ))}
  </Accordion>
);

const SkillReview = () => {
  const [{ data, isLoading, isError }] = useFetch(
    'skillsMatrix',
    '/admin/skills',
    { skillsList: { Items: [] }, skillsReport: { Items: [] } },
  );

  const reformatData = () =>
    data.skillsReport.Items.map(user => ({
      ...data.skillsList.Items.find(skill => skill.skillId === user.skillId),
      ...user,
    }));

  return (
    <StyledMain>
      <h2>Skill Review</h2>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isError ? (
            <Error error={isError} header />
          ) : (
            <>
              {data.skillsList.Items.length === 0 ? (
                <Info heading="The skills matrix is currently empty">
                  <p>
                    Skills can be added to the matrix on the{' '}
                    <Alert.Link to="/editskills" as={Link}>
                      Edit Skills
                    </Alert.Link>{' '}
                    page.
                  </p>
                </Info>
              ) : (
                <>
                  {data.skillsReport.Items.length === 0 ? (
                    <Info heading="No user ratings data to display">
                      <p>
                        There are skills added to skills matrix, but no users
                        have rated their skills yet, please come back later.
                      </p>
                    </Info>
                  ) : (
                    <Tabs defaultActiveKey="bySkill" id="skill-tabs">
                      <Tab eventKey="bySkill" title="By Skill">
                        <SkillReviewAccordion
                          data={groupBy(reformatData(), 'skillName')}
                          accordionType="bySkill"
                        />
                      </Tab>
                      <Tab eventKey="byUser" title="By User">
                        <SkillReviewAccordion
                          data={groupBy(reformatData(), 'name')}
                          accordionType="byUser"
                        />
                      </Tab>
                      <Tab eventKey="byRating" title="By Rating">
                        <SkillReviewAccordion
                          data={groupBy(reformatData(), 'rating')}
                          accordionType="byRating"
                        />
                      </Tab>
                    </Tabs>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </StyledMain>
  );
};

MatrixItem.propTypes = {
  accordionType: PropTypes.string.isRequired,
  matrixItem: PropTypes.shape({
    rating: PropTypes.string,
    name: PropTypes.string,
    skillName: PropTypes.string,
  }).isRequired,
};

SkillReviewAccordion.propTypes = {
  data: PropTypes.objectOf(PropTypes.array).isRequired,
  accordionType: PropTypes.string.isRequired,
};

export default SkillReview;
