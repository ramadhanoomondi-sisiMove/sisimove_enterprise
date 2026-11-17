import type { Provider } from '@nestjs/common';

import { FINANCIAL_PAYMENT_C2B_CALLBACK_TOKENS } from '../../application/financial-payment-c2b-callback.tokens';

import { PrismaFinancialPaymentC2BCallbackRepository } from '../persistence/prisma/repositories/prisma-financial-payment-c2b-callback.repository';

// =============================================================================
// Providers
// =============================================================================

export const FINANCIAL_PAYMENT_C2B_CALLBACK_PROVIDERS: Provider[] = [
  {
    provide: FINANCIAL_PAYMENT_C2B_CALLBACK_TOKENS.REPOSITORY,
    useClass: PrismaFinancialPaymentC2BCallbackRepository,
  },
];
