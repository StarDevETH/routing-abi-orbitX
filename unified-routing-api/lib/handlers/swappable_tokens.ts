import { APIGatewayProxyHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';

// Returns the set of tokens supported for swapping
export const handler: APIGatewayProxyHandler = async () => {
  const requestId = randomUUID();
  return {
    statusCode: 200,
    body: JSON.stringify({
      requestId,
      tokens: [],
    }),
  };
};
