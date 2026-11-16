// -----------------------------------------------------------------------------
// Financial Payment Callback — Dependency Injection Providers
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

import { FINANCIAL_PAYMENT_CALLBACK_TOKENS } from '../../application/financial-payment-callback.tokens';
import { FINANCIAL_PAYMENT_C2B_CALLBACK_TOKENS } from '../../application/financial-payment-c2b-callback.tokens';

import { PrismaFinancialPaymentCallbackRepository } from '../persistence/prisma/repositories/prisma-financial-payment-callback.repository';
import { PrismaFinancialPaymentC2BCallbackRepository } from '../persistence/prisma/repositories/prisma-financial-payment-c2b-callback.repository';

// =============================================================================
// Providers
// =============================================================================

export const FINANCIAL_PAYMENT_CALLBACK_PROVIDERS: Provider[] = [
  {
    provide: FINANCIAL_PAYMENT_CALLBACK_TOKENS.REPOSITORY,
    useClass: PrismaFinancialPaymentCallbackRepository,
  },
  {
    provide: FINANCIAL_PAYMENT_C2B_CALLBACK_TOKENS.REPOSITORY,
    useClass: PrismaFinancialPaymentC2BCallbackRepository,
  },
];
