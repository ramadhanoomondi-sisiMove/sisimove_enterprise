// -----------------------------------------------------------------------------
// Financial Settlement — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Financial Settlement
// domain.
//
// The application layer depends on the FinancialSettlementRepository
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

import { FINANCIAL_SETTLEMENT_TOKENS } from '../../application/financial-settlement.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaFinancialSettlementRepository } from '../persistence/prisma/repositories/prisma-financial-settlement.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Financial Settlement domain.
 *
 * Infrastructure is responsible for binding the
 * FinancialSettlementRepository abstraction to its concrete Prisma
 * implementation.
 *
 * The repository remains the infrastructure dependency exposed through the
 * Financial Settlement application boundary.
 */
export const FINANCIAL_SETTLEMENT_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: FINANCIAL_SETTLEMENT_TOKENS.REPOSITORY,
    useClass: PrismaFinancialSettlementRepository,
  },
];
