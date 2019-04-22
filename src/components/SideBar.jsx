import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components/macro';

const StyledSideBar = styled.aside`
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  background-color: #394263;

  ul {
    padding: 0;
    margin-top: 20px;
    list-style-type: none;

    li {
      color: #ddd;
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
        cursor: pointer;
      }
    }
  }
`;

const StyledSidebarLink = styled(NavLink)`
  text-decoration: none;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
    color: #ddd;
  }
  padding: 20px 20px 20px 40px;
  display: block;
`;

const SideBar = () => {
  return (
    <StyledSideBar>
      <ul>
        <li>
          <StyledSidebarLink to="/" as={Link}>
            <h3>Skills Test</h3>
          </StyledSidebarLink>
        </li>
        <li>
          <StyledSidebarLink to="/login">Login</StyledSidebarLink>
        </li>
      </ul>
    </StyledSideBar>
  );
};

export default SideBar;
