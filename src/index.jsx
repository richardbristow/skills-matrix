import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Amplify from 'aws-amplify';
import { ThemeProvider } from 'styled-components/macro';
import * as serviceWorker from './serviceWorker';

import { amplifyConfig } from './awsConfig';
import globalTheme from './globalStyle';
import App from './App';

Amplify.configure(amplifyConfig);

ReactDOM.render(
  <ThemeProvider theme={globalTheme}>
    <Router>
      <App />
    </Router>
  </ThemeProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
