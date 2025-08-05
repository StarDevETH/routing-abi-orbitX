import { APIGatewayProxyHandler } from 'aws-lambda';
import { AlphaRouter } from '@uniswap/smart-order-router';
import { ChainId, CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core';
import { ethers } from 'ethers';
import { randomUUID } from 'crypto';

// Produces a transaction object for EIP-7702 delegated swaps
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : {};
    const { tokenIn, tokenOut, amount, chainId, from } = body;

    if (!tokenIn || !tokenOut || !amount || !chainId || !from) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'tokenIn, tokenOut, amount, chainId and from are required' }),
      };
    }

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const router = new AlphaRouter({ chainId: chainId as ChainId, provider });

    const inputToken = new Token(chainId, tokenIn, 18);
    const outputToken = new Token(chainId, tokenOut, 18);
    const amountIn = CurrencyAmount.fromRawAmount(inputToken, amount.toString());

    const route = await router.route(
      amountIn,
      outputToken,
      TradeType.EXACT_INPUT,
      {
        recipient: from,
        slippageTolerance: new Percent(5, 100),
        deadline: Math.floor(Date.now() / 1000) + 1800,
      }
    );

    if (!route || !route.methodParameters) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No route found' }),
      };
    }
    const requestId = randomUUID();
    return {
      statusCode: 200,
      body: JSON.stringify({
        requestId,
        swap: {
          to: route.methodParameters.to,
          from,
          data: route.methodParameters.calldata,
          value: route.methodParameters.value,
        },
        gasFee: route.gasPriceWei?.toString(),
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (err as Error).message }),
    };
  }
};
