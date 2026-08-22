// -----------------------------------------------------------------------------
// Commercial Earning Commission — Dependency Injection Providers
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { COMMERCIAL_EARNING_COMMISSION_TOKENS } from '../../application/commercial-earning-commission.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { CommercialEarningCommissionPrismaRepository } from '../persistence/prisma/repositories/commercial-earning-commission.prisma-repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Commercial Earning Commission
 * domain.
 *
 * Infrastructure is responsible for binding application abstractions to their
 * concrete implementations.
 *
 * The application layer depends on the CommercialEarningCommissionRepository
 * abstraction; this provider binds that abstraction to the Prisma
 * implementation.
 *
 * Command and query handlers are intentionally registered separately.
 */
export const COMMERCIAL_EARNING_COMMISSION_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: COMMERCIAL_EARNING_COMMISSION_TOKENS.REPOSITORY,
    useClass: CommercialEarningCommissionPrismaRepository,
  },
];
