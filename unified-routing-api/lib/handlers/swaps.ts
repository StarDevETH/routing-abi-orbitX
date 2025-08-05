import { APIGatewayProxyHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';

// Returns a list of historical swaps
export const handler: APIGatewayProxyHandler = async () => {
  const requestId = randomUUID();
  return {
    statusCode: 200,
    body: JSON.stringify({
      requestId,
      swaps: [],
    }),
  };
};
