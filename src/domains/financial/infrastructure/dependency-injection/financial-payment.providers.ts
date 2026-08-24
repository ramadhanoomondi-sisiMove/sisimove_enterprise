// -----------------------------------------------------------------------------
// Financial Payment — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Financial Payment
// domain.
//
// The application layer depends on the FinancialPaymentRepository contract.
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

import { FINANCIAL_PAYMENT_TOKENS } from '../../application/financial-payment.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaFinancialPaymentRepository } from '../persistence/prisma/repositories/prisma-financial-payment.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Financial Payment domain.
 *
 * Infrastructure is responsible for binding the FinancialPaymentRepository
 * abstraction to its concrete Prisma implementation.
 *
 * The repository remains the infrastructure dependency exposed through the
 * Financial Payment application boundary.
 */
export const FINANCIAL_PAYMENT_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: FINANCIAL_PAYMENT_TOKENS.REPOSITORY,
    useClass: PrismaFinancialPaymentRepository,
  },
];
