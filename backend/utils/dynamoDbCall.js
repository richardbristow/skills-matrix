const DynamoDB = require('aws-sdk/clients/dynamodb');

const docClient = new DynamoDB.DocumentClient({ region: 'us-east-1' });

const dynamoDbCall = (action, params) =>
  docClient[action](params, (error, data) => {
    if (error) {
      return error;
    }
    return data;
  }).promise();

module.exports = dynamoDbCall;
