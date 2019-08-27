import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

import StyledMain from '../shared/StyledMain';

const StyledNoPermissions = styled(StyledMain)`
  text-align: center;
`;

const NoPermissions = () => {
  return (
    <StyledNoPermissions>
      <h1>403</h1>
      <p>
        Page exists, but you do not have the relevant permissions to access :(
      </p>
      <p>
        Do you want to go back&nbsp;
        <Link to="/">home</Link>
      </p>
    </StyledNoPermissions>
  );
};

export default NoPermissions;
