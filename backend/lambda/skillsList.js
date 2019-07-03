/* eslint-disable no-console */

const uuid = require('uuid/v1');
const buildResponse = require('../utils/buildResponse');
const dynamoDbCall = require('../utils/dynamoDbCall');

const skillsListGet = async () => {
  const params = {
    TableName: process.env.TABLENAME,
    KeyConditionExpression: 'itemId = :id',
    ExpressionAttributeValues: {
      ':id': 'skill',
    },
  };

  try {
    const dynamoResponse = await dynamoDbCall('query', params);
    console.log(`QUERY: Success getting items from ${process.env.TABLENAME}`);
    console.log('QUERY dynamoResponse', dynamoResponse);
    return buildResponse(200, dynamoResponse);
  } catch (error) {
    throw new Error(error);
  }
};

const skillsListAdd = async event => {
  const body = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLENAME,
    Item: {
      skillId: uuid(),
      ...body,
      lastModified: Date.now(),
      createdAt: Date.now(),
    },
  };

  try {
    await dynamoDbCall('put', params);
    console.log(`PUT: Success adding item to ${process.env.TABLENAME}`);
    console.log('PUT dynamoResponse', params.Item);
    return buildResponse(201, params.Item);
  } catch (error) {
    throw new Error(error);
  }
};

const skillsListEdit = async event => {
  const body = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLENAME,
    Key: { ...event.pathParameters, itemId: body.itemId },
    UpdateExpression:
      'set skillDescription = :description, skillName = :name, lastModified = :modified',
    ExpressionAttributeValues: {
      ':name': body.skillName,
      ':description': body.skillDescription,
      ':modified': Date.now(),
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const dynamoResponse = await dynamoDbCall('update', params);
    console.log(`UPDATE: Success udating item in ${process.env.TABLENAME}`);
    console.log('UPDATE dynamoResponse', dynamoResponse);
    return buildResponse(200, dynamoResponse);
  } catch (error) {
    throw new Error(error);
  }
};

const skillsListDelete = async event => {
  const params = {
    TableName: process.env.TABLENAME,
    IndexName: 'skillId-index',
    KeyConditionExpression: 'skillId = :id',
    ExpressionAttributeValues: {
      ':id': event.pathParameters.skillId,
    },
    ProjectionExpression: 'skillId, itemId',
  };

  try {
    const deleteRequests = [];
    const dynamoQueryResponse = await dynamoDbCall('query', params);
    dynamoQueryResponse.Items.forEach(item => {
      deleteRequests.push({ DeleteRequest: { Key: item } });
    });

    const dynamoResponse = await dynamoDbCall('batchWrite', {
      RequestItems: {
        [process.env.TABLENAME]: deleteRequests,
      },
    });
    console.log(`DELETE: Success deleting item in ${process.env.TABLENAME}`);
    console.log('DELETE dynamoResponse', dynamoResponse);
    return buildResponse(200, dynamoResponse);
  } catch (error) {
    throw new Error(error);
  }
};

const handlers = {
  GET: skillsListGet,
  POST: skillsListAdd,
  PATCH: skillsListEdit,
  DELETE: skillsListDelete,
};

exports.skillsList = event => {
  const { httpMethod } = event;
  return handlers[httpMethod](event);
};
