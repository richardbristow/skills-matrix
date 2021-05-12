/* eslint-disable no-console */

const { v1: uuidv1 } = require('uuid');

const buildResponse = require('../utils/buildResponse');
const dynamoDbCall = require('../utils/dynamoDbCall');

const skillsUserGet = async (event) => {
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

const skillsUserAdd = async (event) => {
  const body = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLENAME,
    Item: {
      skillId: uuidv1(),
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

const handlers = {
  GET: skillsUserGet,
  POST: skillsUserAdd,
};

exports.skillsUser = (event) => {
  const { httpMethod } = event;
  return handlers[httpMethod](event);
};
