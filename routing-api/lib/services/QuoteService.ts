import { AlphaRouter, SwapRoute, SwapOptions } from '@uniswap/smart-order-router'
import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { getProvider } from '../util/provider'
import { Quote } from '../models/Quote'

export class QuoteService {
  static async getQuote(params: {
    tokenIn: Token
    tokenOut: Token
    amountInRaw: string
    chainId: number
    slippageToleranceBps?: number
  }): Promise<Quote> {
    const { tokenIn, tokenOut, amountInRaw, chainId } = params
    const provider = getProvider(chainId)

    const router = new AlphaRouter({ chainId, provider })

    const amountIn = CurrencyAmount.fromRawAmount(tokenIn, JSBI.BigInt(amountInRaw))
    const slippage = new Percent(params.slippageToleranceBps ?? 50, 10_000)

    const swapOptions: SwapOptions = {
      recipient: '0x0000000000000000000000000000000000000000',
      slippageTolerance: slippage,
      deadlineOrPreviousBlockhash: Math.floor(Date.now() / 1000) + 60 * 20,
      type: TradeType.EXACT_INPUT,
    }

    const route: SwapRoute | null = await router.route(amountIn, tokenOut, TradeType.EXACT_INPUT, swapOptions)
    if (!route) {
      throw new Error('No route found')
    }

    return {
      amountIn: amountIn.toExact(),
      amountOut: route.quote.toExact(),
      route,
      gasEstimateWei: route.estimatedGasUsed.toString(),
      chainId,
      tradeType: TradeType.EXACT_INPUT,
    }
  }
}
