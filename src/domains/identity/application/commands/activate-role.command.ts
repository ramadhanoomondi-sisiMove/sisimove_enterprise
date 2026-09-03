// -----------------------------------------------------------------------------
// Identity — Activate Role Command
// -----------------------------------------------------------------------------
//
// Application command for activating a Role aggregate.
//
// The command represents the intent to transition a Role into the ACTIVE
// lifecycle state.
//
// The command does NOT:
//
// - mutate RoleEntity directly;
// - construct RoleEntity;
// - construct RoleAggregate;
// - perform persistence;
// - emit RoleActivatedEvent directly;
// - assign the Role to an Identity;
// - revoke or modify IdentityRole relationships;
// - modify RolePermission relationships;
// - evaluate permissions;
// - access Prisma;
// - communicate with external systems.
//
// The application handler is responsible for:
//
// 1. resolving the RoleAggregate from the Role repository;
// 2. invoking:
//
//        roleAggregate.activate(...)
//
// 3. persisting the aggregate.
//
// The RoleAggregate is responsible for:
//
// - validating the lifecycle operation;
// - enforcing Role invariants;
// - changing the Role lifecycle state;
// - updating the aggregate audit timestamp;
// - recording RoleActivatedEvent.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// INACTIVE ───────► ACTIVE
//
// Activation is idempotent. Activating an already-active Role produces no
// additional lifecycle transition or domain event.
//
// -----------------------------------------------------------------------------
//
// Correlation metadata:
//
// - correlationId identifies the command and resulting domain event;
// - causationId optionally identifies the command or operation that caused
//   this activation request.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { RolePublicId } from '../../domain/value-objects/role-public-id.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for activating a Role aggregate.
 *
 * The application layer is responsible for resolving the RoleAggregate
 * using `rolePublicId` and invoking the aggregate lifecycle operation.
 */
export class ActivateRoleCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Role aggregate to activate.
     *
     * This is an opaque public identifier and not a persistence identifier.
     */
    public readonly rolePublicId: RolePublicId,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Timestamp at which the Role is considered activated.
     *
     * When omitted, the application handler/aggregate uses the current time.
     */
    public readonly activatedAt?: Date,

    /**
     * Optional identifier of the command or operation that caused this
     * activation request.
     */
    public readonly causationId?: string,
  ) {}
}
