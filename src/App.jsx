import React from 'react';
import { Switch, Route } from 'react-router-dom';

import TopNavBar from './components/TopNavBar';
import Login from './components/Login';
import NoRoute from './components/NoRoute';

const App = () => (
  <>
    <TopNavBar />
    <Switch>
      <Route path="/login" component={Login} />
      <Route component={NoRoute} />
    </Switch>
  </>
);

export default App;
