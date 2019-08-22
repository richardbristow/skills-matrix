import React from 'react';
import { Button, Form, Card, InputGroup } from 'react-bootstrap';
import { Lock } from 'react-feather';
import PropTypes from 'prop-types';

import Error from '../../shared/Error';
import Loading from '../../shared/Loading';

const ChangePasswordForm = ({
  validated,
  handleSubmit,
  handleInputChange,
  checkForEmptyForm,
  isError,
  isLoading,
  values,
}) => (
  <Card.Body>
    <Card.Subtitle style={{ marginBottom: '20px' }}>
      You are required to change your password.
    </Card.Subtitle>
    <Form validated={validated} noValidate onSubmit={handleSubmit}>
      <Form.Group controlId="newPassword">
        <Form.Label>New Password</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>
              <Lock size={16} />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            value={values.newPassword}
            autoFocus
            onChange={handleInputChange}
            name="newPassword"
            type="password"
            placeholder="Enter new password..."
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a new password.
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
      <Form.Group controlId="confirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>
              <Lock size={16} />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            value={values.confirmPassword}
            onChange={handleInputChange}
            name="confirmPassword"
            type="password"
            placeholder="Confirm password..."
            required
          />
          <Form.Control.Feedback type="invalid">
            Please confirm new password.
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
            buttonLoadingText="Changing password..."
          />
        ) : (
          'Change Password'
        )}
      </Button>
    </Form>
  </Card.Body>
);

ChangePasswordForm.defaultProps = {
  isError: null,
};

ChangePasswordForm.propTypes = {
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

export default ChangePasswordForm;
