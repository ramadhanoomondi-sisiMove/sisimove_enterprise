// -----------------------------------------------------------------------------
// Financial Transaction — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Financial Transaction
// domain.
//
// The application layer depends on the FinancialTransactionRepository
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

import { FINANCIAL_TRANSACTION_TOKENS } from '../../application/financial-transaction.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaFinancialTransactionRepository } from '../persistence/prisma/repositories/prisma-financial-transaction.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Financial Transaction domain.
 *
 * Infrastructure is responsible for binding the
 * FinancialTransactionRepository abstraction to its concrete Prisma
 * implementation.
 *
 * The repository remains the infrastructure dependency exposed through the
 * Financial Transaction application boundary.
 */
export const FINANCIAL_TRANSACTION_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: FINANCIAL_TRANSACTION_TOKENS.REPOSITORY,
    useClass: PrismaFinancialTransactionRepository,
  },
];
