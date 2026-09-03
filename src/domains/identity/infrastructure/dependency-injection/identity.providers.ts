// -----------------------------------------------------------------------------
// Identity — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Identity bounded
// context.
//
// The application layer depends on domain repository contracts.
//
// This provider file binds those repository abstractions to their concrete
// Prisma implementations.
//
// Covered aggregate / relationship boundaries:
//
// - IdentityAggregate
// - VerificationAggregate
// - RoleAggregate
// - PermissionAggregate
// - RolePermissionAggregate
//
// VerificationRequest is owned by VerificationAggregate and therefore does
// not have a separate repository token here.
//
// Command and query handlers are intentionally registered separately in the
// IdentityModule.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import type { Provider } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../../application/identity.tokens';

// -----------------------------------------------------------------------------
// Infrastructure — Prisma Repositories
// -----------------------------------------------------------------------------

import {
  PrismaIdentityRepository,
  PrismaVerificationRepository,
  PrismaRoleRepository,
  PrismaPermissionRepository,
  PrismaRolePermissionRepository,
} from '../persistence/prisma/repositories';

// =============================================================================
// Providers
// =============================================================================

/**
 * Dependency-injection providers for the Identity bounded context.
 *
 * Infrastructure is responsible for binding each domain repository
 * abstraction to its concrete Prisma implementation.
 *
 * The application layer depends only on the repository contracts exposed
 * through IDENTITY_TOKENS.REPOSITORIES.
 */
export const IDENTITY_PROVIDERS: Provider[] = [
  // ===========================================================================
  // Identity
  // ===========================================================================

  {
    provide: IDENTITY_TOKENS.REPOSITORIES.IDENTITY,
    useClass: PrismaIdentityRepository,
  },

  // ===========================================================================
  // Verification
  // ===========================================================================

  {
    provide: IDENTITY_TOKENS.REPOSITORIES.VERIFICATION,
    useClass: PrismaVerificationRepository,
  },

  // ===========================================================================
  // Role
  // ===========================================================================

  {
    provide: IDENTITY_TOKENS.REPOSITORIES.ROLE,
    useClass: PrismaRoleRepository,
  },

  // ===========================================================================
  // Permission
  // ===========================================================================

  {
    provide: IDENTITY_TOKENS.REPOSITORIES.PERMISSION,
    useClass: PrismaPermissionRepository,
  },

  // ===========================================================================
  // Role Permission
  // ===========================================================================

  {
    provide: IDENTITY_TOKENS.REPOSITORIES.ROLE_PERMISSION,
    useClass: PrismaRolePermissionRepository,
  },
];

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default IDENTITY_PROVIDERS;
