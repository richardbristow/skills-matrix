import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

const NoRoute = () => {
  return (
    <div css="text-align: center; padding-top: 60px;">
      <h1>404</h1>
      <p>Page does not exist.</p>
      <p>
        Do you want to go back&nbsp;
        <Link to="/">home</Link>
      </p>
    </div>
  );
};

export default NoRoute;
