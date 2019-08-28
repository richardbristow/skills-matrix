import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import PropTypes from 'prop-types';

import StyledMain from '../shared/StyledMain';

const StyledNoPermissions = styled(StyledMain)`
  text-align: center;
`;

const NoPermissions = ({ history }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      history.push('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [history]);

  return (
    <StyledNoPermissions>
      <h1>403</h1>
      <p>
        Page exists, but you do not have the relevant permissions for access.
      </p>
      <p>You will be redirected home in 3 seconds.</p>
    </StyledNoPermissions>
  );
};

NoPermissions.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

export default NoPermissions;
