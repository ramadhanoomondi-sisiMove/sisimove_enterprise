// -----------------------------------------------------------------------------
// Identity — Deactivate Role Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for deactivating a Role aggregate.
//
// Aggregate boundary:
//
// RoleAggregate
// └── RoleEntity
//
// The handler:
//
// - validates the command;
// - resolves the Role aggregate;
// - invokes RoleAggregate.deactivate();
// - persists the aggregate.
//
// The handler does NOT:
//
// - construct RoleEntity;
// - mutate RoleEntity directly;
// - assign or revoke the Role from an Identity;
// - create or modify IdentityRole relationships;
// - create or modify RolePermission relationships;
// - evaluate permissions;
// - modify Identity state;
// - emit RoleDeactivatedEvent directly;
// - access Prisma;
// - communicate with external systems.
//
// RoleAggregate is responsible for:
//
// - validating the lifecycle operation;
// - protecting system Roles from ordinary deactivation;
// - transitioning the Role to INACTIVE;
// - updating the aggregate audit timestamp;
// - recording RoleDeactivatedEvent.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// ACTIVE ───────► INACTIVE
//
// Deactivation is idempotent.
//
// System Roles remain protected by RoleAggregate / RoleEntity rules.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     DeactivateRoleCommand
//              │
//              ▼
// roleRepository.findByPublicId()
//              │
//              ▼
//          RoleAggregate
//              │
//              ▼
//       aggregate.deactivate()
//              │
//              ▼
//       roleRepository.save()
//              │
//              ▼
//          RoleAggregate
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Identity Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { DeactivateRoleCommand } from '../commands/deactivate-role.command';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { RoleRepository } from '../../domain/repositories/role.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { RoleNotFoundException } from '../../domain/exceptions/role-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Deactivates a Role aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     aggregate lookup
 *       ↓
 *     aggregate.deactivate()
 *       ↓
 *     aggregate persistence
 *
 * All Role lifecycle rules remain inside RoleAggregate / RoleEntity.
 */
@Injectable()
export class DeactivateRoleHandler implements CommandHandler<DeactivateRoleCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.ROLE)
    private readonly roleRepository: RoleRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the DeactivateRoleCommand.
   *
   * A successful execution transitions an active Role to INACTIVE.
   *
   * Deactivating an already-inactive Role is idempotent according to the
   * RoleAggregate lifecycle rules.
   */
  public async execute(command: DeactivateRoleCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new RoleNotFoundException('Deactivate role command is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Role public identity guard
    // -------------------------------------------------------------------------

    if (command.rolePublicId === undefined) {
      throw new RoleNotFoundException(
        'Role public ID is required to deactivate a Role.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Load Role aggregate
    // -------------------------------------------------------------------------
    //
    // RoleAggregate is the lifecycle mutation boundary.
    //
    // The repository rehydrates the complete aggregate before the lifecycle
    // operation is invoked.
    // -------------------------------------------------------------------------

    const aggregate = await this.roleRepository.findByPublicId(
      command.rolePublicId,
    );

    if (aggregate === null) {
      throw new RoleNotFoundException(
        `Role ${command.rolePublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Deactivate Role through aggregate
    // -------------------------------------------------------------------------
    //
    // RoleAggregate.deactivate() owns:
    //
    // - lifecycle validation;
    // - system-role protection;
    // - INACTIVE transition;
    // - updatedAt synchronization;
    // - RoleDeactivatedEvent recording.
    //
    // The handler does not mutate RoleEntity directly.
    // -------------------------------------------------------------------------

    aggregate.deactivate(
      command.deactivatedAt ?? new Date(),
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 5. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // RoleAggregate is the unit of persistence.
    //
    // Deactivation does not:
    //
    // - revoke existing IdentityRole assignments;
    // - delete RolePermission assignments;
    // - modify Identity;
    // - alter authorization data directly.
    //
    // Those concerns belong to their respective boundaries and may react to
    // RoleDeactivatedEvent independently.
    // -------------------------------------------------------------------------

    await this.roleRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default DeactivateRoleHandler;
