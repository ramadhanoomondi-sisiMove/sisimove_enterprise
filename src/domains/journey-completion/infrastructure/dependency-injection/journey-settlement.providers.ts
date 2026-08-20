// -----------------------------------------------------------------------------
// Journey Settlement — Dependency Injection Providers
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_SETTLEMENT_TOKENS } from '../../application/journey-settlement.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaJourneySettlementRepository } from '../persistence/prisma/repositories/prisma-journey-settlement.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Journey Settlement domain.
 *
 * Infrastructure is responsible for binding application abstractions to their
 * concrete implementations.
 *
 * The application layer depends on the JourneySettlementRepository
 * abstraction; this provider binds that abstraction to the Prisma
 * implementation.
 *
 * Command and query handlers are intentionally not registered here.
 * They should be registered through the application's handler composition
 * mechanism once the application module wiring is established.
 */
export const JOURNEY_SETTLEMENT_PROVIDERS: Provider[] = [
  // ===========================================================================

  // Repository

  // ===========================================================================

  {
    provide: JOURNEY_SETTLEMENT_TOKENS.REPOSITORY,

    useClass: PrismaJourneySettlementRepository,
  },
];