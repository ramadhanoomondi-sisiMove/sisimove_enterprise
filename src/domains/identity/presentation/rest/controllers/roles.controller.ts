// -----------------------------------------------------------------------------
// Identity — Role HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Role aggregate operations.
//
// Aggregate boundary:
//
// RoleAggregate
// └── RoleEntity
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
// - RoleAggregate;
// - RoleEntity.
//
// Application orchestration:
// - command handlers;
// - query handlers.
//
// Persistence:
// - RoleRepository.
//
// IMPORTANT:
//
// Role is an aggregate root.
//
// Role relationships are separate boundaries:
//
// Identity
// └── IdentityRole
//
// Role
// └── RolePermission
//
// This controller does NOT:
//
// - assign Roles to Identities;
// - revoke Roles from Identities;
// - assign Permissions to Roles;
// - revoke Permissions from Roles;
// - evaluate authorization;
// - access Prisma;
// - perform persistence directly.
//
// Those operations belong to their respective application/domain boundaries.
//
// -----------------------------------------------------------------------------
//
// Supported Role operations:
//
// Role definition:
// - create role.
//
// Role lifecycle:
// - activate role;
// - deactivate role.
//
// Role queries:
// - get role;
// - get roles.
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
  Query,
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
  ActivateRoleCommand,
  CreateRoleCommand,
  DeactivateRoleCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetRoleQuery,
  GetRolesQuery,
  GetRolesQueryFilters,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { RoleAggregate } from '../../../domain/aggregates/role.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  RoleCode,
  RoleName,
  RolePublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  ActivateRoleRequestDto,
  CreateRoleRequestDto,
  DeactivateRoleRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import { GetRoleQueryDto, GetRolesQueryDto } from '../queries';

// -----------------------------------------------------------------------------
// Presentation — Response Models
// -----------------------------------------------------------------------------

import type { RoleResponse } from '../mappers/role.response.mapper';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { RoleResponseMapper } from '../mappers/role.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Role Command Handlers
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_ROLE)
    private readonly createRoleHandler: CommandHandler<
      CreateRoleCommand,
      RoleAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.ACTIVATE_ROLE)
    private readonly activateRoleHandler: CommandHandler<
      ActivateRoleCommand,
      RoleAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.DEACTIVATE_ROLE)
    private readonly deactivateRoleHandler: CommandHandler<
      DeactivateRoleCommand,
      RoleAggregate
    >,

    // -------------------------------------------------------------------------
    // Role Query Handlers
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_ROLE)
    private readonly getRoleHandler: QueryHandler<
      GetRoleQuery,
      RoleAggregate | null
    >,

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_ROLES)
    private readonly getRolesHandler: QueryHandler<
      GetRolesQuery,
      readonly RoleAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Role
  // ---------------------------------------------------------------------------
  //
  // GetRoleQuery:
  //
  //   rolePublicId
  //
  // The Role is resolved through its aggregate public identifier.
  //

  @Get(':rolePublicId')
  @RequirePermissions('role:read')
  public async get(
    @Param() dto: GetRoleQueryDto,
  ): Promise<RoleResponse | null> {
    const query = new GetRoleQuery(new RolePublicId(dto.rolePublicId));

    const aggregate = await this.getRoleHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return RoleResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Roles
  // ---------------------------------------------------------------------------
  //
  // GetRolesQuery:
  //
  //   filters?
  //
  // Supported transport filters:
  //
  // - isActive;
  // - isSystem;
  // - assignable;
  // - orderByDisplayOrder.
  //
  // The DTO remains transport-specific while the query receives the
  // application-level filter object.
  //

  // =============================================================================
  // Role — Get Many
  // =============================================================================

  @Get()
  @RequirePermissions('role:read')
  public async getMany(
    @Query() dto: GetRolesQueryDto,
  ): Promise<RoleResponse[]> {
    const filters: GetRolesQueryFilters = {};

    if (dto.isActive !== undefined) {
      filters.isActive = dto.isActive;
    }

    if (dto.isSystem !== undefined) {
      filters.isSystem = dto.isSystem;
    }

    if (dto.assignable !== undefined) {
      filters.assignable = dto.assignable;
    }

    if (dto.orderByDisplayOrder !== undefined) {
      filters.orderByDisplayOrder = dto.orderByDisplayOrder;
    }

    const query = new GetRolesQuery(filters);

    const aggregates = await this.getRolesHandler.execute(query);

    return aggregates.map((aggregate) =>
      RoleResponseMapper.toResponse(aggregate),
    );
  }
  // ===========================================================================
  // Role Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Role
  // ---------------------------------------------------------------------------
  //
  // CreateRoleCommand:
  //
  //   code
  //   name
  //   displayOrder
  //   isSystem
  //   description?
  //   correlationId
  //   causationId?
  //
  // RolePublicId is generated by RoleEntity.
  //

  @Post()
  @RequirePermissions('role:create')
  public async create(
    @Body() dto: CreateRoleRequestDto,
  ): Promise<RoleResponse> {
    const command = new CreateRoleCommand(
      RoleCode.create(dto.code),
      RoleName.create(dto.name),
      dto.displayOrder,
      dto.isSystem,
      dto.description,
      dto.correlationId,
      dto.causationId,
    );

    const aggregate = await this.createRoleHandler.execute(command);

    return RoleResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Activate Role
  // ---------------------------------------------------------------------------
  //
  // ActivateRoleCommand:
  //
  //   rolePublicId
  //   correlationId
  //   activatedAt?
  //   causationId?
  //
  // Activation is idempotent at the aggregate level.
  //

  @Patch(':rolePublicId/activate')
  @RequirePermissions('role:activate')
  public async activate(
    @Param('rolePublicId') rolePublicId: string,
    @Body() dto: ActivateRoleRequestDto,
  ): Promise<RoleResponse> {
    const command = new ActivateRoleCommand(
      new RolePublicId(rolePublicId),
      dto.correlationId,
      dto.activatedAt !== undefined ? new Date(dto.activatedAt) : undefined,
      dto.causationId,
    );

    const aggregate = await this.activateRoleHandler.execute(command);

    return RoleResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Deactivate Role
  // ---------------------------------------------------------------------------
  //
  // DeactivateRoleCommand:
  //
  //   rolePublicId
  //   correlationId
  //   deactivatedAt?
  //   causationId?
  //
  // System-role protection remains inside RoleEntity.
  //

  @Patch(':rolePublicId/deactivate')
  @RequirePermissions('role:deactivate')
  public async deactivate(
    @Param('rolePublicId') rolePublicId: string,
    @Body() dto: DeactivateRoleRequestDto,
  ): Promise<RoleResponse> {
    const command = new DeactivateRoleCommand(
      new RolePublicId(rolePublicId),
      dto.correlationId,
      dto.deactivatedAt !== undefined ? new Date(dto.deactivatedAt) : undefined,
      dto.causationId,
    );

    const aggregate = await this.deactivateRoleHandler.execute(command);

    return RoleResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RolesController;
