// -----------------------------------------------------------------------------
// Identity — Create Role Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Role aggregate.
//
// The command represents the intent to create a new Role.
//
// The command does NOT:
//
// - construct RoleEntity;
// - construct RoleAggregate;
// - persist the Role;
// - emit RoleCreatedEvent directly;
// - assign the Role to an Identity;
// - create IdentityRole relationships;
// - create RolePermission relationships;
// - grant permissions;
// - access Prisma;
// - communicate with external systems.
//
// The application handler is responsible for:
//
// 1. validating/resolving the command context;
// 2. constructing the RoleEntity / RoleAggregate through the domain factory;
// 3. recording the RoleCreatedEvent through the aggregate;
// 4. persisting the aggregate.
//
// The RoleAggregate remains responsible for domain behavior and invariants.
//
// -----------------------------------------------------------------------------
//
// Required inputs:
//
// - code
// - name
// - displayOrder
// - isSystem
//
// Optional inputs:
//
// - description
// - causationId
//
// Correlation metadata:
//
// - correlationId identifies the command and resulting domain event;
// - causationId optionally identifies the command/operation that caused this
//   command.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { RoleCode } from '../../domain/value-objects/role-code.vo';

import type { RoleName } from '../../domain/value-objects/role-name.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for creating a Role aggregate.
 *
 * The command carries the business inputs required to create the Role
 * together with the correlation metadata required for the resulting
 * domain event.
 */
export class CreateRoleCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Stable machine-readable Role code.
     */
    public readonly code: RoleCode,

    /**
     * Human-readable Role name.
     */
    public readonly name: RoleName,

    /**
     * Administrative display ordering for the Role.
     */
    public readonly displayOrder: number,

    /**
     * Indicates whether the Role is system-managed.
     *
     * System Roles are protected by the Role domain rules.
     */
    public readonly isSystem: boolean,

    /**
     * Optional human-readable description of the Role.
     */
    public readonly description: string | undefined,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * Role creation request.
     */
    public readonly causationId?: string,
  ) {}
}
