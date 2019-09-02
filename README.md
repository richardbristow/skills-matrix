# Skills-Matrix App

[![Netlify Status](https://api.netlify.com/api/v1/badges/e868eca4-0167-4e05-9539-05dcb0c97539/deploy-status)](https://app.netlify.com/sites/skills-matrix/deploys)

This a serverless skills matrix web application for a small team.

## Installation

### Frontend

Install and start the app:

```shell
  git clone https://github.com/richardbristow/skills-matrix.git
  cd skills-matrix
  yarn
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

### API

The 'api' folder in the root directory contains the lambda functions and serverless YAML file.

The backend can be deployed to either a developemnt or production stage in AWS:

```shell
  cd api
  serverless deploy -v              # development deploy
  serverless deploy --stage prod -v # production deploy
```

To remove the backend stack from AWS:

```shell
  cd api
  serverless remove               # remove development stack
  serverless remove --stage prod  # remove production stack
```

### Environment variables

The front-end accesses the following environment variables in a '.env' file in the root directory.\
The majoroty of the values for these can be obtained from the logs after deploying with serverless.

```env
REACT_APP_COGNITO_IDENTITY_POOL_ID='YOUR_COGNITO_IDENTITY_POOL_ID'
REACT_APP_AWS_REGION='YOUR_AWS_REGION'
REACT_APP_COGNITO_USER_POOL_ID='YOUR_COGNITO_USER_POOL_ID'
REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID='YOUR_COGNITO_WEB_CLIENT_ID'

REACT_APP_DEV_API_URL='YOUR_DEV_API_GATEWAY_URL'
REACT_APP_PROD_API_URL='YOUR_PROD_API_GATEWAY_URL'

REACT_APP_COGNITO_ADMIN_AWS_ACCESS_KEY_ID='YOUR_COGNITO_ADMIN_AWS_ACCESS_KEY_ID'
REACT_APP_COGNITO_ADMIN_AWS_SECRET_KEY='YOUR_COGNITO_ADMIN_AWS_SECRET_KEY'
```

The cognito user pool needs to be setup manually at the moment, with the following required attributes for a user:

* email
* name

The COGNITO_IDENTITY_POOL_ID, COGNITO_USER_POOL_ID, COGNITO_USER_POOL_WEB_CLIENT_ID variables can then be obtained from the AWS console.

The COGNITO_ADMIN access/secret keys refer to an AWS user which will need to be setup manually. This user needs the following permissions to Cognito user pool setup above:

* ListUsersInGroup
* AdminAddUserToGroup
* AdminCreateUser
* AdminDeleteUser

## Other Info

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Create React App [documentation](https://create-react-app.dev/docs/getting-started).
