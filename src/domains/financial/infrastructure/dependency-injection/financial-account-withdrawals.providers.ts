// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Financial Account
// Withdrawal application boundary.
//
// The application layer depends on the FinancialAccountWithdrawalRepository
// abstraction.
//
// This provider binds that abstraction to the concrete Prisma repository.
//
// Command and query handlers are intentionally registered separately in the
// FinancialModule.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../../application/financial-account-withdrawal.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaFinancialAccountWithdrawalRepository } from '../persistence/prisma/repositories/prisma-financial-account-withdrawal.repository';

// =============================================================================
// Providers
// =============================================================================

/**
 * Dependency-injection providers for the Financial Account Withdrawal
 * application boundary.
 *
 * Infrastructure binds the FinancialAccountWithdrawalRepository contract to
 * its concrete Prisma implementation.
 *
 * The application layer therefore remains independent of Prisma and other
 * persistence concerns.
 */
export const FINANCIAL_ACCOUNT_WITHDRAWAL_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.REPOSITORY,
    useClass: PrismaFinancialAccountWithdrawalRepository,
  },
];
