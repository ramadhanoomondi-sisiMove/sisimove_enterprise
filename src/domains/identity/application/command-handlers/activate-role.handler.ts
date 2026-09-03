// -----------------------------------------------------------------------------
// Identity — Activate Role Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for activating a Role aggregate.
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
// - invokes RoleAggregate.activate();
// - persists the aggregate.
//
// The handler does NOT:
//
// - construct RoleEntity;
// - mutate RoleEntity directly;
// - assign the Role to an Identity;
// - create or modify IdentityRole relationships;
// - create or modify RolePermission relationships;
// - evaluate permissions;
// - modify Identity state;
// - emit RoleActivatedEvent directly;
// - access Prisma;
// - communicate with external systems.
//
// RoleAggregate is responsible for:
//
// - validating the lifecycle operation;
// - enforcing Role invariants;
// - transitioning the Role to ACTIVE;
// - updating the aggregate audit timestamp;
// - recording RoleActivatedEvent.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// INACTIVE ───────► ACTIVE
//
// Activation is idempotent.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     ActivateRoleCommand
//              │
//              ▼
// roleRepository.findByPublicId()
//              │
//              ▼
//          RoleAggregate
//              │
//              ▼
//       aggregate.activate()
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

import type { ActivateRoleCommand } from '../commands/activate-role.command';

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
 * Activates a Role aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     aggregate lookup
 *       ↓
 *     aggregate.activate()
 *       ↓
 *     aggregate persistence
 *
 * All Role lifecycle rules remain inside RoleAggregate / RoleEntity.
 */
@Injectable()
export class ActivateRoleHandler implements CommandHandler<ActivateRoleCommand> {
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
   * Executes the ActivateRoleCommand.
   *
   * A successful execution transitions an inactive Role to ACTIVE.
   *
   * Activating an already-active Role is idempotent according to the
   * RoleAggregate lifecycle rules.
   */
  public async execute(command: ActivateRoleCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new RoleNotFoundException('Activate role command is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Role public identity guard
    // -------------------------------------------------------------------------

    if (command.rolePublicId === undefined) {
      throw new RoleNotFoundException(
        'Role public ID is required to activate a Role.',
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
    // 4. Activate Role through aggregate
    // -------------------------------------------------------------------------
    //
    // RoleAggregate.activate() owns:
    //
    // - lifecycle validation;
    // - ACTIVE transition;
    // - updatedAt synchronization;
    // - RoleActivatedEvent recording.
    //
    // The handler does not mutate RoleEntity directly.
    // -------------------------------------------------------------------------

    aggregate.activate(
      command.activatedAt ?? new Date(),
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 5. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // RoleAggregate is the unit of persistence.
    // -------------------------------------------------------------------------

    await this.roleRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ActivateRoleHandler;
