// -----------------------------------------------------------------------------
// Identity — Assign Role Permission Command
// -----------------------------------------------------------------------------
//
// Application command for assigning a Permission to a Role.
//
// The command represents the intent to create a RolePermission authorization
// relationship.
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
// - emit RolePermissionAssignedEvent directly;
// - assign a Role to an Identity;
// - grant permissions directly to an Identity;
// - authenticate an Identity;
// - evaluate authorization;
// - communicate with external systems.
//
// The application handler is responsible for:
//
// 1. resolving/validating the referenced Role and Permission;
// 2. enforcing application-level authorization to perform the assignment;
// 3. constructing the RolePermissionEntity;
// 4. creating the RolePermissionAggregate;
// 5. invoking the aggregate assignment behavior;
// 6. persisting the aggregate;
// 7. dispatching the domain events produced by the aggregate.
//
// The RolePermission aggregate is responsible for:
//
// - enforcing RolePermission invariants;
// - maintaining the RolePermission relationship;
// - recording RolePermissionAssignedEvent.
//
// -----------------------------------------------------------------------------
//
// Relationship:
//
// Role
//   │
//   └── Permission
//          │
//          ▼
// RolePermission
//
// The command carries public identifiers for both sides of the relationship.
//
// Cross-aggregate references are represented using dedicated
// RolePermission value objects rather than persistence identifiers.
//
// -----------------------------------------------------------------------------
//
// Assignment:
//
// A RolePermission assignment is a separate authorization relationship.
//
// This command does NOT:
//
// - modify the Role aggregate;
// - modify the Permission aggregate;
// - activate an inactive Role;
// - activate an inactive Permission;
// - assign the Role to an Identity.
//
// Whether an inactive Role or Permission may be assigned is a domain/application
// policy enforced before or during creation of the RolePermission aggregate.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// correlationId is required and MUST appear before optional parameters.
//
// causationId is optional and identifies the command, event, or operation
// that caused this assignment request.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  RolePermissionRolePublicId,
  RolePermissionPermissionPublicId,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Application command for assigning a Permission to a Role.
 *
 * The application layer uses the supplied public identifiers to establish the
 * RolePermission aggregate representing the authorization relationship.
 */
export class AssignRolePermissionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Role receiving the Permission.
     *
     * This is an opaque public identifier and not a persistence identifier.
     */
    public readonly roleId: RolePermissionRolePublicId,

    /**
     * Public identity of the Permission being assigned.
     *
     * This is an opaque public identifier and not a persistence identifier.
     */
    public readonly permissionId: RolePermissionPermissionPublicId,

    /**
     * Timestamp at which the RolePermission relationship is established.
     *
     * When omitted, the application handler may provide the current time.
     */
    public readonly assignedAt: Date | undefined,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused
     * this RolePermission assignment.
     */
    public readonly causationId?: string,
  ) {}
}
