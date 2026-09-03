// -----------------------------------------------------------------------------
// Identity — Create Role Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for creating a Role aggregate.
//
// Aggregate boundary:
//
// RoleAggregate
// └── RoleEntity
//
// The handler:
//
// - validates the command;
// - enforces RoleCode uniqueness;
// - creates the RoleEntity through the domain factory;
// - creates the RoleAggregate;
// - records RoleCreatedEvent through the aggregate;
// - persists the aggregate.
//
// The handler does NOT:
//
// - construct persistence/ORM models;
// - assign the Role to an Identity;
// - create IdentityRole relationships;
// - create RolePermission relationships;
// - grant Permissions;
// - mutate RoleEntity directly after creation;
// - emit domain events directly;
// - access Prisma;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Role creation policy:
//
// The Role domain owns:
//
// - Role public identity generation;
// - Role lifecycle initialization;
// - RoleCode validation;
// - RoleName validation;
// - system/custom designation;
// - Role invariants.
//
// The application layer owns:
//
// - command orchestration;
// - uniqueness coordination;
// - repository interaction.
//
// -----------------------------------------------------------------------------
//
// Uniqueness:
//
// RoleCode is the stable machine-readable identifier of a Role.
//
// The application layer performs:
//
//     roleRepository.existsByCode(command.code)
//
// before aggregate creation.
//
// The persistence layer must additionally enforce:
//
//     UNIQUE(code)
//
// to protect against concurrent creation attempts.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     CreateRoleCommand
//              │
//              ▼
// roleRepository.existsByCode()
//              │
//              ├── already exists → throw
//              │
//              ▼
//        RoleEntity.create()
//              │
//              ▼
//        RoleAggregate.create()
//              │
//              ▼
//        aggregate.recordCreated()
//              │
//              ▼
//        roleRepository.save()
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

import type { CreateRoleCommand } from '../commands/create-role.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { RoleAggregate } from '../../domain/aggregates/role.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { RoleEntity } from '../../domain/entities/role.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { RoleRepository } from '../../domain/repositories/role.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { RoleAlreadyExistsException } from '../../domain/exceptions/role-already-exists.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Creates a new Role aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     uniqueness check
 *       ↓
 *     RoleEntity.create()
 *       ↓
 *     RoleAggregate.create()
 *       ↓
 *     aggregate.recordCreated()
 *       ↓
 *     repository.save()
 *
 * All Role business invariants remain inside RoleEntity / RoleAggregate.
 */
@Injectable()
export class CreateRoleHandler implements CommandHandler<CreateRoleCommand> {
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
   * Executes the CreateRoleCommand.
   *
   * A successful execution creates one Role aggregate and persists it.
   */
  public async execute(command: CreateRoleCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new RoleAlreadyExistsException('Create role command is required.');
    }

    // -------------------------------------------------------------------------
    // 2. RoleCode uniqueness
    // -------------------------------------------------------------------------
    //
    // RoleCode is the stable machine-readable Role identifier.
    //
    // The repository provides the application-level uniqueness check.
    // The database remains the final concurrency-safe guarantee.
    // -------------------------------------------------------------------------

    const exists = await this.roleRepository.existsByCode(command.code);

    if (exists) {
      throw new RoleAlreadyExistsException(
        `Role with code ${command.code.value} already exists.`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Create RoleEntity
    // -------------------------------------------------------------------------
    //
    // RoleEntity.create() uses positional domain arguments.
    //
    // The entity owns:
    //
    // - Role public identity generation;
    // - initial lifecycle state;
    // - RoleCode / RoleName validation;
    // - system/custom Role invariants;
    // - timestamps.
    //
    // The handler supplies business creation inputs only.
    // -------------------------------------------------------------------------

    const role = RoleEntity.create(
      command.code,
      command.name,
      command.description,
      command.displayOrder,
      command.isSystem,
    );

    // -------------------------------------------------------------------------
    // 4. Create RoleAggregate
    // -------------------------------------------------------------------------
    //
    // RoleAggregate becomes the authoritative application-facing aggregate
    // boundary for the newly created Role.
    // -------------------------------------------------------------------------

    const aggregate = RoleAggregate.create(role);

    // -------------------------------------------------------------------------
    // 5. Record creation event
    // -------------------------------------------------------------------------
    //
    // The aggregate records RoleCreatedEvent.
    //
    // The handler never constructs or publishes the event directly.
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 6. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // RoleAggregate is the unit of persistence.
    //
    // No IdentityRole or RolePermission relationship is created here.
    // -------------------------------------------------------------------------

    await this.roleRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateRoleHandler;
