// -----------------------------------------------------------------------------
// Identity — Create Permission Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for creating a Permission aggregate.
//
// Aggregate boundary:
//
// PermissionAggregate
// └── PermissionEntity
//
// The handler:
//
// - validates the command;
// - enforces PermissionCode uniqueness;
// - enforces resource/action capability uniqueness;
// - creates the PermissionEntity through its domain factory;
// - creates the PermissionAggregate;
// - records PermissionCreatedEvent through the aggregate;
// - persists the aggregate.
//
// The handler does NOT:
//
// - construct persistence/ORM models;
// - assign the Permission to a Role;
// - create RolePermission relationships;
// - evaluate authorization;
// - mutate PermissionEntity directly after creation;
// - emit domain events directly;
// - access Prisma;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Permission uniqueness:
//
// Two independent uniqueness rules exist:
//
//     UNIQUE(code)
//
// and:
//
//     UNIQUE(resource, action)
//
// The application layer performs both checks for clear domain errors.
//
// The database remains the final concurrency-safe guarantee.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     CreatePermissionCommand
//              │
//              ▼
// permissionRepository.existsByCode()
//              │
//              ├── already exists → throw
//              │
//              ▼
// permissionRepository.existsByResourceAndAction()
//              │
//              ├── already exists → throw
//              │
//              ▼
//       PermissionEntity.create()
//              │
//              ▼
//       PermissionAggregate.create()
//              │
//              ▼
//       aggregate.recordCreated()
//              │
//              ▼
//       permissionRepository.save()
//              │
//              ▼
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

import type { CreatePermissionCommand } from '../commands/create-permission.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { PermissionAggregate } from '../../domain/aggregates/permission.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { PermissionEntity } from '../../domain/entities/permission.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { PermissionRepository } from '../../domain/repositories/permission.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { PermissionAlreadyExistsException } from '../../domain/exceptions/permission-already-exists.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Creates a new Permission aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     uniqueness checks
 *       ↓
 *     PermissionEntity.create()
 *       ↓
 *     PermissionAggregate.create()
 *       ↓
 *     aggregate.recordCreated()
 *       ↓
 *     repository.save()
 *
 * All Permission business invariants remain inside PermissionEntity /
 * PermissionAggregate.
 */
@Injectable()
export class CreatePermissionHandler implements CommandHandler<CreatePermissionCommand> {
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
   * Executes the CreatePermissionCommand.
   *
   * A successful execution creates one Permission aggregate and persists it.
   */
  public async execute(command: CreatePermissionCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new PermissionAlreadyExistsException(
        'Create permission command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. PermissionCode uniqueness
    // -------------------------------------------------------------------------
    //
    // PermissionCode is the stable machine-readable Permission identifier.
    // -------------------------------------------------------------------------

    const codeExists = await this.permissionRepository.existsByCode(
      command.code,
    );

    if (codeExists) {
      throw new PermissionAlreadyExistsException(
        `Permission with code ${command.code.value} already exists.`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Resource / Action uniqueness
    // -------------------------------------------------------------------------
    //
    // The authorization model permits only one Permission for a given
    // resource/action capability.
    //
    // Corresponds to:
    //
    //     UNIQUE(resource, action)
    // -------------------------------------------------------------------------

    const capabilityExists =
      await this.permissionRepository.existsByResourceAndAction(
        command.resource,
        command.action,
      );

    if (capabilityExists) {
      throw new PermissionAlreadyExistsException(
        `Permission for resource ${command.resource.value} and action ${command.action.value} already exists.`,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Create PermissionEntity
    // -------------------------------------------------------------------------
    //
    // PermissionEntity.create() owns:
    //
    // - Permission public identity generation;
    // - PermissionCode validation;
    // - Permission name validation;
    // - resource validation;
    // - action validation;
    // - system/custom state;
    // - lifecycle state;
    // - timestamps.
    //
    // IMPORTANT:
    //
    // PermissionEntity.create() expects PermissionCode before the name.
    // -------------------------------------------------------------------------

    const permission = PermissionEntity.create(
      command.code,
      command.name,
      command.resource,
      command.action,
      command.description,
      command.isSystem,
      command.isActive,
    );

    // -------------------------------------------------------------------------
    // 5. Create PermissionAggregate
    // -------------------------------------------------------------------------
    //
    // PermissionAggregate becomes the authoritative application-facing
    // aggregate boundary for the newly created Permission.
    // -------------------------------------------------------------------------

    const aggregate = PermissionAggregate.create(permission);

    // -------------------------------------------------------------------------
    // 6. Record creation event
    // -------------------------------------------------------------------------
    //
    // The aggregate records PermissionCreatedEvent.
    //
    // The handler does not construct or publish the event directly.
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 7. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // PermissionAggregate is the unit of persistence.
    //
    // No RolePermission relationship is created here.
    // -------------------------------------------------------------------------

    await this.permissionRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreatePermissionHandler;
