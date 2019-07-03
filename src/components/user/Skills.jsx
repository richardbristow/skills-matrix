import React, { useState } from 'react';
import styled, { css } from 'styled-components/macro';
import { Card, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
      <OverlayTrigger placement="bottom" overlay={<Tooltip>{rating}</Tooltip>}>
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
      </OverlayTrigger>
    </StyledTrafficRadioButton>
  );
};

const StyledLoadingOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  text-align: center;
`;

const LoadingOverlay = () => (
  <StyledLoadingOverlay>
    <Spinner
      css="width: 4rem; height: 4rem"
      animation="border"
      variant="light"
      role="status"
    />
  </StyledLoadingOverlay>
);

const SkillsRatingCard = ({ skill, setData }) => {
  const { skillName, skillDescription, rating } = skill;
  const [checkedRating, setCheckedRating] = useState(rating);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const handleChange = async ({ target }) => {
    setCheckedRating(target.value);
    setIsError(null);
    setIsLoading(true);
    const params = {
      body: { rating: target.value, skillId: skill.skillId },
    };
    try {
      await API.post('skillsMatrix', `/user/skills`, params);
      const response = await API.get('skillsMatrix', `/user/skills`);
      setData(response);
    } catch (error) {
      setIsError(error);
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <Card.Header as="h5">
        {isLoading ? (
          <i>
            {skillName} - <span className="text-muted">Updating...</span>
          </i>
        ) : (
          skillName
        )}
      </Card.Header>
      <Card.Body css="position: relative">
        {isLoading && <LoadingOverlay />}
        {isError && <Error error={isError} />}
        {skillDescription}
        <div css="padding: 20px 0px; text-align: center;">
          <h6>My Rating:</h6>
          <div
            css={css`
              padding: 10px 0px;
              div:not(:last-child) {
                padding-right: 30px;
              }
            `}
          >
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
        </div>
      </Card.Body>
      <Card.Footer className="text-muted" css="font-size: 12px">
        Last updated:{' '}
        {skill.lastModified
          ? new Date(skill.lastModified).toLocaleString()
          : 'Not yet rated'}
      </Card.Footer>
    </Card>
  );
};

const Skills = () => {
  const [{ data, isLoading, isError }, setData] = useFetch(
    'skillsMatrix',
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
            <>
              <p>
                Use this page to rate how comfortable you feel supporting the
                below services:
              </p>
              <StyledUserSkillsGrid>
                {reformattedData.length < 1 ? (
                  <div>Nothing to see here</div>
                ) : (
                  reformattedData.map(skill => {
                    const { skillId } = skill;
                    return (
                      <SkillsRatingCard
                        key={skillId}
                        skill={skill}
                        setData={setData}
                      />
                    );
                  })
                )}
              </StyledUserSkillsGrid>
            </>
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
  checked: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
};

SkillsRatingCard.propTypes = {
  skill: PropTypes.shape({
    createdAt: PropTypes.number,
    lastModified: PropTypes.number,
    skillDescription: PropTypes.string,
    skillId: PropTypes.string,
    skillName: PropTypes.string,
  }).isRequired,
  setData: PropTypes.func.isRequired,
};

export default Skills;
