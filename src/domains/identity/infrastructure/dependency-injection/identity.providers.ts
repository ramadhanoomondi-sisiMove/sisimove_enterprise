// -----------------------------------------------------------------------------
// Identity — Dependency Injection Providers
// -----------------------------------------------------------------------------
//
// Infrastructure dependency-injection providers for the Identity bounded
// context.
//
// The application layer depends on domain repository contracts and
// application-service contracts.
//
// This provider file binds:
//
// - repository abstractions → concrete Prisma implementations;
// - application-service abstractions → concrete application services.
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
// IMPORTANT — TRANSACTION BOUNDARY
// -----------------------------------------------------------------------------
//
// The concrete Prisma repositories resolve Prisma access through
// PrismaTransactionContext.
//
// Therefore these providers intentionally use `useClass` rather than creating
// repositories manually with PrismaService.
//
// When a UnitOfWork transaction is active:
//
//     PrismaTransactionContext
//              │
//              ▼
//     Prisma.TransactionClient
//
// When no transaction is active:
//
//     PrismaTransactionContext
//              │
//              ▼
//     PrismaService
//
// This keeps the transaction boundary owned by the infrastructure UnitOfWork
// rather than by individual repositories.
//
// Application services remain transaction-aware through the repositories they
// consume. They do not depend directly on PrismaTransactionContext.
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
// Application — Services
// -----------------------------------------------------------------------------

import { AuthorizationSnapshotServiceImpl } from '../../application/services/authorization-snapshot.service';

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
 * Infrastructure is responsible for binding:
 *
 *     application/domain abstraction
 *              ↓
 *     concrete infrastructure implementation
 *
 * Repository bindings:
 *
 *     IDENTITY_TOKENS.REPOSITORIES.IDENTITY
 *         → PrismaIdentityRepository
 *
 *     IDENTITY_TOKENS.REPOSITORIES.VERIFICATION
 *         → PrismaVerificationRepository
 *
 *     IDENTITY_TOKENS.REPOSITORIES.ROLE
 *         → PrismaRoleRepository
 *
 *     IDENTITY_TOKENS.REPOSITORIES.PERMISSION
 *         → PrismaPermissionRepository
 *
 *     IDENTITY_TOKENS.REPOSITORIES.ROLE_PERMISSION
 *         → PrismaRolePermissionRepository
 *
 * Application-service bindings:
 *
 *     IDENTITY_TOKENS.APPLICATION_SERVICES.AUTHORIZATION_SNAPSHOT
 *         → AuthorizationSnapshotServiceImpl
 *
 * The AuthorizationSnapshotService receives repository contracts through
 * dependency injection. It therefore remains independent of Prisma and can
 * participate in an active UnitOfWork through the repository implementations.
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

  // ===========================================================================
  // Application Services
  // ===========================================================================

  /**
   * Resolves the current authorization snapshot for an Identity.
   *
   * The service composes:
   *
   *     Identity
   *         ↓
   *     active identity roles
   *         ↓
   *     role-permission assignments
   *         ↓
   *     active permissions
   *         ↓
   *     roles + permission codes
   *
   * The resulting snapshot is consumed by authentication/session workflows
   * when issuing access JWTs.
   *
   * No Prisma dependency crosses into the application service.
   */
  {
    provide: IDENTITY_TOKENS.APPLICATION_SERVICES.AUTHORIZATION_SNAPSHOT,
    useClass: AuthorizationSnapshotServiceImpl,
  },
];

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default IDENTITY_PROVIDERS;
