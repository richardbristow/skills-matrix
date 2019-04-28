import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
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
    this.state = { email: '', password: '', validated: false };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkForEmptyForm = this.checkForEmptyForm.bind(this);
  }

  handleInputChange({ target }) {
    const { id, value } = target;
    this.setState({ [id]: value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        await Auth.signIn(email, password);
        // eslint-disable-next-line no-alert
        alert('Logged in');
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert(err.message);
      }
    }
    this.setState({ validated: true });
  }

  checkForEmptyForm() {
    const { email, password } = this.state;
    return !(email.length > 0 && password.length > 0);
  }

  render() {
    const { email, password, validated } = this.state;
    return (
      <StyledLogin centre>
        <h2>Login</h2>
        <Form validated={validated} noValidate onSubmit={this.handleSubmit}>
          <Form.Group controlId="email">
            <Form.Control
              value={email}
              autoFocus
              onChange={this.handleInputChange}
              type="email"
              placeholder="Email"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Control
              value={password}
              onChange={this.handleInputChange}
              type="password"
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a password.
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            variant="outline-primary"
            disabled={this.checkForEmptyForm()}
            type="submit"
            block
          >
            Login
          </Button>
        </Form>
      </StyledLogin>
    );
  }
}

export default Login;
