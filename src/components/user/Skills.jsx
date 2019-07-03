import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Check } from 'react-feather';
import { API } from 'aws-amplify';

import StyledMain from '../../shared/StyledMain';
import useFetch from '../../hooks/useFetch';
import Loading from '../../shared/Loading';
import Error from '../../shared/Error';

const StyledUserSkillsGrid = styled.div`
  display: grid;
  margin-top: 40px;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  grid-gap: 40px;
`;

const StyledTrafficRadioButton = styled.div`
  display: inline-block;

  label {
    color: ${({ color }) => color};
    margin: 0px;

    input[type='radio'] {
      display: none;
      &:checked ~ span svg {
        opacity: 1;
      }
    }

    span {
      display: inline-block;
      width: 50px;
      height: 50px;
      background-color: ${({ color }) => color};
      border-radius: 50%;
      border: 2px solid grey;
      cursor: pointer;
      text-align: center;
      line-height: 45px;
    }
  }
`;

const TrafficRadioButton = ({
  skill,
  rating,
  color,
  checked,
  handleChange,
}) => {
  const { skillId, skillName } = skill;
  return (
    <StyledTrafficRadioButton color={color}>
      <label htmlFor={`${skillId}#${rating}`}>
        <input
          id={`${skillId}#${rating}`}
          type="radio"
          name={`${skillId}#${skillName}`}
          value={rating}
          checked={checked}
          onChange={handleChange}
        />
        <span>
          <Check
            css="opacity: 0; transition: all .2s ease;"
            size={35}
            color="white"
          />
        </span>
      </label>
    </StyledTrafficRadioButton>
  );
};

const SkillsRatingCard = ({ skill }) => {
  const { skillName, skillDescription, rating } = skill;
  const [checkedRating, setCheckedRating] = useState(rating);

  const handleChange = async ({ target }) => {
    setCheckedRating(target.value);
    const params = {
      body: { rating: target.value, skillId: skill.skillId },
    };
    await API.post('skillsList', `/user/skills`, params);
  };

  return (
    <Card>
      <Card.Header as="h5">{skillName}</Card.Header>
      <Card.Body>
        {skillDescription}
        <div>
          <TrafficRadioButton
            skill={skill}
            rating="good"
            color="green"
            checked={checkedRating === 'good'}
            handleChange={handleChange}
          />
          <TrafficRadioButton
            skill={skill}
            rating="ok"
            color="orange"
            checked={checkedRating === 'ok'}
            handleChange={handleChange}
          />
          <TrafficRadioButton
            skill={skill}
            rating="bad"
            color="red"
            checked={checkedRating === 'bad'}
            handleChange={handleChange}
          />
        </div>
        {skill.lastModified && (
          <span className="text-muted" css="font-size: 12px">
            Last updated: {new Date(skill.lastModified).toLocaleString()}
          </span>
        )}
      </Card.Body>
    </Card>
  );
};

const Skills = () => {
  const [{ data, isLoading, isError }] = useFetch(
    'skillsUser',
    '/user/skills',
    { skillsList: { Items: [] }, skillsUser: { Items: [] } },
  );

  const reformattedData = data.skillsList.Items.map(skill => {
    const userRating = data.skillsUser.Items.find(
      user => user.skillId === skill.skillId,
    );
    return {
      ...userRating,
      skillDescription: skill.skillDescription,
      skillName: skill.skillName,
      skillId: skill.skillId,
    };
  });

  return (
    <StyledMain>
      <h2>My Skills</h2>
      {isError ? (
        <Error error={isError} contentWidth header />
      ) : (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <StyledUserSkillsGrid>
              {reformattedData.length < 1 ? (
                <div>Nothing to see here</div>
              ) : (
                reformattedData.map(skill => {
                  const { skillId } = skill;
                  return <SkillsRatingCard key={skillId} skill={skill} />;
                })
              )}
            </StyledUserSkillsGrid>
          )}
        </>
      )}
    </StyledMain>
  );
};

TrafficRadioButton.propTypes = {
  rating: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  skill: PropTypes.shape({
    createdAt: PropTypes.number,
    lastModified: PropTypes.number,
    skillDescription: PropTypes.string,
    skillId: PropTypes.string,
    skillName: PropTypes.string,
  }).isRequired,
};

SkillsRatingCard.propTypes = {
  skill: PropTypes.shape({
    createdAt: PropTypes.number,
    lastModified: PropTypes.number,
    skillDescription: PropTypes.string,
    skillId: PropTypes.string,
    skillName: PropTypes.string,
  }).isRequired,
};

export default Skills;
