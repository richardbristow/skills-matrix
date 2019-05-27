/* eslint-disable no-console */

const DynamoDB = require('aws-sdk/clients/dynamodb');

const docClient = new DynamoDB.DocumentClient({ region: 'us-east-1' });

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const skillsListGet = async () => {
  const params = {
    TableName: process.env.TABLENAME,
  };

  try {
    const dynamoResponse = await docClient
      .scan(params, (error, data) => {
        if (error) {
          return error;
        }
        return data;
      })
      .promise();

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

const skillsListAdd = async event => {
  const body = JSON.parse(event.body);

  const params = {
    TableName: process.env.TABLENAME,
    Item: { ...body },
  };

  console.log('params :', params);

  try {
    const dynamoResponse = await docClient
      .put(params, (error, data) => {
        if (error) {
          return error;
        }
        return data;
      })
      .promise();

    const response = {
      statusCode: 201,
      headers,
      body: JSON.stringify({ ...dynamoResponse }),
    };

    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const skillsListEdit = async event => {
  const body = JSON.parse(event.body);

  const params = {
    TableName: process.env.TABLENAME,
    Key: { ...event.pathParameters },
    UpdateExpression: 'set skillDescription = :description',
    ExpressionAttributeValues: {
      ':description': body.skillDescription,
    },
  };

  try {
    const dynamoResponse = await docClient
      .update(params, (error, data) => {
        if (error) {
          return error;
        }
        return data;
      })
      .promise();

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

const skillsListDelete = async event => {
  const params = {
    TableName: process.env.TABLENAME,
    Key: { ...event.pathParameters },
  };

  console.log('params :', params);
  try {
    const dynamoResponse = await docClient
      .delete(params, (error, data) => {
        if (error) {
          return error;
        }
        return data;
      })
      .promise();

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
