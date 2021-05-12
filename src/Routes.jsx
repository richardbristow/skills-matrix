import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import PrivateRoute from './shared/PrivateRoute';
import Home from './components/Home';
import Login from './components/login/Login';
import Skills from './components/user/Skills';
import Training from './components/user/Training';
import EditSkills from './components/admin/editSkills/EditSkills';
import SkillReview from './components/admin/SkillReview';
import TrainingRequests from './components/admin/TrainingRequests';
import EditUsers from './components/admin/editUsers/EditUsers';
import NoPermissions from './components/NoPermissions';
import NoRoute from './components/NoRoute';

const Routes = ({ authenticated, setAuthenticating, setAuthenticated }) => (
  <Switch>
    <PrivateRoute
      path="/"
      exact
      authenticated={authenticated}
      component={Home}
    />
    <Route
      path="/login"
      render={(props) => (
        <Login
          setAuthenticating={setAuthenticating}
          setAuthenticated={setAuthenticated}
          {...props}
        />
      )}
    />
    <PrivateRoute
      path="/myskills"
      authenticated={authenticated}
      component={Skills}
      restrictToGroup="staffUsers"
    />
    <PrivateRoute
      path="/requesttraining"
      authenticated={authenticated}
      component={Training}
      restrictToGroup="staffUsers"
    />
    <PrivateRoute
      path="/editskills"
      authenticated={authenticated}
      component={EditSkills}
      restrictToGroup="adminUsers"
    />
    <PrivateRoute
      path="/skillreview"
      authenticated={authenticated}
      component={SkillReview}
      restrictToGroup="adminUsers"
    />
    <PrivateRoute
      path="/trainingrequests"
      authenticated={authenticated}
      component={TrainingRequests}
      restrictToGroup="adminUsers"
    />
    <PrivateRoute
      path="/editusers"
      authenticated={authenticated}
      component={EditUsers}
      restrictToGroup="adminUsers"
    />
    <Route path="/forbidden" component={NoPermissions} />
    <Route component={NoRoute} />
  </Switch>
);

Routes.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  setAuthenticating: PropTypes.func.isRequired,
  setAuthenticated: PropTypes.func.isRequired,
};

export default Routes;
