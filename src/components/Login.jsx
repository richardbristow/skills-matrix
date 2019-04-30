import React, { Component } from 'react';
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

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', validated: false, authError: null };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkForEmptyForm = this.checkForEmptyForm.bind(this);
  }

  handleInputChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value, authError: null });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { email, password } = this.state;
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        await Auth.signIn(email, password);
        // eslint-disable-next-line no-alert
        alert('Logged in');
      } catch (err) {
        this.setState({ authError: err.message });
      }
    }
    this.setState({ validated: true });
  }

  checkForEmptyForm() {
    const { email, password } = this.state;
    return !(email.length > 0 && password.length > 0);
  }

  render() {
    const { email, password, validated, authError } = this.state;
    return (
      <StyledLogin centre>
        <Card>
          <Card.Header as="h3">Login</Card.Header>
          <Card.Body>
            <Form validated={validated} noValidate onSubmit={this.handleSubmit}>
              <Form.Group controlId="email">
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <AtSign size={16} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    value={email}
                    autoFocus
                    onChange={this.handleInputChange}
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email address.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="password">
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <Lock size={16} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    value={password}
                    onChange={this.handleInputChange}
                    name="password"
                    type="password"
                    placeholder="Password"
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
                disabled={this.checkForEmptyForm()}
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
  }
}

export default Login;
