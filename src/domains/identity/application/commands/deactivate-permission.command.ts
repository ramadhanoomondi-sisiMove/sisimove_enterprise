//
// -----------------------------------------------------------------------------
// Identity — Deactivate Permission Command
// -----------------------------------------------------------------------------
//
// Application command for deactivating a Permission aggregate.
//
// The command represents the intent to transition a Permission into its
// inactive lifecycle state.
//
// The command does NOT:
//
// - load the PermissionEntity;
// - construct PermissionEntity;
// - construct PermissionAggregate;
// - mutate PermissionEntity directly;
// - persist the Permission;
// - emit PermissionDeactivatedEvent directly;
// - assign or revoke the Permission from a Role;
// - create or mutate RolePermission relationships;
// - evaluate authorization;
// - communicate with external systems.
//
// The application handler is responsible for:
//
// 1. resolving the PermissionAggregate using `permissionPublicId`;
// 2. invoking:
//
//        permissionAggregate.deactivate(...);
//
// 3. persisting the changed aggregate;
// 4. dispatching the domain events produced by the aggregate.
//
// The aggregate is responsible for:
//
// - validating the lifecycle operation;
// - enforcing Permission invariants;
// - protecting system Permissions from ordinary deactivation;
// - changing the Permission lifecycle state;
// - updating the audit timestamp;
// - recording PermissionDeactivatedEvent.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// ACTIVE ───────► INACTIVE
//
// Deactivation is idempotent. Deactivating an already-inactive Permission
// does not produce another lifecycle event.
//
// System Permissions remain protected by the domain entity and cannot be
// deactivated through the ordinary lifecycle operation.
//
// -----------------------------------------------------------------------------
//
// Permission deactivation does NOT:
//
// - revoke existing IdentityRole assignments;
// - remove RolePermission relationships;
// - modify Roles;
// - modify Identities;
// - evaluate authorization.
//
// Those concerns belong to their respective authorization boundaries and may
// react independently to PermissionDeactivatedEvent.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// correlationId is required and MUST appear before optional parameters.
//
// causationId is optional and identifies the command, event, or operation
// that caused this deactivation request.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { PermissionPublicId } from '../../domain/value-objects/permission-public-id.vo';

// =============================================================================
// Command
// =============================================================================

/**
 * Application command for deactivating a Permission.
 *
 * The application layer resolves the PermissionAggregate using
 * `permissionPublicId` and invokes its deactivation behavior.
 */
export class DeactivatePermissionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Permission aggregate to deactivate.
     *
     * This is an opaque public identifier and not a persistence identifier.
     */
    public readonly permissionPublicId: PermissionPublicId,

    /**
     * Timestamp at which the Permission deactivation occurs.
     *
     * When omitted, the application handler may provide the current time.
     */
    public readonly deactivatedAt: Date | undefined,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused
     * this Permission deactivation request.
     */
    public readonly causationId?: string,
  ) {}
}
