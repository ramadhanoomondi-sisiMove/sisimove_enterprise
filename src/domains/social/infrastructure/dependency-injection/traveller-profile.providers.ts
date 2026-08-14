// src/domains/social/infrastructure/dependency-injection/traveller-profile.providers.ts

import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';

import { PrismaTravellerProfileRepository } from '../persistence/prisma/repositories/prisma-traveller-profile.repository';

import { TRAVELLER_PROFILE_TOKENS } from '../../application/traveller-profile.tokens';

import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

// -----------------------------------------------------------------------------
// Repository Provider
// -----------------------------------------------------------------------------

export const travellerProfileRepositoryProvider = {
  provide: TRAVELLER_PROFILE_TOKENS.REPOSITORY,

  inject: [PrismaService],

  useFactory: (prisma: PrismaService): TravellerProfileRepository =>
    new PrismaTravellerProfileRepository(prisma),
};

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

export const travellerProfileProviders = [travellerProfileRepositoryProvider];
