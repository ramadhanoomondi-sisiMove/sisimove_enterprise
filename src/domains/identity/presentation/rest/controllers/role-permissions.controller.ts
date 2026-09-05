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
// SUPPORTED OPERATIONS
// -----------------------------------------------------------------------------
//
// Assignment:
//
//     POST /role-permissions
//
// Revocation:
//
//     PATCH /role-permissions/:rolePermissionPublicId/revoke
//
// Queries:
//
//     GET /role-permissions
//     GET /role-permissions/:rolePermissionPublicId
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATION & AUTHORIZATION
// -----------------------------------------------------------------------------
//
// RolePermission is authorization infrastructure.
//
// All endpoints therefore require:
//
// Authentication:
//
//     JwtAuthGuard
//
// Authorization:
//
//     PermissionsGuard
//     @RequirePermissions(...)
//
// Required permissions:
//
//     role-permission:read
//     role-permission:assign
//     role-permission:revoke
//
// Guards are intentionally applied per endpoint.
//
// There is NO class-level @UseGuards declaration.
//
// Swagger documentation does not perform authorization. Runtime guards remain
// the actual security boundary.
//
// -----------------------------------------------------------------------------
//
// APPLICATION MESSAGE METADATA
// -----------------------------------------------------------------------------
//
// This controller preserves the existing RolePermission command contracts.
//
// Therefore:
//
// - DTO-provided correlationId remains DTO-controlled;
// - DTO-provided causationId remains DTO-controlled;
// - DTO-provided assignedAt/revokedAt remains DTO-controlled.
//
// No command contract is changed here.
//
// If those fields are intended to become server-generated domain facts, that
// should be changed at the command/application boundary rather than silently
// changing the controller contract.
//
// -----------------------------------------------------------------------------
//
// DOMAIN VALUE OBJECTS
// -----------------------------------------------------------------------------
//
// Transport primitives are converted before entering the application layer:
//
//     roleId
//         └── RolePermissionRolePublicId
//
//     permissionId
//         └── RolePermissionPermissionPublicId
//
//     rolePermissionPublicId
//         └── RolePermissionPublicId
//
// The controller does not interpret the meaning of these identifiers.
//
// =============================================================================

// -----------------------------------------------------------------------------
// Node
// -----------------------------------------------------------------------------

// No Node-specific imports required.

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
  // GET /role-permissions/:rolePermissionPublicId
  //
  // Authentication:
  //
  //     JwtAuthGuard
  //
  // Authorization:
  //
  //     role-permission:read
  //
  // ---------------------------------------------------------------------------

  @Get(':rolePermissionPublicId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get RolePermission',
    description:
      'Returns a RolePermission assignment identified by its public identifier.',
  })
  @ApiParam({
    name: 'rolePermissionPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the RolePermission assignment.',
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('role-permission:read')
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
  // GET /role-permissions
  //
  // Authentication:
  //
  //     JwtAuthGuard
  //
  // Authorization:
  //
  //     role-permission:read
  //
  // ---------------------------------------------------------------------------

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List RolePermissions',
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('role-permission:read')
  public async getMany(): Promise<RolePermissionResponse[]> {
    const query = new GetRolePermissionsQuery();

    const aggregates = await this.getRolePermissionsHandler.execute(query);

    return aggregates.map((aggregate) =>
      RolePermissionResponseMapper.toResponse(aggregate),
    );
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Assign RolePermission
  // ---------------------------------------------------------------------------
  //
  // POST /role-permissions
  //
  // Authentication:
  //
  //     JwtAuthGuard
  //
  // Authorization:
  //
  //     role-permission:assign
  //
  // The controller only translates transport data into the existing command.
  //
  // ---------------------------------------------------------------------------

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Assign Permission to Role',
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('role-permission:assign')
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
  // PATCH /role-permissions/:rolePermissionPublicId/revoke
  //
  // Authentication:
  //
  //     JwtAuthGuard
  //
  // Authorization:
  //
  //     role-permission:revoke
  //
  // The relationship itself is targeted by RolePermissionPublicId.
  //
  // Revocation does not modify the Role or Permission aggregates.
  //
  // ---------------------------------------------------------------------------

  @Patch(':rolePermissionPublicId/revoke')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Revoke RolePermission',
    description:
      'Revokes an existing RolePermission relationship identified by its public identifier.',
  })
  @ApiParam({
    name: 'rolePermissionPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the RolePermission assignment.',
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('role-permission:revoke')
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
