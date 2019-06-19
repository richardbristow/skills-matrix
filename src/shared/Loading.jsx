import React from 'react';
import { Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

const Loading = ({ button, spinnerVariant, buttonLoadingText }) => (
  <>
    {button ? (
      <>
        <Spinner
          as="span"
          animation="grow"
          variant={spinnerVariant}
          size="sm"
          role="status"
          aria-hidden="true"
        />
        {buttonLoadingText}
      </>
    ) : (
      <div css="text-align: center; margin-top: 40px; opacity: 0.7">
        <Spinner
          css="width: 5rem; height: 5rem;"
          animation="border"
          variant="dark"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
        <h4 css="padding-top: 15px">Loading..</h4>
      </div>
    )}
  </>
);

Loading.defaultProps = {
  button: false,
  buttonLoadingText: '',
  spinnerVariant: 'light',
};

Loading.propTypes = {
  button: PropTypes.bool,
  buttonLoadingText: PropTypes.string,
  spinnerVariant: PropTypes.string,
};

export default Loading;
