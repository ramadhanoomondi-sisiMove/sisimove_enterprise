// -----------------------------------------------------------------------------
// Financial Account — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Financial Account
// domain.
//
// The application layer depends on the FinancialAccountRepository contract.
// This provider binds that contract to the concrete Prisma implementation.
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

import { FINANCIAL_ACCOUNT_TOKENS } from '../../application/financial-account.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaFinancialAccountRepository } from '../persistence/prisma/repositories/prisma-financial-account.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Financial Account domain.
 *
 * Infrastructure is responsible for binding the FinancialAccountRepository
 * abstraction to its concrete Prisma implementation.
 *
 * The repository remains the only infrastructure dependency exposed through
 * the Financial Account application boundary.
 */
export const FINANCIAL_ACCOUNT_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: FINANCIAL_ACCOUNT_TOKENS.REPOSITORY,
    useClass: PrismaFinancialAccountRepository,
  },
];
