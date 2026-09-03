// -----------------------------------------------------------------------------
// Identity — Assign Role Command
// -----------------------------------------------------------------------------
//
// Application command for assigning a Role to an Identity aggregate.
//
// The command represents the intent to establish an IdentityRole assignment.
//
// Aggregate boundary:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity
//
// The command does NOT:
//
// - construct IdentityEntity;
// - construct IdentityRoleEntity;
// - mutate IdentityEntity directly;
// - create the Role;
// - modify Role permissions;
// - authenticate the Identity;
// - create authentication credentials;
// - create a Session;
// - emit IdentityRoleAssignedEvent directly;
// - perform external side effects.
//
// The application handler loads the IdentityAggregate and invokes:
//
//     identityAggregate.assignRole(...)
//
// The aggregate is responsible for:
//
// - validating the Identity lifecycle state;
// - determining the assignment timestamp;
// - preventing duplicate active role assignments;
// - creating IdentityRoleEntity;
// - establishing aggregate ownership;
// - recording IdentityRoleAssignedEvent.
//
// The Role itself remains a separate aggregate. The command therefore carries
// only the opaque Role public identifier.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Identity Value Objects
// -----------------------------------------------------------------------------

import type {
  IdentityPublicId,
  IdentityRoleRolePublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for assigning a Role to an Identity.
 *
 * The command carries domain-ready value objects rather than raw transport
 * values.
 *
 * DTO-to-domain conversion belongs to the presentation/application boundary.
 *
 * Required domain inputs:
 *
 * - identityPublicId;
 * - rolePublicId;
 * - correlationId.
 *
 * Optional inputs:
 *
 * - assignedByPublicId;
 * - expiresAt;
 * - causationId.
 *
 * The assignment timestamp is intentionally absent.
 *
 * `assignedAt` is a fact describing when the assignment occurred. It is
 * therefore determined by IdentityAggregate when the mutation is executed,
 * rather than supplied by the application caller.
 *
 * The application layer is responsible for resolving the IdentityAggregate
 * from the Identity repository using `identityPublicId`.
 */
export class AssignIdentityRoleCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity aggregate receiving the Role.
     *
     * This is an opaque public identifier and not a persistence identifier.
     */
    public readonly identityPublicId: IdentityPublicId,

    /**
     * Public identity of the Role being assigned.
     *
     * This is an opaque cross-aggregate reference to the Role aggregate.
     */
    public readonly rolePublicId: IdentityRoleRolePublicId,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional public identity of the Identity that performed the assignment.
     *
     * This records the actor responsible for the authorization change; it
     * does not establish an ownership relationship with that Identity.
     */
    public readonly assignedByPublicId?: IdentityPublicId,

    /**
     * Optional expiration timestamp for the Role assignment.
     *
     * When omitted, the assignment has no explicit expiration.
     *
     * Unlike `assignedAt`, this is a business input because the requested
     * expiration is part of the desired Role assignment policy.
     */
    public readonly expiresAt?: Date,

    /**
     * Optional identifier of the command or operation that caused this
     * Role-assignment request.
     */
    public readonly causationId?: string,
  ) {}
}
