// -----------------------------------------------------------------------------
// Financial Payment Callback — Dependency Injection Providers
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

import { FINANCIAL_PAYMENT_CALLBACK_TOKENS } from '../../application/financial-payment-callback.tokens';

import { PrismaFinancialPaymentCallbackRepository } from '../persistence/prisma/repositories/prisma-financial-payment-callback.repository';

// =============================================================================
// Providers
// =============================================================================

export const FINANCIAL_PAYMENT_CALLBACK_PROVIDERS: Provider[] = [
  {
    provide: FINANCIAL_PAYMENT_CALLBACK_TOKENS.REPOSITORY,
    useClass: PrismaFinancialPaymentCallbackRepository,
  },
];
