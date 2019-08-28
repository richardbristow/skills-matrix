import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Tabs, Tab, Button } from 'react-bootstrap';
import { Trash2 } from 'react-feather';
import styled from 'styled-components/macro';

import { AWS } from '../../../awsConfig';
import StyledMain from '../../../shared/StyledMain';
import Info from '../../../shared/Info';
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
  userType,
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
            <>
              {groupUsers.length > 0 ? (
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
              ) : (
                <tr>
                  <td css="text-align: center" colSpan="4">
                    <Info heading={`No ${userType} users to display`}>
                      Users can be added using the <strong>Add Users</strong>{' '}
                      button above.
                    </Info>
                  </td>
                </tr>
              )}
            </>
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

  useEffect(() => {
    getUsersInGroup(tabKey);
  }, [tabKey]);

  return (
    <StyledMain>
      <h2>Edit Users</h2>
      <p>Use this page to add, edit and remove users from the application.</p>
      <Button
        css="margin-bottom: 40px"
        disabled={isLoading}
        onClick={() => {
          setClickedModalData({
            userName: '',
            email: '',
            group: 'staffUsers',
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
              userType="support staff"
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
              userType="admin"
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
        getUsersInGroup={getUsersInGroup}
        tabKey={tabKey}
      />

      <DeleteUserModal
        modalOpen={deleteModalOpen}
        setOpenModal={setDeleteModalOpen}
        clickedModalData={clickedModalData}
        setClickedModalData={setClickedModalData}
        getUsersInGroup={getUsersInGroup}
        tabKey={tabKey}
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
  userType: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  isError: PropTypes.object,
  setClickedModalData: PropTypes.func.isRequired,
  setDeleteModalOpen: PropTypes.func.isRequired,
};

export default EditUsers;
