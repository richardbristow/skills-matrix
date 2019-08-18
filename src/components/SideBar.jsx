import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';

const StyledSideBar = styled.aside`
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.sidebarBackground};
`;

const StyledSideBarMenu = styled.ul`
  padding: 0;
  margin-top: 20px;
  list-style-type: none;
`;

const StyledSideBarLink = styled(NavLink)`
  text-decoration: none;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
    color: ${({ theme }) => theme.sidebarText};
  }
  padding: 20px 20px 20px 40px;
  display: block;
`;

const StyledSidebarMenuLink = styled.li`
  color: ${({ theme }) => theme.sidebarText};
  ${({ header, theme }) =>
    !header && `&:hover {background-color: ${theme.sidebarHover};}`}
  .active {
    background-color: ${({ theme }) => theme.sidebarActiveLink};
  }
`;

const SidebarMenuLink = ({ header, text, ...rest }) => (
  <StyledSidebarMenuLink header={header}>
    <StyledSideBarLink
      css={css`
        cursor: ${header ? 'default' : 'pointer'};
      `}
      {...rest}
    >
      {header ? <h3>{text}</h3> : text}
    </StyledSideBarLink>
  </StyledSidebarMenuLink>
);

const SideBar = ({ authenticated, handleLogout, ...props }) => (
  <StyledSideBar>
    <StyledSideBarMenu>
      <SidebarMenuLink header to="/" as={Link} text="Skills Matrix" />
      {authenticated ? (
        <>
          <SidebarMenuLink to="/editskills" text="Edit Skills" />
          <SidebarMenuLink to="/trainingrequests" text="Training Requests" />
          <SidebarMenuLink to="/editusers" text="Edit Users" />
          <SidebarMenuLink
            text="Logout"
            to="#"
            as={Link}
            onClick={() => handleLogout(props)}
          />
        </>
      ) : (
        <SidebarMenuLink to="/login" text="Login" />
      )}
    </StyledSideBarMenu>
  </StyledSideBar>
);

SidebarMenuLink.defaultProps = {
  header: false,
};

SidebarMenuLink.propTypes = {
  header: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

SideBar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default withRouter(SideBar);
