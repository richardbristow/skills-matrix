import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

const StyledBrandLink = styled(Link)`
  text-decoration: none;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
    color: #fff;
  }
  color: #fff;
`;

const TopNavBar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>
          <StyledBrandLink to="/">Skills Matrix</StyledBrandLink>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default TopNavBar;
