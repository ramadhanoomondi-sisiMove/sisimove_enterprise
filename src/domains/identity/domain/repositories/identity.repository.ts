// src/domains/identity/domain/repositories/identity.repository.ts

// -----------------------------------------------------------------------------
// Identity Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Identity aggregate.
//
// Aggregate ownership:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// Repository boundary:
//
// - IdentityAggregate is the unit of persistence.
// - IdentityEntity is the aggregate root entity.
// - IdentityRoleEntity is owned by IdentityEntity.
// - IdentityRoleEntity is persisted as part of IdentityAggregate.
// - Cross-aggregate references remain opaque public identities.
// - Repository implementations may optimize persistence and queries internally,
//   but must preserve aggregate invariants.
//
// Responsibilities:
//
// - Create Identity aggregates.
// - Persist existing Identity aggregates.
// - Retrieve complete Identity aggregates.
// - Support public identity lookup.
// - Support contact-attribute lookup.
// - Support lifecycle queries.
// - Support active-role queries.
// - Support existence checks.
//
// This interface belongs entirely to the Identity domain.
//
// It does NOT:
//
// - Depend on Prisma.
// - Depend on ORM/database models.
// - Persist IdentityRoleEntity independently.
// - Execute authentication.
// - Manage sessions.
// - Manage devices.
// - Manage recovery.
// - Manage OTP challenges.
// - Manage verification.
// - Manage permissions.
// - Execute external provider operations.
// - Mutate other aggregates.
//
// Infrastructure implementations are responsible for translating this contract
// into persistence operations.
//
// IMPORTANT:
//
// IdentityRoleEntity is owned by IdentityAggregate.
//
// Therefore the repository intentionally does NOT expose:
//
// - createRole();
// - saveRole();
// - updateRole();
// - deleteRole();
//
// Role persistence occurs through the Identity aggregate.
//
// Cross-domain references use dedicated public identity value objects.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { IdentityAggregate } from '../aggregates/identity.aggregate';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { IdentityPublicId } from '../value-objects/identity-public-id.vo';

import type { IdentityEmail } from '../value-objects/identity-email.vo';

import type { IdentityPhoneNumber } from '../value-objects/identity-phone-number.vo';

import type { IdentityStatus } from '../value-objects/identity-status.vo';

import type { IdentityRoleRolePublicId } from '../value-objects/identity-role-role-public-id.vo';

// =============================================================================
// Repository
// =============================================================================

export interface IdentityRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a brand-new Identity aggregate.
   *
   * The complete aggregate is the unit of persistence:
   *
   * IdentityAggregate
   * └── IdentityEntity
   *     └── IdentityRoleEntity[]
   *
   * The infrastructure implementation must persist the aggregate root and
   * all aggregate-owned IdentityRoleEntity instances atomically.
   *
   * No independent role persistence operation is permitted through this
   * repository contract.
   */
  create(aggregate: IdentityAggregate): Promise<void>;

  /**
   * Persists the current state of an existing Identity aggregate.
   *
   * The aggregate and its owned IdentityRoleEntity collection must be
   * synchronized within the same persistence transaction.
   *
   * The aggregate identity determines which persisted aggregate is updated.
   */
  save(aggregate: IdentityAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Retrieval
  // ===========================================================================

  /**
   * Finds a complete Identity aggregate by its internal persistence identity.
   *
   * This method is primarily an infrastructure/application concern and should
   * only be used where the internal identity is intentionally available.
   *
   * Rehydration must include:
   *
   * - IdentityEntity;
   * - IdentityRoleEntity[].
   *
   * The result must be reconstructed through IdentityAggregate.rehydrate().
   *
   * No domain events should be emitted during rehydration.
   */
  findById(id: string): Promise<IdentityAggregate | null>;

  /**
   * Finds a complete Identity aggregate by public identifier.
   *
   * Rehydration must include:
   *
   * - IdentityEntity;
   * - IdentityRoleEntity[].
   *
   * The aggregate must be reconstructed through
   * IdentityAggregate.rehydrate().
   *
   * No domain events should be emitted during rehydration.
   */
  findByPublicId(publicId: IdentityPublicId): Promise<IdentityAggregate | null>;

  // ===========================================================================
  // Contact Identity
  // ===========================================================================

  /**
   * Finds an Identity aggregate by email address.
   *
   * The email remains represented by its domain value object.
   *
   * The infrastructure implementation is responsible for translating the
   * value object into the persistence representation used by the database.
   *
   * Returns null when no Identity exists for the supplied email.
   */
  findByEmail(email: IdentityEmail): Promise<IdentityAggregate | null>;

  /**
   * Finds an Identity aggregate by phone number.
   *
   * The phone number remains represented by its domain value object.
   *
   * The infrastructure implementation is responsible for translating the
   * value object into the persistence representation used by the database.
   *
   * Returns null when no Identity exists for the supplied phone number.
   */
  findByPhoneNumber(
    phoneNumber: IdentityPhoneNumber,
  ): Promise<IdentityAggregate | null>;

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  /**
   * Finds Identity aggregates by lifecycle status.
   *
   * Results are complete aggregates because Identity lifecycle processing
   * operates on the aggregate boundary.
   */
  findByStatus(status: IdentityStatus): Promise<IdentityAggregate[]>;

  /**
   * Finds Identity aggregates currently in PENDING state.
   *
   * Equivalent to querying identities in PENDING state.
   */
  findPending(): Promise<IdentityAggregate[]>;

  /**
   * Finds Identity aggregates currently in ACTIVE state.
   *
   * Equivalent to querying identities in ACTIVE state.
   */
  findActive(): Promise<IdentityAggregate[]>;

  /**
   * Finds Identity aggregates currently in SUSPENDED state.
   *
   * Equivalent to querying identities in SUSPENDED state.
   */
  findSuspended(): Promise<IdentityAggregate[]>;

  /**
   * Finds Identity aggregates currently in CLOSED state.
   *
   * CLOSED is the terminal Identity lifecycle state.
   */
  findClosed(): Promise<IdentityAggregate[]>;

  // ===========================================================================
  // Role Queries
  // ===========================================================================

  /**
   * Finds Identity aggregates that currently have an active assignment for
   * the supplied Role.
   *
   * The Role is represented only by its opaque public identity.
   *
   * The infrastructure implementation may resolve this public identity
   * against the persistence representation when querying the database.
   *
   * Returned aggregates must be completely rehydrated, including all owned
   * IdentityRoleEntity instances.
   */
  findByActiveRole(
    rolePublicId: IdentityRoleRolePublicId,
  ): Promise<IdentityAggregate[]>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Determines whether an Identity exists by public identifier.
   *
   * This is intentionally an existence-only query and does not require
   * aggregate rehydration.
   */
  existsByPublicId(publicId: IdentityPublicId): Promise<boolean>;

  /**
   * Determines whether an Identity exists for an email address.
   *
   * This is an existence-only query and does not require aggregate
   * rehydration.
   *
   * This is useful for enforcing Identity email uniqueness before aggregate
   * creation or contact-attribute changes.
   */
  existsByEmail(email: IdentityEmail): Promise<boolean>;

  /**
   * Determines whether an Identity exists for a phone number.
   *
   * This is an existence-only query and does not require aggregate
   * rehydration.
   *
   * This is useful for enforcing Identity phone-number uniqueness before
   * aggregate creation or contact-attribute changes.
   */
  existsByPhoneNumber(phoneNumber: IdentityPhoneNumber): Promise<boolean>;

  /**
   * Determines whether an Identity currently has an active assignment for
   * the supplied Role.
   *
   * This is an existence-only query and does not require aggregate
   * rehydration.
   *
   * The query is scoped to active role assignments and therefore must not
   * consider revoked or expired assignments as active.
   */
  existsByActiveRole(rolePublicId: IdentityRoleRolePublicId): Promise<boolean>;
}
