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
// SUPPORTED PERMISSION OPERATIONS
// -----------------------------------------------------------------------------
//
// Permission definition:
//
//     POST /permissions
//
// Permission queries:
//
//     GET /permissions
//     GET /permissions/:permissionPublicId
//
// Permission lifecycle:
//
//     PATCH /permissions/:permissionPublicId/activate
//     PATCH /permissions/:permissionPublicId/deactivate
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATION & AUTHORIZATION
// -----------------------------------------------------------------------------
//
// Permission definitions are authorization infrastructure.
//
// All Permission endpoints therefore require:
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
//     permission:read
//     permission:create
//     permission:activate
//     permission:deactivate
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
// This controller preserves the existing Permission command contracts.
//
// Therefore:
//
// - correlationId remains supplied according to the existing DTO/command
//   contract;
// - causationId remains supplied according to the existing DTO/command
//   contract;
// - activatedAt remains supplied according to the existing DTO/command
//   contract;
// - deactivatedAt remains supplied according to the existing DTO/command
//   contract.
//
// No application command contract is changed by this controller.
//
// -----------------------------------------------------------------------------
//
// DOMAIN VALUE OBJECTS
// -----------------------------------------------------------------------------
//
// Transport primitives are converted before entering the application layer:
//
//     code
//         └── PermissionCode
//
//     resource
//         └── PermissionResource
//
//     action
//         └── PermissionAction
//
//     permissionPublicId
//         └── PermissionPublicId
//
// This keeps transport DTOs independent from domain behavior while ensuring
// commands receive validated domain representations.
//
// -----------------------------------------------------------------------------
//
// SECURITY BOUNDARY
// -----------------------------------------------------------------------------
//
// This controller does NOT:
//
// - verify JWTs;
// - decode JWTs;
// - inspect Authorization headers;
// - resolve permissions;
// - evaluate authorization;
// - access Prisma;
// - access repositories;
// - directly mutate PermissionAggregate;
// - assign Permissions to Roles;
// - revoke Permissions from Roles;
// - assign Roles to Identities;
// - revoke Roles from Identities.
//
// =============================================================================

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
  // GET /permissions/:permissionPublicId
  //
  // Authentication:
  //
  //     JwtAuthGuard
  //
  // Authorization:
  //
  //     permission:read
  //
  // ---------------------------------------------------------------------------

  @Get(':permissionPublicId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get Permission',
    description:
      'Returns a Permission identified by its aggregate public identifier.',
  })
  @ApiParam({
    name: 'permissionPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the Permission.',
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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
  // GET /permissions
  //
  // Authentication:
  //
  //     JwtAuthGuard
  //
  // Authorization:
  //
  //     permission:read
  //
  // This query intentionally retrieves the complete Permission collection.
  //
  // Specialized collection semantics remain represented by specialized
  // application queries rather than transport-level filtering on this query.
  //
  // ---------------------------------------------------------------------------

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'List Permissions',
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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
  // POST /permissions
  //
  // Business inputs remain defined by CreatePermissionRequestDto.
  //
  // PermissionPublicId is generated by PermissionEntity.
  //
  // ---------------------------------------------------------------------------

  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create Permission',
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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
  // PATCH /permissions/:permissionPublicId/activate
  //
  // The existing command contract is preserved.
  //
  // ---------------------------------------------------------------------------

  @Patch(':permissionPublicId/activate')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Activate Permission',
    description:
      'Activates an existing Permission identified by its public identifier. Permission lifecycle rules remain inside the application/domain boundary.',
  })
  @ApiParam({
    name: 'permissionPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the Permission.',
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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
  // PATCH /permissions/:permissionPublicId/deactivate
  //
  // System-Permission protection remains inside PermissionEntity.
  //
  // ---------------------------------------------------------------------------

  @Patch(':permissionPublicId/deactivate')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Deactivate Permission',
    description:
      'Deactivates an existing Permission identified by its public identifier. System-permission protection and lifecycle rules remain inside the application/domain boundary.',
  })
  @ApiParam({
    name: 'permissionPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the Permission.',
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
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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
