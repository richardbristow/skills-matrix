/* eslint-disable no-console */

const buildResponse = require('../utils/buildResponse');
const dynamoDbCall = require('../utils/dynamoDbCall');

const getSkillsReport = async () => {
  const skillsListParams = {
    TableName: process.env.TABLENAME,
    KeyConditionExpression: 'itemId = :id',
    ExpressionAttributeValues: {
      ':id': 'skill',
    },
  };

  const skillsReportParams = {
    TableName: process.env.TABLENAME,
    IndexName: 'itemType-index',
    KeyConditionExpression: 'itemType = :id',
    ExpressionAttributeValues: {
      ':id': 'rating',
    },
  };

  try {
    const [skillsList, skillsReport] = await Promise.all([
      dynamoDbCall('query', skillsListParams),
      dynamoDbCall('query', skillsReportParams),
    ]);

    const dynamoResponse = { skillsList, skillsReport };
    console.log(
      `QUERY: Success getting skills report from ${process.env.TABLENAME}`,
    );
    console.log('QUERY dynamoResponse', dynamoResponse);
    return buildResponse(200, dynamoResponse);
  } catch (error) {
    throw new Error(error);
  }
};

const getTrainingReport = async () => {
  const skillsListParams = {
    TableName: process.env.TABLENAME,
    KeyConditionExpression: 'itemId = :id',
    ExpressionAttributeValues: {
      ':id': 'skill',
    },
  };

  const trainingReportParams = {
    TableName: process.env.TABLENAME,
    IndexName: 'itemType-index',
    KeyConditionExpression: 'itemType = :id',
    ExpressionAttributeValues: {
      ':id': 'training',
    },
  };

  try {
    const [skillsList, trainingReport] = await Promise.all([
      dynamoDbCall('query', skillsListParams),
      dynamoDbCall('query', trainingReportParams),
    ]);

    const dynamoResponse = { skillsList, trainingReport };
    console.log(
      `QUERY: Success getting training report from ${process.env.TABLENAME}`,
    );
    console.log('QUERY dynamoResponse', dynamoResponse);
    return buildResponse(200, dynamoResponse);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUserItems = async (event) => {
  const params = {
    TableName: process.env.TABLENAME,
    IndexName: 'userPoolUsername-index',
    KeyConditionExpression: 'userPoolUsername = :id',
    ExpressionAttributeValues: {
      ':id': event.pathParameters.userPoolUsername,
    },
    ProjectionExpression: 'skillId, itemId',
  };

  try {
    const deleteRequests = [];
    const dynamoQueryResponse = await dynamoDbCall('query', params);
    dynamoQueryResponse.Items.forEach((item) => {
      deleteRequests.push({ DeleteRequest: { Key: item } });
    });

    if (deleteRequests.length > 0) {
      const dynamoResponse = await dynamoDbCall('batchWrite', {
        RequestItems: {
          [process.env.TABLENAME]: deleteRequests,
        },
      });
      console.log(`DELETE: Success deleting items in ${process.env.TABLENAME}`);
      console.log('DELETE dynamoResponse', dynamoResponse);
      return buildResponse(200, dynamoResponse);
    }

    console.log('DELETE dynamoResponse', 'No user items to delete');
    return buildResponse(200, { message: 'No user items to delete' });
  } catch (error) {
    throw new Error(error);
  }
};

exports.admin = (event) => {
  const {
    path,
    requestContext: { resourcePath },
  } = event;
  if (path === '/admin/skills') {
    return getSkillsReport();
  }
  if (resourcePath === '/admin/deleteuser/{userPoolUsername}') {
    return deleteUserItems(event);
  }
  return getTrainingReport();
};
