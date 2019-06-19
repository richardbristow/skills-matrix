import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { css } from 'styled-components/macro';

const Error = ({ error, contentWidth, header }) => (
  <div>
    <Alert
      css={css`
        ${contentWidth && 'display: inline-block;'}
      `}
      variant="danger"
    >
      {header && (
        <>
          <Alert.Heading>Something went wrong :(</Alert.Heading>
          <br />
        </>
      )}
      <strong>Error message:</strong> {error.message}
    </Alert>
  </div>
);

Error.defaultProps = {
  contentWidth: false,
  header: false,
};

Error.propTypes = {
  contentWidth: PropTypes.bool,
  header: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
};

export default Error;
