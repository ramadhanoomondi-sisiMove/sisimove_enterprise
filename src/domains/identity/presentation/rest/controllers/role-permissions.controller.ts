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
@UseGuards(JwtAuthGuard, PermissionsGuard)
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
  // GetRolePermissionQuery:
  //
  //   rolePermissionPublicId
  //
  // The RolePermission assignment is resolved through its own public
  // identifier.
  //

  @Get(':rolePermissionPublicId')
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
  // GetRolePermissionsQuery:
  //
  //   no filters
  //
  // This query intentionally retrieves the complete RolePermission collection.
  //
  // Role- or Permission-scoped retrieval belongs to explicitly named
  // application queries such as:
  //
  //   GetRolePermissionsByRoleQuery
  //   GetRolePermissionsByPermissionQuery
  //

  @Get()
  @RequirePermissions('role-permission:read')
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
  // AssignRolePermissionCommand:
  //
  //   roleId
  //   permissionId
  //   assignedAt
  //   correlationId
  //   causationId?
  //
  // RolePermissionPublicId is generated by the domain/entity creation process.
  //
  // The application handler is responsible for resolving the referenced Role
  // and Permission and coordinating the assignment operation.
  //

  @Post()
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
  // RevokeRolePermissionCommand:
  //
  //   rolePermissionPublicId
  //   revokedAt
  //   correlationId
  //   causationId?
  //
  // The relationship itself is targeted by RolePermissionPublicId.
  //
  // Revocation does NOT modify the Role or Permission aggregates.
  //

  @Patch(':rolePermissionPublicId/revoke')
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
