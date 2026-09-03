// -----------------------------------------------------------------------------
// Identity — Deactivate Permission Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for deactivating a Permission aggregate.
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
// - invokes PermissionAggregate.deactivate();
// - persists the aggregate.
//
// The handler does NOT:
//
// - construct PermissionEntity;
// - construct PermissionAggregate;
// - mutate PermissionEntity directly;
// - assign or revoke Permissions from Roles;
// - create or modify RolePermission relationships;
// - evaluate authorization;
// - modify Identity state;
// - emit PermissionDeactivatedEvent directly;
// - access Prisma;
// - communicate with external systems.
//
// PermissionAggregate is responsible for:
//
// - enforcing Permission lifecycle rules;
// - protecting system Permissions;
// - transitioning the Permission to INACTIVE;
// - updating the aggregate/entity audit timestamp;
// - recording PermissionDeactivatedEvent.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// ACTIVE ───────► INACTIVE
//
// Deactivation is idempotent.
//
// System Permissions remain protected by PermissionEntity / PermissionAggregate
// domain rules.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     DeactivatePermissionCommand
//               │
//               ▼
// permissionRepository.findByPublicId()
//               │
//               ▼
//        PermissionAggregate
//               │
//               ▼
//       aggregate.deactivate()
//               │
//               ▼
//       permissionRepository.save()
//               │
//               ▼
//        PermissionAggregate
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

import type { DeactivatePermissionCommand } from '../commands/deactivate-permission.command';

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
 * Deactivates a Permission aggregate.
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
 * All Permission lifecycle rules remain inside PermissionAggregate /
 * PermissionEntity.
 */
@Injectable()
export class DeactivatePermissionHandler implements CommandHandler<DeactivatePermissionCommand> {
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
   * Executes the DeactivatePermissionCommand.
   *
   * A successful execution transitions an active Permission to INACTIVE.
   *
   * Deactivating an already-inactive Permission remains idempotent according to
   * the PermissionAggregate lifecycle rules.
   */
  public async execute(command: DeactivatePermissionCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new PermissionNotFoundException(
        'Deactivate permission command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Permission public identity guard
    // -------------------------------------------------------------------------

    if (command.permissionPublicId === undefined) {
      throw new PermissionNotFoundException(
        'Permission public ID is required to deactivate a Permission.',
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
    // 4. Deactivate Permission through aggregate
    // -------------------------------------------------------------------------
    //
    // PermissionAggregate.deactivate() owns:
    //
    // - lifecycle validation;
    // - system-Permission protection;
    // - INACTIVE transition;
    // - audit timestamp synchronization;
    // - PermissionDeactivatedEvent recording.
    //
    // The handler does not mutate PermissionEntity directly.
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
    // PermissionAggregate is the unit of persistence.
    //
    // Deactivation does not directly:
    //
    // - revoke RolePermission relationships;
    // - modify Roles;
    // - modify Identities;
    // - evaluate authorization.
    //
    // Those concerns remain within their respective boundaries and may react
    // to PermissionDeactivatedEvent independently.
    // -------------------------------------------------------------------------

    await this.permissionRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default DeactivatePermissionHandler;
