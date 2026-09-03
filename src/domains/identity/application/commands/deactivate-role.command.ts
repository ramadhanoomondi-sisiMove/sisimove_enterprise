// -----------------------------------------------------------------------------
// Identity — Deactivate Role Command
// -----------------------------------------------------------------------------
//
// Application command for deactivating a Role aggregate.
//
// The command represents the intent to transition a Role into the INACTIVE
// lifecycle state.
//
// The command does NOT:
//
// - mutate RoleEntity directly;
// - construct RoleEntity;
// - construct RoleAggregate;
// - perform persistence;
// - emit RoleDeactivatedEvent directly;
// - assign or revoke the Role from an Identity;
// - modify IdentityRole relationships;
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
//        roleAggregate.deactivate(...)
//
// 3. persisting the aggregate.
//
// The RoleAggregate is responsible for:
//
// - enforcing Role lifecycle invariants;
// - protecting system Roles from ordinary deactivation;
// - changing the Role lifecycle state;
// - updating the aggregate audit timestamp;
// - recording RoleDeactivatedEvent.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// ACTIVE ───────► INACTIVE
//
// Deactivation is idempotent. Deactivating an already-inactive Role produces
// no additional lifecycle transition or domain event.
//
// System Roles remain protected by the Role domain rules.
//
// -----------------------------------------------------------------------------
//
// Correlation metadata:
//
// - correlationId identifies the command and resulting domain event;
// - causationId optionally identifies the command or operation that caused
//   this deactivation request.
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
 * Command for deactivating a Role aggregate.
 *
 * The application layer is responsible for resolving the RoleAggregate
 * using `rolePublicId` and invoking the aggregate lifecycle operation.
 */
export class DeactivateRoleCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Role aggregate to deactivate.
     *
     * This is an opaque public identifier and not a persistence identifier.
     */
    public readonly rolePublicId: RolePublicId,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Timestamp at which the Role is considered deactivated.
     *
     * When omitted, the application handler/aggregate uses the current time.
     */
    public readonly deactivatedAt?: Date,

    /**
     * Optional identifier of the command or operation that caused this
     * deactivation request.
     */
    public readonly causationId?: string,
  ) {}
}
