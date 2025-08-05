import { QuoteHandler, QuoteInjector } from './quote';
import { handler as swapHandler } from './swap';
import { handler as swap5792Handler } from './swap_5792';
import { handler as swap7702Handler } from './swap_7702';
import { handler as checkApprovalHandler } from './check_approval';
import { handler as orderHandler } from './order';
import { handler as ordersHandler } from './orders';
import { handler as swapsHandler } from './swaps';
import { handler as swappableTokensHandler } from './swappable_tokens';

const quoteInjectorPromise = new QuoteInjector('quoteInjector').build();
const quoteHandler = new QuoteHandler('quoteHandler', quoteInjectorPromise);

module.exports = {
  quoteHandler: quoteHandler.handler,
  swapHandler,
  swap5792Handler,
  swap7702Handler,
  checkApprovalHandler,
  orderHandler,
  ordersHandler,
  swapsHandler,
  swappableTokensHandler,
};
