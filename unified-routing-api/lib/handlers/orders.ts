import { APIGatewayProxyHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';

// Returns a list of orders and pagination cursor
export const handler: APIGatewayProxyHandler = async () => {
  const requestId = randomUUID();
  return {
    statusCode: 200,
    body: JSON.stringify({
      requestId,
      orders: [],
      cursor: null,
    }),
  };
};
