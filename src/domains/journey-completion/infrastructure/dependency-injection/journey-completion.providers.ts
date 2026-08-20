// -----------------------------------------------------------------------------
// Journey Completion — Dependency Injection Providers
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../../application/journey-completion.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaJourneyCompletionRepository } from '../persistence/prisma/repositories/prisma-journey-completion.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Journey Completion domain.
 *
 * Infrastructure is responsible for binding application abstractions to their
 * concrete implementations.
 *
 * The application layer depends on the JourneyCompletionRepository
 * abstraction; this provider binds that abstraction to the Prisma
 * implementation.
 *
 * Command and query handlers are intentionally not registered here.
 * They should be registered through the application's handler composition
 * mechanism once the application module wiring is established.
 */
export const JOURNEY_COMPLETION_PROVIDERS: Provider[] = [
  // ===========================================================================

  // Repository

  // ===========================================================================

  {
    provide: JOURNEY_COMPLETION_TOKENS.REPOSITORY,

    useClass: PrismaJourneyCompletionRepository,
  },
];
