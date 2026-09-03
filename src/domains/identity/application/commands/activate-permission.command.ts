// -----------------------------------------------------------------------------
// Identity — Activate Permission Command
// -----------------------------------------------------------------------------
//
// Application command for activating a Permission aggregate.
//
// The command represents the intent to transition a Permission into its
// ACTIVE lifecycle state.
//
// The command does NOT:
//
// - load the PermissionEntity;
// - construct PermissionEntity;
// - construct PermissionAggregate;
// - mutate PermissionEntity directly;
// - persist the Permission;
// - emit PermissionActivatedEvent directly;
// - assign the Permission to a Role;
// - create or mutate RolePermission relationships;
// - evaluate authorization;
// - communicate with external systems.
//
// The application handler is responsible for:
//
// 1. resolving the PermissionAggregate using permissionPublicId;
// 2. invoking:
//
//        permissionAggregate.activate(...);
//
// 3. persisting the changed aggregate;
// 4. dispatching the domain events produced by the aggregate.
//
// The aggregate is responsible for:
//
// - validating the lifecycle operation;
// - activating the Permission;
// - maintaining Permission invariants;
// - updating the aggregate/entity audit timestamp;
// - recording PermissionActivatedEvent.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// INACTIVE ───────► ACTIVE
//
// ACTIVE is idempotent. Activating an already-active Permission does not
// produce another lifecycle event.
//
// -----------------------------------------------------------------------------
//
// Permission activation does NOT:
//
// - assign the Permission to any Role;
// - restore previous RolePermission assignments;
// - modify IdentityRole relationships;
// - evaluate whether the Permission can be used.
//
// Assignment and authorization remain separate boundaries.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// correlationId is required and MUST appear before optional parameters.
//
// causationId is optional and identifies the command, event, or operation
// that caused this activation request.
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
 * Application command for activating a Permission.
 *
 * The application layer resolves the PermissionAggregate using
 * `permissionPublicId` and invokes its activation behavior.
 */
export class ActivatePermissionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Permission aggregate to activate.
     *
     * This is an opaque public identifier and not a persistence identifier.
     */
    public readonly permissionPublicId: PermissionPublicId,

    /**
     * Timestamp at which the Permission activation occurs.
     *
     * When omitted, the application handler may provide the current time.
     */
    public readonly activatedAt: Date | undefined,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused
     * this Permission activation request.
     */
    public readonly causationId?: string,
  ) {}
}
