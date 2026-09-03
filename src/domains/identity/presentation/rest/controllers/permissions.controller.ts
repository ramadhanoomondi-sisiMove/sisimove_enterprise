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
//
// Authentication & Authorization:
//
// - JwtAuthGuard authenticates the request using the access-token JWT;
// - PermissionsGuard evaluates the permission declared by
//   @RequirePermissions(...);
// - Swagger exposes the protected API through the Bearer authentication
//   scheme.
//
// Swagger documentation does not perform authorization. The guards remain
// the runtime security boundary.
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

import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

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
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
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
  // Authentication:
  // - JWT access token required.
  //
  // Authorization:
  // - permission:read
  //
  // ---------------------------------------------------------------------------

  @Get(':permissionPublicId')
  @RequirePermissions('permission:read')
  @ApiOperation({
    summary: 'Get a Permission',
    description:
      'Returns a Permission identified by its aggregate public identifier.',
  })
  @ApiParam({
    name: 'permissionPublicId',
    description: 'Public identifier of the Permission.',
    type: String,
    example: 'PERM-5GH3MK',
  })
  @ApiOkResponse({
    description: 'Permission retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission.',
  })
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
  // Authentication:
  // - JWT access token required.
  //
  // Authorization:
  // - permission:read
  //
  // This query intentionally retrieves the complete Permission collection.
  //
  // Specialized collection semantics remain represented by specialized
  // application queries rather than transport-level filtering on this query.
  //
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('permission:read')
  @ApiOperation({
    summary: 'Get all Permissions',
    description: 'Returns the complete collection of Permission aggregates.',
  })
  @ApiOkResponse({
    description: 'Permissions retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission.',
  })
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
  // Authentication:
  // - JWT access token required.
  //
  // Authorization:
  // - permission:create
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
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('permission:create')
  @ApiOperation({
    summary: 'Create a Permission',
    description: 'Creates a new Permission aggregate definition.',
  })
  @ApiBody({
    type: CreatePermissionRequestDto,
  })
  @ApiCreatedResponse({
    description: 'Permission created successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission.',
  })
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
  // Authentication:
  // - JWT access token required.
  //
  // Authorization:
  // - permission:activate
  //
  // ---------------------------------------------------------------------------

  @Patch(':permissionPublicId/activate')
  @RequirePermissions('permission:activate')
  @ApiOperation({
    summary: 'Activate a Permission',
    description:
      'Activates an existing Permission identified by its public identifier.',
  })
  @ApiParam({
    name: 'permissionPublicId',
    description: 'Public identifier of the Permission.',
    type: String,
    example: 'PERM-5GH3MK',
  })
  @ApiBody({
    type: ActivatePermissionRequestDto,
  })
  @ApiOkResponse({
    description: 'Permission activated successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission.',
  })
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
  // Authentication:
  // - JWT access token required.
  //
  // Authorization:
  // - permission:deactivate
  //
  // System-Permission protection remains inside PermissionEntity.
  //
  // ---------------------------------------------------------------------------

  @Patch(':permissionPublicId/deactivate')
  @RequirePermissions('permission:deactivate')
  @ApiOperation({
    summary: 'Deactivate a Permission',
    description:
      'Deactivates an existing Permission identified by its public identifier.',
  })
  @ApiParam({
    name: 'permissionPublicId',
    description: 'Public identifier of the Permission.',
    type: String,
    example: 'PERM-5GH3MK',
  })
  @ApiBody({
    type: DeactivatePermissionRequestDto,
  })
  @ApiOkResponse({
    description: 'Permission deactivated successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission.',
  })
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
