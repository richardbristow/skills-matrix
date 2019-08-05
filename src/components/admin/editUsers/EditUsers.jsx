import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AWS from 'aws-sdk';
import { Table, Tabs, Tab, Button } from 'react-bootstrap';
import { Trash2 } from 'react-feather';

import StyledMain from '../../../shared/StyledMain';
import Loading from '../../../shared/Loading';
import Error from '../../../shared/Error';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.REACT_APP_COGNITO_ADMIN_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_COGNITO_ADMIN_AWS_SECRET_KEY,
});

const UserTable = ({ groupUsers, isLoading, isError }) => (
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
                    <Trash2 size={18} />
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
      <Button>Add User</Button>
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
            />
          )}
        </Tab>
      </Tabs>
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
};

export default EditUsers;
