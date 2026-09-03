// -----------------------------------------------------------------------------
// Identity — Revoke Role Permission Command
// -----------------------------------------------------------------------------
//
// Application command for revoking a Permission assignment from a Role.
//
// The command represents the intent to revoke an existing RolePermission
// authorization relationship.
//
// Aggregate:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// The command does NOT:
//
// - construct RolePermissionEntity;
// - construct RolePermissionAggregate;
// - mutate RoleEntity;
// - mutate PermissionEntity;
// - persist RolePermission;
// - emit RolePermissionRevokedEvent directly;
// - deactivate the Role;
// - deactivate the Permission;
// - revoke the Role from an Identity;
// - modify Identity authentication state;
// - evaluate authorization;
// - communicate with external systems.
//
// The application handler is responsible for:
//
// 1. resolving the RolePermissionAggregate using the relationship public ID;
// 2. invoking:
//
//        rolePermissionAggregate.revoke(...);
//
// 3. persisting the changed aggregate;
// 4. dispatching the domain events produced by the aggregate.
//
// The RolePermission aggregate is responsible for:
//
// - validating the relationship lifecycle transition;
// - enforcing RolePermission invariants;
// - changing the relationship lifecycle state;
// - recording RolePermissionRevokedEvent.
//
// -----------------------------------------------------------------------------
//
// Expected relationship lifecycle:
//
// ASSIGNED ───────► REVOKED
//
// REVOKED is terminal.
//
// Revoking the RolePermission relationship does NOT:
//
// - deactivate the Role;
// - deactivate the Permission;
// - revoke the Role from an Identity;
// - remove other RolePermission relationships;
// - modify Identity authentication.
//
// Those concerns remain separate lifecycle boundaries.
//
// -----------------------------------------------------------------------------
//
// Aggregate identity:
//
// The command targets the RolePermission aggregate using its public identity.
//
// The command does NOT accept roleId or permissionId because the relationship
// being revoked is already uniquely identified by RolePermissionPublicId.
//
// The aggregate/event can expose roleId and permissionId as part of the
// resulting domain event:
//
//     RolePermissionRevokedEvent
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// correlationId is required and MUST appear before optional parameters.
//
// causationId is optional and identifies the command, event, or operation
// that caused this revocation request.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { RolePermissionPublicId } from '../../domain/value-objects/role-permission-public-id.vo';

// =============================================================================
// Command
// =============================================================================

/**
 * Application command for revoking a RolePermission relationship.
 *
 * The application layer resolves the RolePermissionAggregate using
 * `rolePermissionPublicId` and invokes its revocation behavior.
 */
export class RevokeRolePermissionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the RolePermission aggregate to revoke.
     *
     * This identifies the existing Role-to-Permission authorization
     * relationship.
     *
     * It is an opaque public identifier and not a persistence identifier.
     */
    public readonly rolePermissionPublicId: RolePermissionPublicId,

    /**
     * Timestamp at which the RolePermission relationship is revoked.
     *
     * When omitted, the application handler may provide the current time.
     */
    public readonly revokedAt: Date | undefined,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused
     * this RolePermission revocation.
     */
    public readonly causationId?: string,
  ) {}
}
