// src/domains/trust/infrastructure/dependency-injection/trust-profile.providers.ts

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

import { TRUST_PROFILE_TOKENS } from '../../application/trust-profile.tokens';

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import { PrismaTrustProfileRepository } from '../persistence/prisma/repositories/prisma-trust-profile.repository';

// -----------------------------------------------------------------------------
// Repository Provider
// -----------------------------------------------------------------------------

export const trustProfileRepositoryProvider = {
  provide: TRUST_PROFILE_TOKENS.REPOSITORY,

  inject: [PrismaService],

  useFactory: (prisma: PrismaService): PrismaTrustProfileRepository =>
    new PrismaTrustProfileRepository(prisma),
};

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

export const trustProfileProviders = [trustProfileRepositoryProvider];
