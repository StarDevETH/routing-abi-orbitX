import { ChainId } from '@uniswap/sdk-core'

// This is not being used in production today anyway, due to below filterExpiredCachedRoutes method not really filtering on the blocks-to-live
// heuristic is initially within 30 seconds we find a route. (but we are changing to every 1 min now)
// For the Ratio we are approximating Phi (Golden Ratio) by creating a fraction with 2 consecutive Fibonacci numbers

// changing to this way with ChainId enum as key indexing, so that we wont forgot to add new chain tuned blocks-to-live
// those are only gonna be enabled with DynamoRouteCachingProvider.newCachedRoutesRolloutPercent anyway
export const DEFAULT_BLOCKS_TO_LIVE_ROUTES_DB: Partial<Record<ChainId, number>> = {
  // (1 minute) / (12 seconds) = 5
  [ChainId.MAINNET]: 5,
}
