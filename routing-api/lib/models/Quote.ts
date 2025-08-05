import { TradeType } from '@uniswap/sdk-core'
import { SwapRoute } from '@uniswap/smart-order-router'

export interface Quote {
  amountIn: string
  amountOut: string
  route: SwapRoute
  gasEstimateWei: string
  chainId: number
  tradeType: TradeType
}
