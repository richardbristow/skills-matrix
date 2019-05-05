import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components/macro';

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
  cursor: ${({ header }) => (header ? 'default' : 'pointer')};
`;

const StyledSidebarMenuLink = styled.li`
  color: ${({ theme }) => theme.sidebarText};
  ${({ header, theme }) =>
    !header && `&:hover {background-color: ${theme.sidebarHover};}`}
  .active {
    background-color: ${({ theme }) => theme.sidebarActiveLink};
  }
`;

const SidebarMenuLink = props => {
  const { header, text, ...rest } = props;
  return (
    <StyledSidebarMenuLink header={header}>
      <StyledSideBarLink header={`${header}`} {...rest}>
        {header ? <h3>{text}</h3> : text}
      </StyledSideBarLink>
    </StyledSidebarMenuLink>
  );
};

const SideBar = () => {
  return (
    <StyledSideBar>
      <StyledSideBarMenu>
        <SidebarMenuLink header to="/" as={Link} text="Skills Matrix" />
        <SidebarMenuLink to="/login" text="Login" />
      </StyledSideBarMenu>
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

export default SideBar;
