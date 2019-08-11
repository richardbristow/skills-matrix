import AWS from 'aws-sdk';

const amplifyConfig = {
  Auth: {
    mandatorySignIn: true,
    identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID,
  },
  API: {
    endpoints: [
      {
        name: 'skillsMatrix',
        endpoint: process.env.REACT_APP_API_URL,
        region: process.env.REACT_APP_AWS_REGION,
      },
    ],
  },
};

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.REACT_APP_COGNITO_ADMIN_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_COGNITO_ADMIN_AWS_SECRET_KEY,
});

export { amplifyConfig, AWS };
