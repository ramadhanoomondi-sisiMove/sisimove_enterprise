// src/domains/social/infrastructure/dependency-injection/traveller-profile.providers.ts

// -----------------------------------------------------------------------------
// Infrastructure — Prisma Transaction Context
// -----------------------------------------------------------------------------

import { PrismaTransactionContext } from '../../../../infrastructure/database/prisma/prisma-transaction.context';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaTravellerProfileRepository } from '../persistence/prisma/repositories/prisma-traveller-profile.repository';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { TRAVELLER_PROFILE_TOKENS } from '../../application/traveller-profile.tokens';

// -----------------------------------------------------------------------------
// Domain — Repository Contract
// -----------------------------------------------------------------------------

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

// =============================================================================
// Repository Provider
// =============================================================================

/**
 * Binds the TravellerProfile repository contract to its Prisma
 * infrastructure implementation.
 *
 * The repository receives PrismaTransactionContext rather than PrismaService.
 *
 * This is required so the repository participates in the application's
 * UnitOfWork transaction:
 *
 *     UnitOfWork
 *          │
 *          ▼
 *     Prisma $transaction()
 *          │
 *          ▼
 *     PrismaTransactionContext
 *          │
 *          ├── transaction active → Prisma.TransactionClient
 *          │
 *          └── no transaction    → PrismaService
 *
 * The repository therefore does not own transaction boundaries.
 */
export const travellerProfileRepositoryProvider = {
  provide: TRAVELLER_PROFILE_TOKENS.REPOSITORY,

  inject: [PrismaTransactionContext],

  useFactory: (
    transactionContext: PrismaTransactionContext,
  ): TravellerProfileRepository =>
    new PrismaTravellerProfileRepository(transactionContext),
};

// =============================================================================
// Providers
// =============================================================================

export const travellerProfileProviders = [travellerProfileRepositoryProvider];
