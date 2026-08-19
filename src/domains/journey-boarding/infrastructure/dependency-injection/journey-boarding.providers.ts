// src/domains/journey-boarding/infrastructure/dependency-injection/journey-boarding.providers.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Dependency Injection Providers
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOARDING_TOKENS } from '../../application/journey-boarding.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaJourneyBoardingRepository } from '../persistence/prisma/repositories/prisma-journey-boarding.repository';
// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Journey Boarding domain.
 *
 * Infrastructure is responsible for binding application abstractions to their
 * concrete implementations.
 *
 * The application layer depends on the JourneyBoardingRepository abstraction;
 * this provider binds that abstraction to the Prisma implementation.
 *
 * Command and query handlers are intentionally not registered here yet.
 * They should be added once their concrete implementations are generated.
 */
export const JOURNEY_BOARDING_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: JOURNEY_BOARDING_TOKENS.REPOSITORY,
    useClass: PrismaJourneyBoardingRepository,
  },
];
