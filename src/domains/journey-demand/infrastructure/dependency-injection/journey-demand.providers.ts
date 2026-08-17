// -----------------------------------------------------------------------------
// Journey Demand — Dependency Injection Providers
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../../application/journey-demand.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaJourneyDemandRepository } from '../persistence/repositories/prisma-journey-demand.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Journey Demand domain.
 *
 * Infrastructure is responsible for binding application abstractions to their
 * concrete implementations.
 *
 * The application layer depends on the JourneyDemandRepository abstraction;
 * this provider binds that abstraction to the Prisma implementation.
 */
export const JOURNEY_DEMAND_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: JOURNEY_DEMAND_TOKENS.REPOSITORY,
    useClass: PrismaJourneyDemandRepository,
  },
];
