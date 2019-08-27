import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import AuthenticatedUserContext from '../AuthenticatedUserContext';

const Home = () => {
  const authenticatedUser = useContext(AuthenticatedUserContext);

  return (
    <Redirect
      to={{
        pathname: `${
          authenticatedUser.group === 'adminUsers'
            ? '/skillreview'
            : '/myskills'
        }`,
      }}
    />
  );
};

export default Home;
