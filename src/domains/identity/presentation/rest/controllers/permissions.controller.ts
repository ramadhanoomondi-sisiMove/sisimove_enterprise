// -----------------------------------------------------------------------------
// Identity — Permission HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Permission aggregate operations.
//
// Aggregate boundary:
//
// PermissionAggregate
// └── PermissionEntity
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion of transport primitives to domain value objects;
// - dispatching application commands and queries;
// - mapping domain results to HTTP response models.
//
// The controller contains no business rules.
//
// Domain behavior:
// - PermissionAggregate;
// - PermissionEntity.
//
// Application orchestration:
// - command handlers;
// - query handlers.
//
// Persistence:
// - PermissionRepository.
//
// IMPORTANT:
//
// Permission is an aggregate root.
//
// Permission relationships are separate boundaries:
//
// Role
// └── RolePermission
//
// Identity
// └── IdentityRole
//
// This controller does NOT:
//
// - assign Permissions to Roles;
// - revoke Permissions from Roles;
// - assign Roles to Identities;
// - revoke Roles from Identities;
// - evaluate authorization;
// - access Prisma;
// - perform persistence directly.
//
// Those operations belong to their respective application/domain boundaries.
//
// -----------------------------------------------------------------------------
//
// Supported Permission operations:
//
// Permission definition:
// - create permission.
//
// Permission lifecycle:
// - activate permission;
// - deactivate permission.
//
// Permission queries:
// - get permission;
// - get permissions.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Identity — Authentication & Authorization
// -----------------------------------------------------------------------------

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../../../application/identity.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  ActivatePermissionCommand,
  CreatePermissionCommand,
  DeactivatePermissionCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetPermissionQuery,
  GetPermissionsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { PermissionAggregate } from '../../../domain/aggregates/permission.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  PermissionAction,
  PermissionCode,
  PermissionPublicId,
  PermissionResource,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  ActivatePermissionRequestDto,
  CreatePermissionRequestDto,
  DeactivatePermissionRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import { GetPermissionQueryDto } from '../queries';

// -----------------------------------------------------------------------------
// Presentation — Response Models
// -----------------------------------------------------------------------------

import type { PermissionResponse } from '../mappers/permission.response.mapper';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { PermissionResponseMapper } from '../mappers/permission.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Permission Command Handlers
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_PERMISSION)
    private readonly createPermissionHandler: CommandHandler<
      CreatePermissionCommand,
      PermissionAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.ACTIVATE_PERMISSION)
    private readonly activatePermissionHandler: CommandHandler<
      ActivatePermissionCommand,
      PermissionAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.DEACTIVATE_PERMISSION)
    private readonly deactivatePermissionHandler: CommandHandler<
      DeactivatePermissionCommand,
      PermissionAggregate
    >,

    // -------------------------------------------------------------------------
    // Permission Query Handlers
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_PERMISSION)
    private readonly getPermissionHandler: QueryHandler<
      GetPermissionQuery,
      PermissionAggregate | null
    >,

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_PERMISSIONS)
    private readonly getPermissionsHandler: QueryHandler<
      GetPermissionsQuery,
      readonly PermissionAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Permission
  // ---------------------------------------------------------------------------
  //
  // GetPermissionQuery:
  //
  //   permissionPublicId
  //
  // The Permission is resolved through its aggregate public identifier.
  //

  @Get(':permissionPublicId')
  @RequirePermissions('permission:read')
  public async get(
    @Param() dto: GetPermissionQueryDto,
  ): Promise<PermissionResponse | null> {
    const query = new GetPermissionQuery(
      new PermissionPublicId(dto.permissionPublicId),
    );

    const aggregate = await this.getPermissionHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return PermissionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Permissions
  // ---------------------------------------------------------------------------
  //
  // GetPermissionsQuery:
  //
  //   no filters
  //
  // Specialized collection semantics remain represented by specialized
  // application queries rather than transport-level filtering on this query.
  //

  @Get()
  @RequirePermissions('permission:read')
  public async getMany(): Promise<PermissionResponse[]> {
    const query = new GetPermissionsQuery();

    const aggregates = await this.getPermissionsHandler.execute(query);

    return aggregates.map((aggregate) =>
      PermissionResponseMapper.toResponse(aggregate),
    );
  }

  // ===========================================================================
  // Permission Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Permission
  // ---------------------------------------------------------------------------
  //
  // CreatePermissionCommand:
  //
  //   name
  //   code
  //   resource
  //   action
  //   description?
  //   isSystem
  //   isActive
  //   correlationId
  //   causationId?
  //
  // PermissionPublicId is generated by PermissionEntity.
  //

  @Post()
  @RequirePermissions('permission:create')
  public async create(
    @Body() dto: CreatePermissionRequestDto,
  ): Promise<PermissionResponse> {
    const command = new CreatePermissionCommand(
      dto.name,
      PermissionCode.create(dto.code),
      PermissionResource.create(dto.resource),
      PermissionAction.create(dto.action),
      dto.description,
      dto.isSystem,
      dto.isActive,
      dto.correlationId,
      dto.causationId,
    );

    const aggregate = await this.createPermissionHandler.execute(command);

    return PermissionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Activate Permission
  // ---------------------------------------------------------------------------
  //
  // ActivatePermissionCommand:
  //
  //   permissionPublicId
  //   activatedAt?
  //   correlationId
  //   causationId?
  //
  // Activation is idempotent at the aggregate level.
  //

  @Patch(':permissionPublicId/activate')
  @RequirePermissions('permission:activate')
  public async activate(
    @Param('permissionPublicId') permissionPublicId: string,
    @Body() dto: ActivatePermissionRequestDto,
  ): Promise<PermissionResponse> {
    const command = new ActivatePermissionCommand(
      new PermissionPublicId(permissionPublicId),
      dto.activatedAt !== undefined ? new Date(dto.activatedAt) : undefined,
      dto.correlationId,
      dto.causationId,
    );

    const aggregate = await this.activatePermissionHandler.execute(command);

    return PermissionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Deactivate Permission
  // ---------------------------------------------------------------------------
  //
  // DeactivatePermissionCommand:
  //
  //   permissionPublicId
  //   deactivatedAt?
  //   correlationId
  //   causationId?
  //
  // System-Permission protection remains inside PermissionEntity.
  //

  @Patch(':permissionPublicId/deactivate')
  @RequirePermissions('permission:deactivate')
  public async deactivate(
    @Param('permissionPublicId') permissionPublicId: string,
    @Body() dto: DeactivatePermissionRequestDto,
  ): Promise<PermissionResponse> {
    const command = new DeactivatePermissionCommand(
      new PermissionPublicId(permissionPublicId),
      dto.deactivatedAt !== undefined ? new Date(dto.deactivatedAt) : undefined,
      dto.correlationId,
      dto.causationId,
    );

    const aggregate = await this.deactivatePermissionHandler.execute(command);

    return PermissionResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PermissionsController;
