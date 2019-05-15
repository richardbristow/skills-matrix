import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Auth } from 'aws-amplify';

import Login from './components/Login';
import NoRoute from './components/NoRoute';
import SideBar from './components/SideBar';
import PrivateRoute from './shared/PrivateRoute';
import Home from './components/Home';
import EditSkills from './components/admin/EditSkills';

const StyledApp = styled.div`
  display: grid;
  grid-template-areas: 'sidebar main';
  grid-template-columns: 250px 1fr;
  height: 100vh;
`;

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);

  const handleLogout = async props => {
    await Auth.signOut();
    setAuthenticated(false);
    props.history.push('/login');
  };

  useEffect(() => {
    const getUserSession = async () => {
      try {
        await Auth.currentSession();
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
  }, []);

  return (
    !authenticating && (
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
                <Login setAuthenticated={setAuthenticated} {...props} />
              )}
            />
            <PrivateRoute
              path="/editskills"
              authenticated={authenticated}
              component={EditSkills}
            />
            <Route component={NoRoute} />
          </Switch>
        </main>
      </StyledApp>
    )
  );
};

export default App;
