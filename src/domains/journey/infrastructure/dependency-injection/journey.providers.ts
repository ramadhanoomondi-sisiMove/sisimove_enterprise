// src/domains/journey/infrastructure/dependency-injection/journey.providers.ts

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../application/journey.tokens';
import { PrismaJourneyRepository } from '../persistence/repositories/prisma-journey.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

export const journeyProviders = [
  {
    provide: JOURNEY_TOKENS.REPOSITORY,
    useClass: PrismaJourneyRepository,
  },
];
