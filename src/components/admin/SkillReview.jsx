import React from 'react';
import { Tabs, Tab, Accordion, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

import StyledMain from '../../shared/StyledMain';
import useFetch from '../../hooks/useFetch';
import Loading from '../../shared/Loading';
import Error from '../../shared/Error';

const SkillReviewAccordion = ({ data, accordionType }) => (
  <Accordion defaultActiveKey="0">
    {Object.entries(data).map((skill, index) => (
      <Card key={skill[0]}>
        <Accordion.Toggle as={Card.Header} eventKey={index}>
          {skill[0]}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={index}>
          <Card.Body>
            {skill[1].map(user => (
              <p key={`${user.itemId}-${user.skillId}`}>{`${
                accordionType === 'bySkill' ? user.name : user.skillName
              } - ${user.rating}`}</p>
            ))}
          </Card.Body>
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
            </Tabs>
          )}
        </>
      )}
    </StyledMain>
  );
};

SkillReviewAccordion.propTypes = {
  data: PropTypes.objectOf(PropTypes.array).isRequired,
  accordionType: PropTypes.string.isRequired,
};

export default SkillReview;
