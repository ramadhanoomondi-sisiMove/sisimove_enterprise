// src/domains/trust/infrastructure/dependency-injection/trust-profile.providers.ts

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

import { TRUST_PROFILE_TOKENS } from '../../application/trust-profile.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Prisma Transaction Context
// -----------------------------------------------------------------------------

import { PrismaTransactionContext } from '../../../../infrastructure/database/prisma/prisma-transaction.context';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import { PrismaTrustProfileRepository } from '../persistence/prisma/repositories/prisma-trust-profile.repository';

// -----------------------------------------------------------------------------
// Repository Provider
// -----------------------------------------------------------------------------

export const trustProfileRepositoryProvider = {
  provide: TRUST_PROFILE_TOKENS.REPOSITORY,

  inject: [PrismaTransactionContext],

  useFactory: (
    transactionContext: PrismaTransactionContext,
  ): PrismaTrustProfileRepository =>
    new PrismaTrustProfileRepository(transactionContext),
};

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

export const trustProfileProviders = [trustProfileRepositoryProvider];
