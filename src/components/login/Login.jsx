import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import styled from 'styled-components/macro';

import StyledMain from '../../shared/StyledMain';
import ChangePasswordForm from './ChangePasswordForm';
import LoginForm from './LoginForm';

const StyledLogin = styled(StyledMain)`
  @media all and (min-width: 480px) {
    max-width: 400px;
  }
`;

const Login = ({ setAuthenticated, setAuthenticating, ...props }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [validated, setValidated] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const { email, password, newPassword, confirmPassword } = values;

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setValues({ ...values, [name]: value });
    setIsError(null);
  };

  const handleSubmit = async (event) => {
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
        const user = await Auth.signIn(email, password);
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          if (changePassword) {
            if (newPassword !== confirmPassword) {
              setIsError({ message: 'Passwords must match.' });
              setIsLoading(false);
              setValidated(true);
            } else {
              await Auth.completeNewPassword(user, newPassword);
              setChangePassword(false);
              setAuthenticated(true);
              setAuthenticating(true);
              props.history.push('/');
            }
          } else {
            setChangePassword(true);
            setIsLoading(false);
          }
        } else {
          setAuthenticated(true);
          setAuthenticating(true);
          props.history.push('/');
        }
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
        <Card.Header as="h3">
          {changePassword ? 'Change Password' : 'Login'}
        </Card.Header>
        {changePassword ? (
          <ChangePasswordForm
            validated={validated}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            checkForEmptyForm={checkForEmptyForm}
            isError={isError}
            isLoading={isLoading}
            values={values}
          />
        ) : (
          <LoginForm
            validated={validated}
            handleSubmit={handleSubmit}
            handleInputChange={handleInputChange}
            checkForEmptyForm={checkForEmptyForm}
            isError={isError}
            isLoading={isLoading}
            values={values}
          />
        )}
      </Card>
    </StyledLogin>
  );
};

Login.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  setAuthenticated: PropTypes.func.isRequired,
  setAuthenticating: PropTypes.func.isRequired,
};

export default Login;
