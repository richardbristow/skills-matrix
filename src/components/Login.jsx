import React, { useState } from 'react';
import { Button, Form, Card, InputGroup, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import { AtSign, Lock } from 'react-feather';
import styled from 'styled-components/macro';

import StyledMain from '../shared/StyledMain';
import Error from '../shared/Error';

const StyledLogin = styled(StyledMain)`
  @media all and (min-width: 480px) {
    max-width: 400px;
  }
`;

const Login = ({ setAuthenticated, ...props }) => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = values;

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setValues({ ...values, [name]: value });
    setIsError(null);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setIsError(null);
    setIsLoading(true);
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setIsLoading(false);
      setValidated(true);
    } else {
      try {
        await Auth.signIn(email, password);
        setAuthenticated(true);
        props.history.push('/');
      } catch (err) {
        setIsError(err);
        setIsLoading(false);
        setValidated(true);
      }
    }
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
            {isError && <Error error={isError} />}
            <Button
              variant="outline-primary"
              disabled={checkForEmptyForm() || isLoading}
              type="submit"
              block
              css={checkForEmptyForm() ? 'cursor: not-allowed;' : 'undefined'}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    variant="primary"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </StyledLogin>
  );
};

Login.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  setAuthenticated: PropTypes.func.isRequired,
};

export default Login;
