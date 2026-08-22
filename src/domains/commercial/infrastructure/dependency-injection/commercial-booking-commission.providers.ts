// -----------------------------------------------------------------------------
// Commercial Booking Commission — Dependency Injection Providers
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { COMMERCIAL_BOOKING_COMMISSION_TOKENS } from '../../application/commercial-booking-commission.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { CommercialBookingCommissionPrismaRepository } from '../persistence/prisma/repositories/commercial-booking-commission-prisma.repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Commercial Booking Commission
 * domain.
 *
 * Infrastructure is responsible for binding application abstractions to their
 * concrete implementations.
 *
 * The application layer depends on the CommercialBookingCommissionRepository
 * abstraction; this provider binds that abstraction to the Prisma
 * implementation.
 *
 * Command and query handlers are intentionally registered separately.
 */
export const COMMERCIAL_BOOKING_COMMISSION_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: COMMERCIAL_BOOKING_COMMISSION_TOKENS.REPOSITORY,
    useClass: CommercialBookingCommissionPrismaRepository,
  },
];
