// -----------------------------------------------------------------------------
// Financial Disbursement — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Financial Disbursement
// domain.
//
// The application layer depends on the FinancialDisbursementRepository
// contract.
//
// This provider binds that domain repository abstraction to the concrete
// Prisma implementation.
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

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../../application/financial-disbursement.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaFinancialDisbursementRepository } from '../persistence/prisma/repositories/prisma-financial-disbursement.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Financial Disbursement domain.
 *
 * Infrastructure is responsible for binding the
 * FinancialDisbursementRepository abstraction to its concrete Prisma
 * implementation.
 *
 * The repository remains the infrastructure dependency exposed through the
 * Financial Disbursement application boundary.
 */
export const FINANCIAL_DISBURSEMENT_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: FINANCIAL_DISBURSEMENT_TOKENS.REPOSITORY,
    useClass: PrismaFinancialDisbursementRepository,
  },
];
