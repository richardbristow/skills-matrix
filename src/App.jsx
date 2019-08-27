import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Auth } from 'aws-amplify';

import Login from './components/login/Login';
import NoRoute from './components/NoRoute';
import SideBar from './components/SideBar';
import PrivateRoute from './shared/PrivateRoute';
import Home from './components/Home';
import EditSkills from './components/admin/editSkills/EditSkills';
import Skills from './components/user/Skills';
import Training from './components/user/Training';
import AuthenticatedUserContext from './AuthenticatedUserContext';
import EditUsers from './components/admin/editUsers/EditUsers';
import SkillReview from './components/admin/SkillReview';
import TrainingRequests from './components/admin/TrainingRequests';

const StyledApp = styled.div`
  display: grid;
  grid-template-areas: 'sidebar main';
  grid-template-columns: 250px 1fr;
  height: 100vh;
`;

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);
  const [authenticatedUser, setAuthenticatedUser] = useState({});

  const handleLogout = async props => {
    await Auth.signOut();
    setAuthenticated(false);
    setAuthenticatedUser({});
    props.history.push('/login');
  };

  useEffect(() => {
    const getUserSession = async () => {
      try {
        const {
          accessToken: {
            payload: { 'cognito:groups': group },
          },
          idToken: {
            payload: { name },
          },
          idToken: {
            payload: { email },
          },
          accessToken: {
            payload: { username },
          },
        } = await Auth.currentSession();
        setAuthenticatedUser({ name, email, username, group: group[0] });
        setAuthenticated(true);
      } catch (error) {
        if (error !== 'No current user') {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
      setAuthenticating(false);
    };
    getUserSession();
  }, [authenticating]);

  return (
    !authenticating && (
      <AuthenticatedUserContext.Provider value={authenticatedUser}>
        <StyledApp>
          <SideBar authenticated={authenticated} handleLogout={handleLogout} />
          <main>
            <Switch>
              <PrivateRoute
                path="/"
                exact
                authenticated={authenticated}
                component={Home}
              />
              <Route
                path="/login"
                render={props => (
                  <Login
                    setAuthenticating={setAuthenticating}
                    setAuthenticated={setAuthenticated}
                    {...props}
                  />
                )}
              />
              <PrivateRoute
                path="/skills"
                authenticated={authenticated}
                component={Skills}
              />
              <PrivateRoute
                path="/training"
                authenticated={authenticated}
                component={Training}
              />
              <PrivateRoute
                path="/editskills"
                authenticated={authenticated}
                component={EditSkills}
              />
              <PrivateRoute
                path="/skillreview"
                authenticated={authenticated}
                component={SkillReview}
              />
              <PrivateRoute
                path="/trainingrequests"
                authenticated={authenticated}
                component={TrainingRequests}
              />
              <PrivateRoute
                path="/editusers"
                authenticated={authenticated}
                component={EditUsers}
              />
              <Route component={NoRoute} />
            </Switch>
          </main>
        </StyledApp>
      </AuthenticatedUserContext.Provider>
    )
  );
};

export default App;
