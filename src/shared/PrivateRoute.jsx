import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import AuthenticatedUserContext from '../AuthenticatedUserContext';

const PrivateRoute = ({
  component: Component,
  authenticated,
  restrictToGroup,
  ...rest
}) => {
  const authenticatedUser = useContext(AuthenticatedUserContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? (
          <>
            {!restrictToGroup || restrictToGroup === authenticatedUser.group ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: '/forbidden',
                  state: { from: props.location },
                }}
              />
            )}
          </>
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

PrivateRoute.defaultProps = {
  restrictToGroup: null,
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  restrictToGroup: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.object, // eslint-disable-line react/require-default-props
};

export default PrivateRoute;
