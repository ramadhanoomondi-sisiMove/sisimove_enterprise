// -----------------------------------------------------------------------------
// Identity — Role Permission HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for RolePermission aggregate operations.
//
// Aggregate boundary:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// RolePermission represents one authorization relationship:
//
// Role ───────────── Permission
//          │
//          ▼
//    RolePermission
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
// - RolePermissionAggregate;
// - RolePermissionEntity.
//
// Application orchestration:
// - command handlers;
// - query handlers.
//
// Persistence:
// - RolePermissionRepository.
//
// IMPORTANT:
//
// RolePermission is an independent relationship aggregate.
//
// This controller does NOT:
//
// - create or modify Role;
// - create or modify Permission;
// - assign Roles to Identities;
// - evaluate authorization;
// - access Prisma;
// - perform persistence directly;
// - decide Role eligibility;
// - decide Permission eligibility.
//
// Cross-aggregate coordination and authorization policies belong to the
// application/domain coordination boundary.
//
// -----------------------------------------------------------------------------
//
// Supported RolePermission operations:
//
// Assignment:
// - assign Permission to Role.
//
// Revocation:
// - revoke Permission from Role.
//
// Queries:
// - get RolePermission;
// - get RolePermissions.
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
  AssignRolePermissionCommand,
  RevokeRolePermissionCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetRolePermissionQuery,
  GetRolePermissionsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { RolePermissionAggregate } from '../../../domain/aggregates/role-permission.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  RolePermissionPermissionPublicId,
  RolePermissionPublicId,
  RolePermissionRolePublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  AssignRolePermissionRequestDto,
  RevokeRolePermissionRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import { GetRolePermissionQueryDto } from '../queries';

// -----------------------------------------------------------------------------
// Presentation — Response Models
// -----------------------------------------------------------------------------

import type { RolePermissionResponse } from '../mappers/role-permission.response.mapper';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { RolePermissionResponseMapper } from '../mappers/role-permission.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Role Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('role-permissions')
export class RolePermissionsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // RolePermission Command Handlers
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.ASSIGN_ROLE_PERMISSION)
    private readonly assignRolePermissionHandler: CommandHandler<
      AssignRolePermissionCommand,
      RolePermissionAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.REVOKE_ROLE_PERMISSION)
    private readonly revokeRolePermissionHandler: CommandHandler<
      RevokeRolePermissionCommand,
      RolePermissionAggregate
    >,

    // -------------------------------------------------------------------------
    // RolePermission Query Handlers
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_ROLE_PERMISSION)
    private readonly getRolePermissionHandler: QueryHandler<
      GetRolePermissionQuery,
      RolePermissionAggregate | null
    >,

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_ROLE_PERMISSIONS)
    private readonly getRolePermissionsHandler: QueryHandler<
      GetRolePermissionsQuery,
      readonly RolePermissionAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get RolePermission
  // ---------------------------------------------------------------------------
  //
  // Authentication:
  // - JWT access token required.
  //
  // Authorization:
  // - role-permission:read
  //
  // ---------------------------------------------------------------------------

  @Get(':rolePermissionPublicId')
  @RequirePermissions('role-permission:read')
  @ApiOperation({
    summary: 'Get a RolePermission',
    description:
      'Returns a RolePermission assignment identified by its public identifier.',
  })
  @ApiParam({
    name: 'rolePermissionPublicId',
    description: 'Public identifier of the RolePermission assignment.',
    type: String,
    example: 'RP-5GH3MK',
  })
  @ApiOkResponse({
    description: 'RolePermission assignment retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission.',
  })
  public async get(
    @Param() dto: GetRolePermissionQueryDto,
  ): Promise<RolePermissionResponse | null> {
    const query = new GetRolePermissionQuery(
      new RolePermissionPublicId(dto.rolePermissionPublicId),
    );

    const aggregate = await this.getRolePermissionHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return RolePermissionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get RolePermissions
  // ---------------------------------------------------------------------------
  //
  // Authentication:
  // - JWT access token required.
  //
  // Authorization:
  // - role-permission:read
  //
  // This query intentionally retrieves the complete RolePermission collection.
  //
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('role-permission:read')
  @ApiOperation({
    summary: 'Get all RolePermissions',
    description:
      'Returns the complete collection of RolePermission assignments.',
  })
  @ApiOkResponse({
    description: 'RolePermission assignments retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission.',
  })
  public async getMany(): Promise<RolePermissionResponse[]> {
    const query = new GetRolePermissionsQuery();

    const aggregates = await this.getRolePermissionsHandler.execute(query);

    return aggregates.map((aggregate) =>
      RolePermissionResponseMapper.toResponse(aggregate),
    );
  }

  // ===========================================================================
  // RolePermission Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Assign RolePermission
  // ---------------------------------------------------------------------------
  //
  // Authentication:
  // - JWT access token required.
  //
  // Authorization:
  // - role-permission:assign
  //
  // Domain/application behavior remains unchanged.
  //
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('role-permission:assign')
  @ApiOperation({
    summary: 'Assign a Permission to a Role',
    description:
      'Creates a RolePermission relationship between an existing Role and Permission.',
  })
  @ApiBody({
    type: AssignRolePermissionRequestDto,
  })
  @ApiCreatedResponse({
    description: 'RolePermission assignment created successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission.',
  })
  public async assign(
    @Body() dto: AssignRolePermissionRequestDto,
  ): Promise<RolePermissionResponse> {
    const command = new AssignRolePermissionCommand(
      new RolePermissionRolePublicId(dto.roleId),
      new RolePermissionPermissionPublicId(dto.permissionId),
      dto.assignedAt !== undefined ? new Date(dto.assignedAt) : undefined,
      dto.correlationId,
      dto.causationId,
    );

    const aggregate = await this.assignRolePermissionHandler.execute(command);

    return RolePermissionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Revoke RolePermission
  // ---------------------------------------------------------------------------
  //
  // Authentication:
  // - JWT access token required.
  //
  // Authorization:
  // - role-permission:revoke
  //
  // The relationship itself is targeted by RolePermissionPublicId.
  //
  // Revocation does NOT modify the Role or Permission aggregates.
  //
  // ---------------------------------------------------------------------------

  @Patch(':rolePermissionPublicId/revoke')
  @RequirePermissions('role-permission:revoke')
  @ApiOperation({
    summary: 'Revoke a RolePermission',
    description:
      'Revokes an existing RolePermission relationship identified by its public identifier.',
  })
  @ApiParam({
    name: 'rolePermissionPublicId',
    description: 'Public identifier of the RolePermission assignment.',
    type: String,
    example: 'RP-5GH3MK',
  })
  @ApiBody({
    type: RevokeRolePermissionRequestDto,
  })
  @ApiOkResponse({
    description: 'RolePermission assignment revoked successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission.',
  })
  public async revoke(
    @Param('rolePermissionPublicId') rolePermissionPublicId: string,
    @Body() dto: RevokeRolePermissionRequestDto,
  ): Promise<RolePermissionResponse> {
    const command = new RevokeRolePermissionCommand(
      new RolePermissionPublicId(rolePermissionPublicId),
      dto.revokedAt !== undefined ? new Date(dto.revokedAt) : undefined,
      dto.correlationId,
      dto.causationId,
    );

    const aggregate = await this.revokeRolePermissionHandler.execute(command);

    return RolePermissionResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RolePermissionsController;
