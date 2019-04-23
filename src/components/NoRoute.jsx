import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

import StyledMain from '../shared/StyledMain';

const StyledNoRoute = styled(StyledMain)`
  text-align: center;
`;

const NoRoute = () => {
  return (
    <StyledNoRoute>
      <h1>404</h1>
      <p>Page does not exist.</p>
      <p>
        Do you want to go back&nbsp;
        <Link to="/">home</Link>
      </p>
    </StyledNoRoute>
  );
};

export default NoRoute;
