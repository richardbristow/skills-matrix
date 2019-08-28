import React from 'react';
import { PropTypes } from 'prop-types';
import { Alert } from 'react-bootstrap';

const Info = ({ heading, children }) => {
  return (
    <Alert variant="info">
      <Alert.Heading>{heading}</Alert.Heading>
      <hr />
      {children}
    </Alert>
  );
};

Info.propTypes = {
  heading: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

export default Info;
