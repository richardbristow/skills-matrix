# Skills-Matrix App

| Main |  Develop | Netlify |
| :---: | :---: | :--: |
| [![CI workflow](https://github.com/richardbristow/skills-matrix/actions/workflows/ci-workflow.yml/badge.svg)](https://github.com/richardbristow/skills-matrix/actions/workflows/ci-workflow.yml) | [![CI workflow](https://github.com/richardbristow/skills-matrix/actions/workflows/ci-workflow.yml/badge.svg?branch=develop)](https://github.com/richardbristow/skills-matrix/actions/workflows/ci-workflow.yml) | [![Netlify Status](https://api.netlify.com/api/v1/badges/e868eca4-0167-4e05-9539-05dcb0c97539/deploy-status)](https://app.netlify.com/sites/skills-matrix/deploys) |

This a serverless skills matrix web application for a small team.

## Installation

Clone the repository and install the dependencies:

```shell
  git clone https://github.com/richardbristow/skills-matrix.git
  cd skills-matrix
  yarn
```

### Backend

The 'backend' folder in the root directory contains the lambda functions and serverless YAML file.

The backend can be deployed to either a development or production stage in AWS:

```shell
  cd backend
  serverless deploy -v              # development deploy
  serverless deploy --stage prod -v # production deploy
```

To remove the backend stack from AWS:

```shell
  cd backend
  serverless remove               # remove development stack
  serverless remove --stage prod  # remove production stack
```

### Cognito setup

The Cognito user pool needs to be setup manually at the moment, with the following required attributes for a user:

* email
* name

The following groups also need to be created in the user pool for the two types of user of the application:

* adminUsers
* staffUsers

Users can be created by an admin user within the application itself. However to create the first admin account on initial deployment and add them to the adminUsers group, the below aws-cli commands can be run:

Create admin account (testadmin1@example.com):

```shell
  aws cognito-idp sign-up --region <YOUR_AWS_REGION> \
  --client-id <YOU_COGNITO_CLIENT_ID> \
  --username testadmin1@example.com \
  --password <A_TEMPORARY_PASSWORD> \
  --user-attributes Name="name",Value="Test Admin1" \
    Name="email",Value="testadmin1@example.com"
```

Add the admin account to the admin permissions group:

```shell
  aws cognito-idp admin-add-user-to-group \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username testadmin1@example.com \
  --group-name adminUsers
```

An associated identity pool also needs to be manually created to grant user permissions to the deployed AWS resources. Upon creation of this select Cognito as the authentication provider, and enter your 'User Pool ID' and 'App Client ID'.\
Two new IAM roles then need to be created to be used as the Authenticated and Unauthenticated roles in the identity pool. For the Authenticated role make sure that the "execute-api:Invoke" action is allowed on the API Gateway Resource that was deployed via serverless.

### Environment variables

The front-end accesses the following environment variables in a '.env' file located in the root directory.\
The majority of the values for these can be obtained from the output logs after deploying the backend with serverless.

```env
REACT_APP_COGNITO_IDENTITY_POOL_ID=<YOUR_COGNITO_IDENTITY_POOL_ID>
REACT_APP_AWS_REGION=<YOUR_AWS_REGION>
REACT_APP_COGNITO_USER_POOL_ID=<YOUR_COGNITO_USER_POOL_ID>
REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID=<YOUR_COGNITO_WEB_CLIENT_ID>

REACT_APP_DEV_API_URL=<YOUR_DEV_API_GATEWAY_URL>
REACT_APP_PROD_API_URL=<YOUR_PROD_API_GATEWAY_URL>

REACT_APP_COGNITO_ADMIN_AWS_ACCESS_KEY_ID=<YOUR_COGNITO_ADMIN_AWS_ACCESS_KEY_ID>
REACT_APP_COGNITO_ADMIN_AWS_SECRET_KEY=<YOUR_COGNITO_ADMIN_AWS_SECRET_KEY>
```

The COGNITO_IDENTITY_POOL_ID, COGNITO_USER_POOL_ID, COGNITO_USER_POOL_WEB_CLIENT_ID variables can then be obtained from the AWS console.

The COGNITO_ADMIN access/secret keys refer to an AWS user which will need to be setup manually. This user needs the following permissions to the Cognito user pool setup above:

* ListUsersInGroup
* AdminAddUserToGroup
* AdminCreateUser
* AdminDeleteUser

### Frontend

Start the app:

```shell
  yarn start
```

Run tests:

```shell
  yarn test
```

Lint code:

```shell
  yarn lint     # lint javascript and css
  yarn lint:js  # lint javascript
  yarn lint:css # lint css
```

Build:

```shell
  yarn build      # development build
  yarn build:prod # production build
```

## Demo site

A deployed demo site is available at the link below:

<https://skills-matrix.netlify.app>

## Other Info

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Create React App [documentation](https://create-react-app.dev/docs/getting-started).
