import { APIGatewayProxyHandler } from 'aws-lambda';
import { BigNumber, ethers } from 'ethers';
import { randomUUID } from 'crypto';

const ERC20_ABI = ['function allowance(address owner, address spender) view returns (uint256)'];

interface CheckRequest {
  token: string;
  owner: string;
  spender: string;
  amount: string;
  chainId: number;
}

// Checks if a wallet has sufficient allowance for a token
export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : ({} as CheckRequest);
    const { token, owner, spender, amount, chainId } = body;

    if (!token || !owner || !spender || !amount || !chainId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'token, owner, spender, amount and chainId are required' }),
      };
    }

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(token, ERC20_ABI, provider);
    const allowance: BigNumber = await contract.allowance(owner, spender);
    const approved = allowance.gte(BigNumber.from(amount));
    const requestId = randomUUID();
    return {
      statusCode: 200,
      body: JSON.stringify({
        requestId,
        approval: approved
          ? null
          : {
              to: token,
              data: '0x',
              value: '0',
            },
        cancel: null,
        gasFee: null,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (err as Error).message }),
    };
  }
};
