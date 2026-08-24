// -----------------------------------------------------------------------------
// Financial Payment Method — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Financial Payment
// Method domain.
//
// The application layer depends on the FinancialPaymentMethodRepository
// contract.
//
// This provider binds that domain repository abstraction to the concrete
// Prisma implementation.
//
// Command and query handlers are intentionally registered separately in the
// FinancialModule.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_METHOD_TOKENS } from '../../application/financial-payment-method.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaFinancialPaymentMethodRepository } from '../persistence/prisma/repositories/prisma-financial-payment-method.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Financial Payment Method domain.
 *
 * Infrastructure is responsible for binding the
 * FinancialPaymentMethodRepository abstraction to its concrete Prisma
 * implementation.
 *
 * The repository remains the infrastructure dependency exposed through the
 * Financial Payment Method application boundary.
 */
export const FINANCIAL_PAYMENT_METHOD_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: FINANCIAL_PAYMENT_METHOD_TOKENS.REPOSITORY,
    useClass: PrismaFinancialPaymentMethodRepository,
  },
];
