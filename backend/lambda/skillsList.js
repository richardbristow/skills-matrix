/* eslint-disable no-console */

const DynamoDB = require('aws-sdk/clients/dynamodb');

const docClient = new DynamoDB.DocumentClient({ region: 'us-east-1' });

const params = {
  TableName: process.env.TABLENAME,
};

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

// const skillsTableGet = args =>
//   new Promise((resolve, reject) => {
//     docClient.scan(args, (error, data) => {
//       if (error) {
//         return reject(error);
//       }
//       return resolve(data);
//     });
//   });

const skillsTableGet = args =>
  docClient
    .scan(args, (error, data) => {
      if (error) {
        return error;
      }
      return data;
    })
    .promise();

exports.skillsList = async () => {
  try {
    const dynamoResponse = await skillsTableGet(params);
    console.log('dynamoResponse', dynamoResponse);
    console.log(`Success getting ${process.env.TABLENAME}`);

    const response = {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ...dynamoResponse }),
    };

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
