import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Tabs, Tab, Button } from 'react-bootstrap';
import { Trash2 } from 'react-feather';
import styled from 'styled-components';

import { AWS } from '../../../awsConfig';
import StyledMain from '../../../shared/StyledMain';
import Loading from '../../../shared/Loading';
import Error from '../../../shared/Error';
import UserModal from './UserModal';
import DeleteUserModal from './DeleteUserModal';

const StyledButton = styled.button`
  border: none;
  cursor: pointer;
  &:focus {
    outline: none;
  }
  background-color: transparent;
`;

const UserTable = ({
  groupUsers,
  isLoading,
  isError,
  setClickedModalData,
  setDeleteModalOpen,
}) => (
  <>
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Date Created</th>
          <th>Delete</th>
        </tr>
      </thead>
      {!isError && (
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="4">
                <Loading />
              </td>
            </tr>
          ) : (
            groupUsers.map(user => {
              const { Username, Attributes, UserCreateDate } = user;
              const { Value: name } = Attributes.find(
                attribute => attribute.Name === 'name',
              );
              const { Value: email } = Attributes.find(
                attribute => attribute.Name === 'email',
              );
              return (
                <tr key={Username}>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{new Date(UserCreateDate).toLocaleDateString()}</td>
                  <td>
                    <StyledButton
                      onClick={() => {
                        setClickedModalData({ Username, name });
                        setDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </StyledButton>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      )}
    </Table>
    {isError && <Error error={isError} header />}
  </>
);

const EditUsers = () => {
  const [tabKey, setTabKey] = useState('staffUsers');
  const [groupUsers, setGroupUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [clickedModalData, setClickedModalData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const getUsersInGroup = async group => {
      setIsError(null);
      setIsLoading(true);
      const userPool = new AWS.CognitoIdentityServiceProvider();
      const poolData = {
        GroupName: group,
        UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      };

      try {
        const data = await userPool.listUsersInGroup(poolData).promise();
        setGroupUsers(data.Users);
      } catch (error) {
        setIsError(error);
      }
      setIsLoading(false);
    };
    getUsersInGroup(tabKey);
  }, [tabKey]);

  return (
    <StyledMain>
      <h2>Edit Users</h2>
      <p>Use this page to add, edit and remove users from the application.</p>
      <Button
        onClick={() => {
          setClickedModalData({
            userName: '',
            email: '',
          });
          setUserModalOpen(true);
        }}
      >
        Add User
      </Button>
      <Tabs
        activeKey={tabKey}
        id="user-group-tabs"
        onSelect={key => setTabKey(key)}
      >
        <Tab eventKey="staffUsers" title="Support Staff">
          {tabKey === 'staffUsers' && (
            <UserTable
              groupUsers={groupUsers}
              isLoading={isLoading}
              isError={isError}
              tableName="Support Staff"
              setClickedModalData={setClickedModalData}
              setDeleteModalOpen={setDeleteModalOpen}
            />
          )}
        </Tab>
        <Tab eventKey="adminUsers" title="Admins">
          {tabKey === 'adminUsers' && (
            <UserTable
              groupUsers={groupUsers}
              isLoading={isLoading}
              isError={isError}
              tableName="Admins"
              setClickedModalData={setClickedModalData}
              setDeleteModalOpen={setDeleteModalOpen}
            />
          )}
        </Tab>
      </Tabs>

      <UserModal
        modalOpen={userModalOpen}
        setOpenModal={setUserModalOpen}
        clickedModalData={clickedModalData}
        setClickedModalData={setClickedModalData}
      />

      <DeleteUserModal
        modalOpen={deleteModalOpen}
        setOpenModal={setDeleteModalOpen}
        clickedModalData={clickedModalData}
        setClickedModalData={setClickedModalData}
      />
    </StyledMain>
  );
};

UserTable.defaultProps = {
  isError: null,
};

UserTable.propTypes = {
  groupUsers: PropTypes.arrayOf(
    PropTypes.shape({
      Attributes: PropTypes.array,
      Enabled: PropTypes.bool,
      UserCreateDate: PropTypes.object,
      UserLastModifiedDate: PropTypes.object,
      UserStatus: PropTypes.string,
      Username: PropTypes.string,
    }),
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  isError: PropTypes.object,
  setClickedModalData: PropTypes.func.isRequired,
  setDeleteModalOpen: PropTypes.func.isRequired,
};

export default EditUsers;
