/* eslint-disable no-console */

const uuid = require('uuid/v1');
const buildResponse = require('../utils/buildResponse');
const dynamoDbCall = require('../utils/dynamoDbCall');

const skillsUserGet = async event => {
  const skillsListParams = {
    TableName: process.env.TABLENAME,
    KeyConditionExpression: 'itemId = :id',
    ExpressionAttributeValues: {
      ':id': 'skill',
    },
  };

  const skillsUserParams = {
    TableName: process.env.TABLENAME,
    KeyConditionExpression: 'itemId = :id',
    ExpressionAttributeValues: {
      ':id': `rating#${event.requestContext.identity.cognitoIdentityId}`,
    },
  };

  try {
    const [skillsList, skillsUser] = await Promise.all([
      dynamoDbCall('query', skillsListParams),
      dynamoDbCall('query', skillsUserParams),
    ]);
    const dynamoResponse = { skillsList, skillsUser };
    console.log(
      `QUERY: Success getting user items from ${process.env.TABLENAME}`,
    );
    console.log('QUERY dynamoResponse', dynamoResponse);
    return buildResponse(200, dynamoResponse);
  } catch (error) {
    throw new Error(error);
  }
};

const skillsUserAdd = async event => {
  const body = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLENAME,
    Item: {
      skillId: uuid(),
      itemId: `rating#${event.requestContext.identity.cognitoIdentityId}`,
      ...body,
      lastModified: Date.now(),
      createdAt: Date.now(),
    },
  };

  try {
    await dynamoDbCall('put', params);
    console.log(`PUT: Success adding user item to ${process.env.TABLENAME}`);
    console.log('PUT dynamoResponse', params.Item);
    return buildResponse(201, params.Item);
  } catch (error) {
    throw new Error(error);
  }
};

const skillsUserEdit = async event => {
  const body = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLENAME,
    Key: {
      ...event.pathParameters,
      itemId: `rating#${event.requestContext.identity.cognitoIdentityId}`,
    },
    UpdateExpression: 'set rating = :rating, lastModified = :modified',
    ExpressionAttributeValues: {
      ':rating': body.rating,
      ':modified': Date.now(),
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const dynamoResponse = await dynamoDbCall('update', params);
    console.log(
      `UPDATE: Success udating user item in ${process.env.TABLENAME}`,
    );
    console.log('UPDATE dynamoResponse', dynamoResponse);
    return buildResponse(200, dynamoResponse);
  } catch (error) {
    throw new Error(error);
  }
};

const handlers = {
  GET: skillsUserGet,
  POST: skillsUserAdd,
  PATCH: skillsUserEdit,
  // DELETE: skillsUserDelete,
};

exports.skillsUser = event => {
  const { httpMethod } = event;
  return handlers[httpMethod](event);
};
