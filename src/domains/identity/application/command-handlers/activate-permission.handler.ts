// -----------------------------------------------------------------------------
// Identity — Activate Permission Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for activating a Permission aggregate.
//
// Aggregate boundary:
//
// PermissionAggregate
// └── PermissionEntity
//
// The handler:
//
// - validates the command;
// - resolves the Permission aggregate;
// - invokes PermissionAggregate.activate();
// - persists the aggregate.
//
// The handler does NOT:
//
// - construct PermissionEntity;
// - construct PermissionAggregate;
// - mutate PermissionEntity directly;
// - assign Permissions to Roles;
// - create or mutate RolePermission relationships;
// - evaluate authorization;
// - modify Identity state;
// - emit PermissionActivatedEvent directly;
// - access Prisma;
// - communicate with external systems.
//
// PermissionAggregate is responsible for:
//
// - enforcing Permission lifecycle rules;
// - transitioning the Permission to ACTIVE;
// - updating the aggregate/entity audit timestamp;
// - recording PermissionActivatedEvent.
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
//     ActivatePermissionCommand
//               │
//               ▼
// permissionRepository.findByPublicId()
//               │
//               ▼
//       PermissionAggregate
//               │
//               ▼
//       aggregate.activate()
//               │
//               ▼
//       permissionRepository.save()
//               │
//               ▼
//       PermissionAggregate
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

import type { ActivatePermissionCommand } from '../commands/activate-permission.command';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { PermissionRepository } from '../../domain/repositories/permission.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { PermissionNotFoundException } from '../../domain/exceptions/permission-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Activates a Permission aggregate.
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
 * All Permission lifecycle rules remain inside PermissionAggregate /
 * PermissionEntity.
 */
@Injectable()
export class ActivatePermissionHandler implements CommandHandler<ActivatePermissionCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.PERMISSION)
    private readonly permissionRepository: PermissionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the ActivatePermissionCommand.
   *
   * A successful execution transitions an inactive Permission to ACTIVE.
   *
   * Activating an already-active Permission remains idempotent according to
   * the PermissionAggregate lifecycle rules.
   */
  public async execute(command: ActivatePermissionCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new PermissionNotFoundException(
        'Activate permission command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Permission public identity guard
    // -------------------------------------------------------------------------

    if (command.permissionPublicId === undefined) {
      throw new PermissionNotFoundException(
        'Permission public ID is required to activate a Permission.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Load Permission aggregate
    // -------------------------------------------------------------------------
    //
    // PermissionAggregate is the lifecycle mutation boundary.
    //
    // The repository rehydrates the complete aggregate before mutation.
    // -------------------------------------------------------------------------

    const aggregate = await this.permissionRepository.findByPublicId(
      command.permissionPublicId,
    );

    if (aggregate === null) {
      throw new PermissionNotFoundException(
        `Permission ${command.permissionPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Activate Permission through aggregate
    // -------------------------------------------------------------------------
    //
    // PermissionAggregate.activate() owns:
    //
    // - lifecycle validation;
    // - ACTIVE transition;
    // - audit timestamp synchronization;
    // - PermissionActivatedEvent recording.
    //
    // The handler does not mutate PermissionEntity directly.
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
    // PermissionAggregate is the unit of persistence.
    //
    // Activation does not:
    //
    // - create RolePermission relationships;
    // - restore authorization assignments;
    // - modify Roles;
    // - modify Identities.
    //
    // Those concerns remain within their respective boundaries.
    // -------------------------------------------------------------------------

    await this.permissionRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ActivatePermissionHandler;
