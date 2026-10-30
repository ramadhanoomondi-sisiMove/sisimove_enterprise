// -----------------------------------------------------------------------------
// Financial Payment Provider — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Financial Payment
// Provider domain.
//
// The application layer depends on the FinancialPaymentProviderRepository
// contract.
//
// This provider binds that repository abstraction to the concrete Prisma
// implementation.
//
// Command and query handlers are registered separately in the FinancialModule.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../../application/financial-payment-providers.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaFinancialPaymentProviderRepository } from '../persistence/prisma/repositories/prisma-financial-payment-provider.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Financial Payment Provider domain.
 *
 * Infrastructure binds the FinancialPaymentProviderRepository abstraction
 * to its concrete Prisma implementation.
 *
 * Command and query handlers remain registered separately in the
 * FinancialModule.
 */
export const FINANCIAL_PAYMENT_PROVIDER_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY,
    useClass: PrismaFinancialPaymentProviderRepository,
  },
];
