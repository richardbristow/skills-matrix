import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';

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
      <Form validated={validated} noValidate onSubmit={this.handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            value={email}
            autoFocus
            onChange={this.handleInputChange}
            type="email"
            placeholder="Email address..."
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email address.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={this.handleInputChange}
            type="password"
            placeholder="Password..."
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a password.
          </Form.Control.Feedback>
        </Form.Group>
        <Button disabled={this.checkForEmptyForm()} type="submit">
          Login
        </Button>
      </Form>
    );
  }
}

export default Login;
