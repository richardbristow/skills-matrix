import React, { useState } from 'react';
import { Button, Form, Card, Alert, InputGroup } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import { AtSign, Lock } from 'react-feather';
import styled from 'styled-components/macro';

import StyledMain from '../shared/StyledMain';

const StyledLogin = styled(StyledMain)`
  @media all and (min-width: 480px) {
    max-width: 400px;
  }
`;

const Login = () => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [authError, setAuthError] = useState(null);
  const { email, password } = values;

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setValues({ ...values, [name]: value });
    setAuthError(null);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        await Auth.signIn(email, password);
        // eslint-disable-next-line no-alert
        alert('Logged in');
      } catch (err) {
        setAuthError(err.message);
      }
    }
    setValidated(true);
  };

  const checkForEmptyForm = () => {
    return !(email.length > 0 && password.length > 0);
  };

  return (
    <StyledLogin centre>
      <Card>
        <Card.Header as="h3">Login</Card.Header>
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
                  value={email}
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
                  value={password}
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
            {authError && (
              <Alert variant="danger">
                <strong>Error:</strong> {authError}
              </Alert>
            )}
            <Button
              variant="outline-primary"
              disabled={checkForEmptyForm()}
              type="submit"
              block
            >
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </StyledLogin>
  );
};

export default Login;
