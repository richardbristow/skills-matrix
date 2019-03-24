import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import styled from 'styled-components/macro';

const StyledLogin = styled.div`
  @media all and (min-width: 480px) {
    max-width: 350px;
    padding-top: 80px;
    margin: 0 auto;
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

  handleSubmit(e) {
    const { email, password } = this.state;
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      // eslint-disable-next-line no-alert
      alert(`Form has been submitted by ${email} with password ${password}`);
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
      <StyledLogin>
        <h2>Login</h2>
        <Form
          className="justify-content-center"
          validated={validated}
          noValidate
          onSubmit={this.handleSubmit}
        >
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
