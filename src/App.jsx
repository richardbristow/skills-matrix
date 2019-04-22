import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components/macro';

import Login from './components/Login';
import NoRoute from './components/NoRoute';
import SideBar from './components/SideBar';

const StyledApp = styled.div`
  display: grid;
  grid-template-areas: 'sidebar main';
  grid-template-columns: 250px 1fr;
  height: 100vh;
`;

const App = () => (
  <StyledApp>
    <SideBar />
    <main>
      <Switch>
        <Route path="/login" component={Login} />
        <Route component={NoRoute} />
      </Switch>
    </main>
  </StyledApp>
);

export default App;
