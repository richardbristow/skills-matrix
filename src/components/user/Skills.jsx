import React from 'react';
import styled from 'styled-components/macro';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Check } from 'react-feather';

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

const TrafficRadioButton = ({ skill, rating, color }) => {
  const { skillId, skillName } = skill;
  return (
    <StyledTrafficRadioButton color={color}>
      <label htmlFor={`${skillId}-${rating}`}>
        <input
          id={`${skillId}-${rating}`}
          type="radio"
          name={`${skillId}-${skillName}`}
          value={rating}
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
  const { skillName, skillDescription } = skill;
  return (
    <Card>
      <Card.Header as="h5">{skillName}</Card.Header>
      <Card.Body>
        {skillDescription}
        <div>
          <TrafficRadioButton skill={skill} rating="good" color="green" />
          <TrafficRadioButton skill={skill} rating="okay" color="orange" />
          <TrafficRadioButton skill={skill} rating="bad" color="red" />
        </div>
      </Card.Body>
    </Card>
  );
};

const Skills = () => {
  const [{ data, isLoading, isError }] = useFetch('skillsList', '/skillslist', {
    Items: [],
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
              {data.Items.length < 1 ? (
                <div>Nothing to see here</div>
              ) : (
                data.Items.map(skill => {
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
