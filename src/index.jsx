import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Amplify from 'aws-amplify';
import { ThemeProvider } from 'styled-components/macro';

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
