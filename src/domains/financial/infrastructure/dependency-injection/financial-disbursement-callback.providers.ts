// -----------------------------------------------------------------------------
// Financial Disbursement Callback — Dependency Injection Providers
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

import { FINANCIAL_DISBURSEMENT_CALLBACK_TOKENS } from '../../application/financial-disbursement-callback.tokens';

import { PrismaFinancialDisbursementCallbackRepository } from '../../../financial-payment-providers/infrastructure/persistence/prisma/repositories/prisma-financial-disbursement-callback.repository';

// =============================================================================
// Providers
// =============================================================================

export const FINANCIAL_DISBURSEMENT_CALLBACK_PROVIDERS: Provider[] = [
  {
    provide: FINANCIAL_DISBURSEMENT_CALLBACK_TOKENS.REPOSITORY,
    useClass: PrismaFinancialDisbursementCallbackRepository,
  },
];
