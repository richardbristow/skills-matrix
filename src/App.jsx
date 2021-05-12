import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Auth } from 'aws-amplify';

import Routes from './Routes';
import SideBar from './components/SideBar';
import AuthenticatedUserContext from './AuthenticatedUserContext';

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

  const handleLogout = async ({ history }) => {
    await Auth.signOut();
    setAuthenticated(false);
    setAuthenticatedUser({});
    history.push('/login');
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
            <Routes
              authenticated={authenticated}
              setAuthenticating={setAuthenticating}
              setAuthenticated={setAuthenticated}
            />
          </main>
        </StyledApp>
      </AuthenticatedUserContext.Provider>
    )
  );
};

export default App;
