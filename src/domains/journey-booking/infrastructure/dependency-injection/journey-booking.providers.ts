// src/domains/journey-booking/infrastructure/dependency-injection/journey-booking.providers.ts

// -----------------------------------------------------------------------------
// Journey Booking — Dependency Injection Providers
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOOKING_TOKENS } from '../../application/journey-booking.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { PrismaJourneyBookingRepository } from '../persistence/prisma/repositories/prisma-journey-booking.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Journey Booking domain.
 *
 * Infrastructure is responsible for binding application abstractions to their
 * concrete implementations.
 *
 * The application layer depends on the JourneyBookingRepository abstraction;
 * this provider binds that abstraction to the Prisma implementation.
 */
export const JOURNEY_BOOKING_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: JOURNEY_BOOKING_TOKENS.REPOSITORY,
    useClass: PrismaJourneyBookingRepository,
  },
];
