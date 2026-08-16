// src/domains/trust/infrastructure/dependency-injection/trust-badge.providers.ts

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

import { TRUST_BADGE_TOKENS } from '../../application/trust-badge.tokens';

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import { PrismaTrustBadgeRepository } from '../persistence/prisma/repositories/prisma-trust-badge.repository';

// -----------------------------------------------------------------------------
// Repository Provider
// -----------------------------------------------------------------------------

export const trustBadgeRepositoryProvider = {
  provide: TRUST_BADGE_TOKENS.REPOSITORY,

  inject: [PrismaService],

  useFactory: (prisma: PrismaService): PrismaTrustBadgeRepository =>
    new PrismaTrustBadgeRepository(prisma),
};

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

export const trustBadgeProviders = [trustBadgeRepositoryProvider];
