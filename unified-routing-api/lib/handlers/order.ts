import { APIGatewayProxyHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';

// Placeholder handler for submitting a UniswapX order
export const handler: APIGatewayProxyHandler = async () => {
  const requestId = randomUUID();
  const orderId = randomUUID();
  return {
    statusCode: 200,
    body: JSON.stringify({
      requestId,
      orderId,
      orderStatus: 'PENDING',
    }),
  };
};
