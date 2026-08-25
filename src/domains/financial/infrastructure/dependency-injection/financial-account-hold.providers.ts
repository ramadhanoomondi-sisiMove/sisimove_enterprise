// -----------------------------------------------------------------------------
// Financial Account Hold — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Financial Account
// Hold domain.
//
// The application layer depends on the FinancialAccountHoldRepository
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

import { FINANCIAL_ACCOUNT_HOLD_TOKENS } from '../../application/financial-account-hold.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaFinancialAccountHoldRepository } from '../persistence/prisma/repositories/prisma-financial-account-hold.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Financial Account Hold domain.
 *
 * Infrastructure is responsible for binding the
 * FinancialAccountHoldRepository abstraction to its concrete Prisma
 * implementation.
 *
 * The repository remains the infrastructure dependency exposed through the
 * Financial Account Hold application boundary.
 */
export const FINANCIAL_ACCOUNT_HOLD_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: FINANCIAL_ACCOUNT_HOLD_TOKENS.REPOSITORY,
    useClass: PrismaFinancialAccountHoldRepository,
  },
];
