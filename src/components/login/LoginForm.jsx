import React from 'react';
import { Button, Form, Card, InputGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { AtSign, Lock } from 'react-feather';

import Error from '../../shared/Error';
import Loading from '../../shared/Loading';

const LoginForm = ({
  validated,
  handleSubmit,
  handleInputChange,
  checkForEmptyForm,
  isError,
  isLoading,
  values,
}) => (
  <Card.Body>
    <Form validated={validated} noValidate onSubmit={handleSubmit}>
      <Form.Group controlId="email">
        <Form.Label>Email address</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>
              <AtSign size={16} />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            value={values.email}
            autoFocus
            onChange={handleInputChange}
            name="email"
            type="email"
            placeholder="Enter email..."
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email address.
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>
              <Lock size={16} />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            value={values.password}
            onChange={handleInputChange}
            name="password"
            type="password"
            placeholder="Password..."
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a password.
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      {isError && <Error error={isError} />}
      <Button
        variant="outline-primary"
        disabled={checkForEmptyForm() || isLoading}
        type="submit"
        block
        css={checkForEmptyForm() ? 'cursor: not-allowed;' : 'undefined'}
      >
        {isLoading ? (
          <Loading
            button
            spinnerVariant="primary"
            buttonLoadingText="Logging in..."
          />
        ) : (
          'Login'
        )}
      </Button>
    </Form>
  </Card.Body>
);

LoginForm.defaultProps = {
  isError: null,
};

LoginForm.propTypes = {
  validated: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  checkForEmptyForm: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  isError: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  values: PropTypes.shape({
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  }).isRequired,
};

export default LoginForm;
