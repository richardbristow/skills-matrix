import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components/macro';
import { LogOut } from 'react-feather';

import AuthenticatedUserContext from '../AuthenticatedUserContext';

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

const SidebarLogout = ({ handleLogout, ...props }) => {
  const authenticatedUser = useContext(AuthenticatedUserContext);
  return (
    <>
      <div css="flex-grow: 1" />
      <div
        css={css`
          background-color: ${({ theme }) => theme.sidebarHover};
        `}
      >
        <h5
          css={css`
            padding: 20px 20px 0px 40px;
            overflow: hidden;
            color: ${({ theme }) => theme.sidebarText};
          `}
        >
          <strong>{authenticatedUser.name}</strong>
        </h5>
        <StyledSideBarLink to="#" as={Link} onClick={() => handleLogout(props)}>
          Logout
          <LogOut css="margin-left: 15px" size={18} />
        </StyledSideBarLink>
      </div>
    </>
  );
};

const SideBar = ({ authenticated, handleLogout, ...props }) => {
  const authenticatedUser = useContext(AuthenticatedUserContext);
  return (
    <StyledSideBar>
      <StyledSideBarMenu>
        <SidebarMenuLink header to="/" as={Link} text="Skills Matrix" />
        {authenticated ? (
          <>
            {authenticatedUser.group === 'adminUsers' ? (
              <>
                <SidebarMenuLink to="/skillreview" text="Skill Review" />
                <SidebarMenuLink to="/editskills" text="Edit Skills" />
                <SidebarMenuLink
                  to="/trainingrequests"
                  text="Training Requests"
                />
                <SidebarMenuLink to="/editusers" text="Edit Users" />
              </>
            ) : (
              <>
                <SidebarMenuLink to="/myskills" text="My Skills" />
                <SidebarMenuLink
                  to="/requesttraining"
                  text="Request Training"
                />
              </>
            )}
          </>
        ) : (
          <SidebarMenuLink to="/login" text="Login" />
        )}
      </StyledSideBarMenu>
      {authenticated && (
        <SidebarLogout handleLogout={handleLogout} {...props} />
      )}
    </StyledSideBar>
  );
};

SidebarMenuLink.defaultProps = {
  header: false,
};

SidebarMenuLink.propTypes = {
  header: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

SidebarLogout.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

SideBar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default withRouter(SideBar);
