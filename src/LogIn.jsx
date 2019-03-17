import React, { Component } from 'react';
// eslint-disable-next-line no-unused-vars
import styled from 'styled-components/macro';

import {
  Button, FormGroup, FormLabel, FormControl,
} from 'react-bootstrap';

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange({ target }) {
    const { id, value } = target;
    this.setState({ [id]: value });
  }

  handleSubmit() {
    const { email, password } = this.state;
    // eslint-disable-next-line no-alert
    alert(`Form has been submitted by ${email} with password ${password}`);
  }

  render() {
    const { email, password } = this.state;
    return (
      <form onSubmit={this.handleSubmit} css="max-width: 400px">
        <FormGroup controlId="email">
          <FormLabel>Email Address</FormLabel>
          <FormControl value={email} autoFocus onChange={this.handleInputChange} type="email" placeholder="Email address..." />
        </FormGroup>
        <FormGroup controlId="password">
          <FormLabel>Password</FormLabel>
          <FormControl value={password} onChange={this.handleInputChange} type="password" placeholder="Password..." />
        </FormGroup>
        <Button variant="primary" type="submit">Login</Button>
      </form>
    );
  }
}

export default LogIn;
