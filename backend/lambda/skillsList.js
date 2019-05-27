/* eslint-disable no-console */

const uuid = require('uuid/v1');
const buildResponse = require('../utils/buildResponse');
const dynamoDbCall = require('../utils/dynamoDbCall');

const skillsListGet = async () => {
  const params = {
    TableName: process.env.TABLENAME,
  };

  try {
    const dynamoResponse = await dynamoDbCall('scan', params);
    console.log(`SCAN: Success getting ${process.env.TABLENAME}`);
    console.log('SCAN dynamoResponse', dynamoResponse);
    return buildResponse(200, dynamoResponse);
  } catch (error) {
    throw new Error(error);
  }
};

const skillsListAdd = async event => {
  const body = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLENAME,
    Item: { skillId: uuid(), ...body },
  };

  try {
    const dynamoResponse = await dynamoDbCall('put', params);
    console.log(`PUT: Success adding item to ${process.env.TABLENAME}`);
    console.log('PUT dynamoResponse', dynamoResponse);
    return buildResponse(201, dynamoResponse);
  } catch (error) {
    throw new Error(error);
  }
};

const skillsListEdit = async event => {
  const body = JSON.parse(event.body);
  const params = {
    TableName: process.env.TABLENAME,
    Key: { ...event.pathParameters },
    UpdateExpression: 'set skillDescription = :description, skillName = :name',
    ExpressionAttributeValues: {
      ':name': body.skillName,
      ':description': body.skillDescription,
    },
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
    Key: { ...event.pathParameters },
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
  GET: skillsListGet,
  POST: skillsListAdd,
  PATCH: skillsListEdit,
  DELETE: skillsListDelete,
};

exports.skillsList = event => {
  const { httpMethod } = event;
  return handlers[httpMethod](event);
};
