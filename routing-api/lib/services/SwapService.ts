import { Quote } from '../models/Quote'

export class SwapService {
  static buildSwapTx(quote: Quote) {
    const { methodParameters } = quote.route
    return {
      to: methodParameters.to,
      data: methodParameters.calldata,
      value: methodParameters.value,
      gasLimit: quote.gasEstimateWei,
    }
  }
}
