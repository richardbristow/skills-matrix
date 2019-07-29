/* eslint-disable no-console */

const buildResponse = require('../utils/buildResponse');
const dynamoDbCall = require('../utils/dynamoDbCall');

const trainingListGet = async event => {
  const skillsListParams = {
    TableName: process.env.TABLENAME,
    KeyConditionExpression: 'itemId = :id',
    ExpressionAttributeValues: {
      ':id': 'skill',
    },
  };

  const trainingListParams = {
    TableName: process.env.TABLENAME,
    KeyConditionExpression: 'itemId = :id',
    ExpressionAttributeValues: {
      ':id': `training#${event.requestContext.identity.cognitoIdentityId}`,
    },
  };

  try {
    const [skillsList, trainingList] = await Promise.all([
      dynamoDbCall('query', skillsListParams),
      dynamoDbCall('query', trainingListParams),
    ]);
    const dynamoResponse = { skillsList, trainingList };
    console.log(
      `QUERY: Success getting training items from ${process.env.TABLENAME}`,
    );
    console.log('QUERY dynamoResponse', dynamoResponse);
    return buildResponse(200, dynamoResponse);
  } catch (error) {
    throw new Error(error);
  }
};

const trainingListAdd = async event => {
  const body = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLENAME,
    Item: {
      itemId: `training#${event.requestContext.identity.cognitoIdentityId}`,
      ...body,
      lastModified: Date.now(),
      createdAt: Date.now(),
    },
  };

  try {
    await dynamoDbCall('put', params);
    console.log(
      `PUT: Success adding training item to ${process.env.TABLENAME}`,
    );
    console.log('PUT dynamoResponse', params.Item);
    return buildResponse(201, params.Item);
  } catch (error) {
    throw new Error(error);
  }
};

const trainingListDelete = async event => {
  const params = {
    TableName: process.env.TABLENAME,
    Key: {
      itemId: `training#${event.requestContext.identity.cognitoIdentityId}`,
      skillId: event.pathParameters.skillId,
    },
  };

  try {
    const dynamoResponse = await dynamoDbCall('delete', params);
    console.log(`DELETE: Success deleting item in ${process.env.TABLENAME}`);
    console.log('DELETE dynamoResponse', dynamoResponse);
    return buildResponse(200, dynamoResponse);
  } catch (error) {
    throw new Error(error);
  }
};

const handlers = {
  GET: trainingListGet,
  POST: trainingListAdd,
  DELETE: trainingListDelete,
};

exports.trainingList = event => {
  const { httpMethod } = event;
  return handlers[httpMethod](event);
};
