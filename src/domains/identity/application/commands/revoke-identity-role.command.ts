// -----------------------------------------------------------------------------
// Identity — Revoke Role Command
// -----------------------------------------------------------------------------
//
// Application command for revoking a Role assignment from an Identity
// aggregate.
//
// The command represents the intent to terminate the currently active
// IdentityRole assignment.
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
// - determine revokedAt;
// - delete the Identity;
// - delete the Role;
// - modify Role permissions;
// - authenticate or de-authenticate the Identity;
// - create or revoke authentication credentials;
// - create or revoke a Session;
// - emit IdentityRoleRevokedEvent directly;
// - perform external side effects.
//
// The application handler loads the IdentityAggregate and invokes:
//
//     identityAggregate.revokeRole(...)
//
// The aggregate is responsible for:
//
// - locating the currently active Role assignment;
// - validating the Identity aggregate boundary;
// - determining the revocation timestamp;
// - revoking the IdentityRoleEntity;
// - recording IdentityRoleRevokedEvent.
//
// A later assignment of the same Role creates a new IdentityRoleEntity.
// Revocation is terminal for the existing assignment.
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
 * Command for revoking a Role assignment from an Identity.
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
 * - revokedByPublicId;
 * - reason;
 * - causationId.
 *
 * The revocation timestamp is intentionally NOT supplied by the command.
 * IdentityAggregate determines revokedAt when the mutation occurs.
 *
 * The application layer is responsible for resolving the IdentityAggregate
 * from the Identity repository using `identityPublicId`.
 */
export class RevokeIdentityRoleCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity aggregate from which the Role is being
     * revoked.
     *
     * This is an opaque public identifier and not a persistence identifier.
     */
    public readonly identityPublicId: IdentityPublicId,

    /**
     * Public identity of the Role being revoked.
     *
     * This is an opaque cross-aggregate reference to the Role aggregate.
     */
    public readonly rolePublicId: IdentityRoleRolePublicId,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional public identity of the Identity that performed the revocation.
     *
     * This identifies the actor responsible for the authorization change.
     */
    public readonly revokedByPublicId?: IdentityPublicId,

    /**
     * Optional business reason for revoking the Role assignment.
     */
    public readonly reason?: string,

    /**
     * Optional identifier of the command or operation that caused this
     * Role-revocation request.
     */
    public readonly causationId?: string,
  ) {}
}
