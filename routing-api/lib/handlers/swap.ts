import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { Token } from '@uniswap/sdk-core'
import { QuoteService } from '../services/QuoteService'
import { SwapService } from '../services/SwapService'

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    if (!event.body) {
      throw new Error('Request body required')
    }

    const body = JSON.parse(event.body)
    const { tokenInAddress, tokenInDecimals, tokenOutAddress, tokenOutDecimals, amountIn, chainId } = body

    const tokenIn = new Token(chainId, tokenInAddress, tokenInDecimals)
    const tokenOut = new Token(chainId, tokenOutAddress, tokenOutDecimals)

    const quote = await QuoteService.getQuote({
      tokenIn,
      tokenOut,
      amountInRaw: amountIn,
      chainId,
      slippageToleranceBps: body.slippageToleranceBps,
    })

    const swapTx = SwapService.buildSwapTx(quote)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quote, transaction: swapTx }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (err as Error).message }),
    }
  }
}
