// -----------------------------------------------------------------------------
// Commercial Commission Rule — Dependency Injection Providers
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { COMMERCIAL_COMMISSION_RULE_TOKENS } from '../../application/commercial-commission-rule.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Repository
// -----------------------------------------------------------------------------

import { CommercialCommissionRulePrismaRepository } from '../persistence/prisma/repositories/commercial-commission-rule.prisma-repository';

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

/**
 * Dependency-injection providers for the Commercial Commission Rule domain.
 *
 * Infrastructure is responsible for binding application abstractions to their
 * concrete implementations.
 *
 * The application layer depends on the CommercialCommissionRuleRepository
 * abstraction; this provider binds that abstraction to the Prisma
 * implementation.
 *
 * Command and query handlers are intentionally registered separately.
 */
export const COMMERCIAL_COMMISSION_RULE_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Repository
  // ===========================================================================

  {
    provide: COMMERCIAL_COMMISSION_RULE_TOKENS.REPOSITORY,
    useClass: CommercialCommissionRulePrismaRepository,
  },
];
