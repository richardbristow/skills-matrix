import React, { useState, useContext } from 'react';
import styled from 'styled-components/macro';
import { Card, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Check } from 'react-feather';
import { API } from 'aws-amplify';

import Info from '../../shared/Info';
import StyledMain from '../../shared/StyledMain';
import useFetch from '../../hooks/useFetch';
import Loading from '../../shared/Loading';
import Error from '../../shared/Error';
import AuthenticatedUserContext from '../../AuthenticatedUserContext';

const StyledUserSkillsGrid = styled.div`
  display: grid;
  margin-top: 40px;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  grid-gap: 40px;
`;

const StyledTrafficRadioButton = styled.div`
  display: inline-block;

  label {
    color: ${({ rating, theme }) => theme[`trafficRadio${rating}`]};
    margin: 0;

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
      background-color: ${({ rating, theme }) =>
        theme[`trafficRadio${rating}`]};
      border-radius: 50%;
      border: 2px solid
        ${({ rating, theme }) => theme[`trafficRadioBorder${rating}`]};
      cursor: pointer;
      text-align: center;
      line-height: 45px;

      &:hover {
        border: 2px solid darkslategrey;
        transition: 0.2s ease;
      }
    }
  }
`;

const TrafficRadioButton = ({ skill, rating, checked, handleChange }) => {
  const { skillId, skillName } = skill;
  return (
    <StyledTrafficRadioButton rating={rating}>
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
              css={`
                opacity: 0;
                transition: all 0.2s ease;
              `}
              size={35}
              color="white"
            />
          </span>
        </label>
      </OverlayTrigger>
    </StyledTrafficRadioButton>
  );
};

const StyledCardBody = styled(Card.Body)`
  position: relative;
  text-align: center;
`;

const StyledCardFooter = styled(Card.Footer)`
  font-size: 12px;
`;

const LoadingOverlay = ({ spinner }) => (
  <div
    css={`
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      border-radius: inherit;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `}
  >
    {spinner && (
      <Spinner
        css="width: 4rem; height: 4rem"
        animation="border"
        variant="light"
        role="status"
      />
    )}
  </div>
);

const SkillsRatingCard = ({ skill, setData }) => {
  const { skillName, skillDescription, rating } = skill;
  const [checkedRating, setCheckedRating] = useState(rating);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const authenticatedUser = useContext(AuthenticatedUserContext);

  const handleChange = async ({ target }) => {
    setCheckedRating(target.value);
    setIsError(null);
    setIsLoading(true);
    const params = {
      body: {
        rating: target.value,
        skillId: skill.skillId,
        userPoolUsername: authenticatedUser.username,
        name: authenticatedUser.name,
        itemType: 'rating',
      },
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
      <StyledCardBody>
        {isLoading && <LoadingOverlay spinner />}
        {isError && <Error error={isError} />}
        {skillDescription}
        <hr />
        <div>
          <h6 css="margin-bottom: 16px">My Rating:</h6>
          <div
            css={`
              padding: 10 0;

              div:not(:last-child) {
                padding-right: 40px;
              }
            `}
          >
            <TrafficRadioButton
              skill={skill}
              rating="Good"
              checked={checkedRating === 'Good'}
              handleChange={handleChange}
            />
            <TrafficRadioButton
              skill={skill}
              rating="Ok"
              checked={checkedRating === 'Ok'}
              handleChange={handleChange}
            />
            <TrafficRadioButton
              skill={skill}
              rating="Bad"
              checked={checkedRating === 'Bad'}
              handleChange={handleChange}
            />
          </div>
        </div>
      </StyledCardBody>
      <div css="position: relative">
        <StyledCardFooter className="text-muted">
          {isLoading && <LoadingOverlay />}
          Last updated:{' '}
          {skill.lastModified
            ? new Date(skill.lastModified).toLocaleString()
            : 'Not yet rated'}
        </StyledCardFooter>
      </div>
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
        <Error error={isError} header />
      ) : (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <p>
                Use this page to rate how comfortable you feel supporting the
                below services.
              </p>
              {reformattedData.length < 1 ? (
                <Info heading="No skills to display">
                  <p>
                    No skills have currently been added to the skills matrix,
                    please come back later
                  </p>
                </Info>
              ) : (
                <StyledUserSkillsGrid>
                  {reformattedData.map(skill => {
                    const { skillId } = skill;
                    return (
                      <SkillsRatingCard
                        key={skillId}
                        skill={skill}
                        setData={setData}
                      />
                    );
                  })}
                </StyledUserSkillsGrid>
              )}
            </>
          )}
        </>
      )}
    </StyledMain>
  );
};

LoadingOverlay.defaultProps = {
  spinner: false,
};

LoadingOverlay.propTypes = {
  spinner: PropTypes.bool,
};

TrafficRadioButton.propTypes = {
  rating: PropTypes.string.isRequired,
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
    rating: PropTypes.string,
  }).isRequired,
  setData: PropTypes.func.isRequired,
};

export default Skills;
