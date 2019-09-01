import React from 'react';
import { css } from 'styled-components/macro';

const SkillRatingKey = () => (
  <div>
    <div
      css={`
        border: 2px solid #dee2e6;
        padding: 10px;
        border-radius: 5px;
      `}
    >
      <h6 css="white-space: nowrap">User rating key:</h6>
      {['Good', 'Ok', 'Bad'].map(rating => (
        <div
          key={rating}
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <div
            css={css`
              background-color: ${({ theme }) =>
                theme[`trafficRadio${rating}`]};
              border: 2px solid
                ${({ theme }) => theme[`trafficRadioBorder${rating}`]};
              height: 20px;
              width: 20px;
              margin-right: 5px;
              border-radius: 5px;
            `}
          />
          <span>= {rating}</span>
        </div>
      ))}
    </div>
  </div>
);

export default SkillRatingKey;
