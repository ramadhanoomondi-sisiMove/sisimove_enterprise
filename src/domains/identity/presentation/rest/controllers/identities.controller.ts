// -----------------------------------------------------------------------------
// Identity — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Identity aggregate operations.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// Responsibilities:
// - HTTP transport;
// - DTO validation;
// - conversion from transport primitives to domain value objects;
// - dispatching application commands and queries;
// - mapping domain results to transport responses.
//
// The controller contains no domain behavior.
//
// Domain behavior remains inside IdentityAggregate.
// Application orchestration remains inside command/query handlers.
// Persistence remains behind IdentityRepository.
//
// IdentityRoleEntity is owned by IdentityAggregate and is therefore returned
// through IdentityResponseMapper.
//
// Role remains a separate aggregate and is referenced only through its opaque
// Role public identifier.
//
// Verification, Authentication, Session, Device, Recovery, OTP Challenge,
// Permission, and RolePermission remain separate aggregate boundaries.
//
// -----------------------------------------------------------------------------
//
// Physical-world identity lifecycle:
//
// 1. Create identity
// 2. Identify / retrieve identity
// 3. Maintain identity contact information
// 4. Manage identity lifecycle
// 5. Manage identity roles
//
// Identity lifecycle:
//
// PENDING ───────► ACTIVE
//     │               │
//     │               ▼
//     └──────────► SUSPENDED
//                         │
//                         ▼
//                       ACTIVE
//
// PENDING / ACTIVE / SUSPENDED ───────► CLOSED
//
// CLOSED is terminal.
//
// -----------------------------------------------------------------------------
//
// Security boundary:
//
// Identity creation is intentionally unauthenticated because registration
// creates the identity that may later become an authenticated principal.
//
// Activation is also intentionally unauthenticated because activation enables
// the identity's access and therefore cannot require an already-established
// authenticated principal.
//
// Operations against an existing identity are authenticated and authorized
// according to their specific capability.
//
// No controller-level guard is used so that public and protected operations
// can coexist explicitly within the same resource.
//
// -----------------------------------------------------------------------------
//
// Temporal responsibility:
//
// Mutation timestamps are domain facts.
//
// The controller does NOT accept or construct:
// - activatedAt;
// - suspendedAt;
// - closedAt;
// - changedAt;
// - assignedAt;
// - revokedAt.
//
// Those timestamps are determined by IdentityAggregate at the moment the
// corresponding successful mutation occurs.
//
// Business-effective timestamps such as role expiration remain valid inputs
// because they represent requested business policy rather than the occurrence
// time of the mutation.
//
// -----------------------------------------------------------------------------
//
// Application message metadata:
//
// correlationId and causationId are NOT public HTTP DTO fields.
//
// For a direct HTTP command:
//
// - correlationId is generated at the HTTP/application boundary;
// - causationId is omitted because there is no preceding command or event.
//
// These values are propagated into the application command and subsequently
// into domain events where applicable.
//
// -----------------------------------------------------------------------------
//
// Identity classification:
//
// IdentityType is intentionally absent.
//
// Every Identity in the current SisiMove platform represents a user, so an
// identity classification provides no additional business value.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Node
// -----------------------------------------------------------------------------

import { randomUUID } from 'node:crypto';

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
  ActivateIdentityCommand,
  AssignIdentityRoleCommand,
  ChangeIdentityEmailCommand,
  ChangeIdentityPhoneNumberCommand,
  CloseIdentityCommand,
  CreateIdentityCommand,
  RevokeIdentityRoleCommand,
  SuspendIdentityCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetIdentityByEmailQuery,
  GetIdentityByPhoneNumberQuery,
  GetIdentityQuery,
  GetIdentityRolesQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { IdentityAggregate } from '../../../domain/aggregates/identity.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import type { IdentityRoleEntity } from '../../../domain/entities/identity-role.entity';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  IdentityEmail,
  IdentityPhoneNumber,
  IdentityPublicId,
  IdentityRoleRolePublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  AssignIdentityRoleRequestDto,
  ChangeIdentityEmailRequestDto,
  ChangeIdentityPhoneNumberRequestDto,
  CreateIdentityRequestDto,
  RevokeIdentityRoleRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import {
  GetIdentityByEmailQueryDto,
  GetIdentityByPhoneNumberQueryDto,
  GetIdentityQueryDto,
  GetIdentityRolesQueryDto,
} from '../queries';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { IdentityResponseMapper } from '../mappers/identity.response.mapper';

// -----------------------------------------------------------------------------
// Controller
// -----------------------------------------------------------------------------

@ApiTags('Identities')
@Controller('identities')
export class IdentitiesController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Command Handlers
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.CREATE_IDENTITY)
    private readonly createIdentityHandler: CommandHandler<
      CreateIdentityCommand,
      IdentityAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.ACTIVATE_IDENTITY)
    private readonly activateIdentityHandler: CommandHandler<
      ActivateIdentityCommand,
      IdentityAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.SUSPEND_IDENTITY)
    private readonly suspendIdentityHandler: CommandHandler<
      SuspendIdentityCommand,
      IdentityAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.CLOSE_IDENTITY)
    private readonly closeIdentityHandler: CommandHandler<
      CloseIdentityCommand,
      IdentityAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.CHANGE_IDENTITY_EMAIL)
    private readonly changeIdentityEmailHandler: CommandHandler<
      ChangeIdentityEmailCommand,
      IdentityAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.CHANGE_IDENTITY_PHONE_NUMBER)
    private readonly changeIdentityPhoneNumberHandler: CommandHandler<
      ChangeIdentityPhoneNumberCommand,
      IdentityAggregate
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.ASSIGN_IDENTITY_ROLE)
    private readonly assignIdentityRoleHandler: CommandHandler<
      AssignIdentityRoleCommand,
      IdentityRoleEntity
    >,

    @Inject(IDENTITY_TOKENS.COMMAND_HANDLERS.REVOKE_IDENTITY_ROLE)
    private readonly revokeIdentityRoleHandler: CommandHandler<
      RevokeIdentityRoleCommand,
      IdentityAggregate
    >,

    // -------------------------------------------------------------------------
    // Query Handlers
    // -------------------------------------------------------------------------

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_IDENTITY)
    private readonly getIdentityHandler: QueryHandler<
      GetIdentityQuery,
      IdentityAggregate | null
    >,

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_IDENTITY_BY_EMAIL)
    private readonly getIdentityByEmailHandler: QueryHandler<
      GetIdentityByEmailQuery,
      IdentityAggregate | null
    >,

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_IDENTITY_BY_PHONE_NUMBER)
    private readonly getIdentityByPhoneNumberHandler: QueryHandler<
      GetIdentityByPhoneNumberQuery,
      IdentityAggregate | null
    >,

    @Inject(IDENTITY_TOKENS.QUERY_HANDLERS.GET_IDENTITY_ROLES)
    private readonly getIdentityRolesHandler: QueryHandler<
      GetIdentityRolesQuery,
      readonly IdentityRoleEntity[]
    >,
  ) {}

  // ===========================================================================
  // Identity Creation
  // ===========================================================================
  //
  // Registration is the entry point into the identity lifecycle.
  //
  // No authentication guard is applied because the identity does not yet
  // necessarily exist as an authenticated principal.
  //
  // Result:
  //
  //     NEW IDENTITY → PENDING
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Identity
  // ---------------------------------------------------------------------------

  @Post()
  public async create(
    @Body() dto: CreateIdentityRequestDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    // -------------------------------------------------------------------------
    // Application Message Metadata
    // -------------------------------------------------------------------------
    //
    // A direct HTTP registration request starts a new application operation.
    // Therefore it receives a new correlation identifier and has no causation
    // identifier.
    //

    const correlationId = randomUUID();

    // -------------------------------------------------------------------------
    // Create Command
    // -------------------------------------------------------------------------

    const command = new CreateIdentityCommand(
      // -----------------------------------------------------------------------
      // Identity Email
      // -----------------------------------------------------------------------

      IdentityEmail.create(dto.email),

      // -----------------------------------------------------------------------
      // Identity Phone Number
      // -----------------------------------------------------------------------

      IdentityPhoneNumber.create(dto.phoneNumber),

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      correlationId,
    );

    // -------------------------------------------------------------------------
    // Execute
    // -------------------------------------------------------------------------

    const aggregate = await this.createIdentityHandler.execute(command);

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Identity Identification / Retrieval
  // ===========================================================================
  //
  // Existing identity information is protected.
  //
  // Primary lookup:
  //
  //     identityPublicId
  //
  // Secondary lookup:
  //
  //     email
  //     phone number
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Activate Identity
  // ---------------------------------------------------------------------------
  //
  // Activation is intentionally public.
  //
  // The Identity is identified exclusively by the route parameter:
  //
  //     PATCH /api/v1/identities/{identityPublicId}/activate
  //
  // No request body is required.
  //
  // The application command contains only the Identity public identifier.
  //
  // The aggregate determines activatedAt when activation succeeds.
  //
  // ---------------------------------------------------------------------------

  @Patch(':identityPublicId/activate')
  public async activate(
    @Param('identityPublicId') identityPublicId: string,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    const command = new ActivateIdentityCommand(
      new IdentityPublicId(identityPublicId),
    );

    const aggregate = await this.activateIdentityHandler.execute(command);

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Identity
  // ---------------------------------------------------------------------------

  @Get(':identityPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:read')
  public async get(
    @Param() dto: GetIdentityQueryDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse> | null> {
    const query = new GetIdentityQuery(
      new IdentityPublicId(dto.identityPublicId),
    );

    const aggregate = await this.getIdentityHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Identity By Email
  // ---------------------------------------------------------------------------

  @Get('by-email/:email')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:read')
  public async getByEmail(
    @Param() dto: GetIdentityByEmailQueryDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse> | null> {
    const query = new GetIdentityByEmailQuery(IdentityEmail.create(dto.email));

    const aggregate = await this.getIdentityByEmailHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Identity By Phone Number
  // ---------------------------------------------------------------------------

  @Get('by-phone-number/:phoneNumber')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:read')
  public async getByPhoneNumber(
    @Param() dto: GetIdentityByPhoneNumberQueryDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse> | null> {
    const query = new GetIdentityByPhoneNumberQuery(
      IdentityPhoneNumber.create(dto.phoneNumber),
    );

    const aggregate = await this.getIdentityByPhoneNumberHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Identity Contact Information
  // ===========================================================================
  //
  // Contact information is part of the identity record and may be maintained
  // throughout the identity lifecycle.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Change Identity Email
  // ---------------------------------------------------------------------------

  @Patch(':identityPublicId/email')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:change-email')
  public async changeEmail(
    @Param('identityPublicId') identityPublicId: string,
    @Body() dto: ChangeIdentityEmailRequestDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    const command = new ChangeIdentityEmailCommand(
      // -----------------------------------------------------------------------
      // Identity Public ID
      // -----------------------------------------------------------------------

      new IdentityPublicId(identityPublicId),

      // -----------------------------------------------------------------------
      // New Email
      // -----------------------------------------------------------------------

      IdentityEmail.create(dto.email),

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      randomUUID(),
    );

    const aggregate = await this.changeIdentityEmailHandler.execute(command);

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Change Identity Phone Number
  // ---------------------------------------------------------------------------

  @Patch(':identityPublicId/phone-number')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:change-phone-number')
  public async changePhoneNumber(
    @Param('identityPublicId') identityPublicId: string,
    @Body() dto: ChangeIdentityPhoneNumberRequestDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    const command = new ChangeIdentityPhoneNumberCommand(
      // -----------------------------------------------------------------------
      // Identity Public ID
      // -----------------------------------------------------------------------

      new IdentityPublicId(identityPublicId),

      // -----------------------------------------------------------------------
      // New Phone Number
      // -----------------------------------------------------------------------

      IdentityPhoneNumber.create(dto.phoneNumber),

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      randomUUID(),
    );

    const aggregate =
      await this.changeIdentityPhoneNumberHandler.execute(command);

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Identity Lifecycle
  // ===========================================================================
  //
  // Lifecycle transitions are privileged operations against an existing
  // identity.
  //
  // PENDING → ACTIVE
  //
  // ACTIVE → SUSPENDED
  //
  // SUSPENDED → ACTIVE
  //
  // PENDING / ACTIVE / SUSPENDED → CLOSED
  //
  // CLOSED is terminal.
  //
  // Mutation timestamps are determined by IdentityAggregate.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Suspend Identity
  // ---------------------------------------------------------------------------

  @Patch(':identityPublicId/suspend')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:suspend')
  public async suspend(
    @Param('identityPublicId') identityPublicId: string,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    const command = new SuspendIdentityCommand(
      // -----------------------------------------------------------------------
      // Identity Public ID
      // -----------------------------------------------------------------------

      new IdentityPublicId(identityPublicId),

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      randomUUID(),
    );

    const aggregate = await this.suspendIdentityHandler.execute(command);

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Close Identity
  // ---------------------------------------------------------------------------

  @Patch(':identityPublicId/close')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:close')
  public async close(
    @Param('identityPublicId') identityPublicId: string,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    const command = new CloseIdentityCommand(
      // -----------------------------------------------------------------------
      // Identity Public ID
      // -----------------------------------------------------------------------

      new IdentityPublicId(identityPublicId),

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      randomUUID(),
    );

    const aggregate = await this.closeIdentityHandler.execute(command);

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Identity Roles
  // ===========================================================================
  //
  // Roles represent responsibilities/capabilities assigned to an identity.
  //
  // IdentityRoleEntity remains owned by IdentityAggregate.
  //
  // Role remains a separate aggregate.
  //
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Identity Roles
  // ---------------------------------------------------------------------------

  @Get(':identityPublicId/roles')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity-role:read')
  public async getRoles(
    @Param() dto: GetIdentityRolesQueryDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.rolesFromEntities>> {
    const query = new GetIdentityRolesQuery(
      new IdentityPublicId(dto.identityPublicId),
    );

    const identityRoles = await this.getIdentityRolesHandler.execute(query);

    return IdentityResponseMapper.rolesFromEntities(identityRoles);
  }

  // ---------------------------------------------------------------------------
  // Assign Identity Role
  // ---------------------------------------------------------------------------
  //
  // assignedByPublicId = actor/context
  // expiresAt          = business policy input
  // assignedAt         = domain fact, therefore not accepted here
  //
  // ---------------------------------------------------------------------------

  @Post(':identityPublicId/roles')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity-role:assign')
  public async assignRole(
    @Param('identityPublicId') identityPublicId: string,
    @Body() dto: AssignIdentityRoleRequestDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.roleFromEntity>> {
    const command = new AssignIdentityRoleCommand(
      // -----------------------------------------------------------------------
      // Identity Public ID
      // -----------------------------------------------------------------------

      new IdentityPublicId(identityPublicId),

      // -----------------------------------------------------------------------
      // Role Public ID
      // -----------------------------------------------------------------------

      new IdentityRoleRolePublicId(dto.rolePublicId),

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      randomUUID(),

      // -----------------------------------------------------------------------
      // Assigning Identity Public ID
      // -----------------------------------------------------------------------

      dto.assignedByPublicId !== undefined
        ? new IdentityPublicId(dto.assignedByPublicId)
        : undefined,

      // -----------------------------------------------------------------------
      // Expiration
      // -----------------------------------------------------------------------

      dto.expiresAt !== undefined ? new Date(dto.expiresAt) : undefined,
    );

    const identityRole = await this.assignIdentityRoleHandler.execute(command);

    return IdentityResponseMapper.roleFromEntity(identityRole);
  }

  // ---------------------------------------------------------------------------
  // Revoke Identity Role
  // ---------------------------------------------------------------------------
  //
  // revokedByPublicId = actor/context
  // reason             = business/contextual input
  // revokedAt          = domain fact, therefore not accepted here
  //
  // ---------------------------------------------------------------------------

  @Patch(':identityPublicId/roles/:rolePublicId/revoke')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity-role:revoke')
  public async revokeRole(
    @Param('identityPublicId') identityPublicId: string,
    @Param('rolePublicId') rolePublicId: string,
    @Body() dto: RevokeIdentityRoleRequestDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    const command = new RevokeIdentityRoleCommand(
      // -----------------------------------------------------------------------
      // Identity Public ID
      // -----------------------------------------------------------------------

      new IdentityPublicId(identityPublicId),

      // -----------------------------------------------------------------------
      // Role Public ID
      // -----------------------------------------------------------------------

      new IdentityRoleRolePublicId(rolePublicId),

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      randomUUID(),

      // -----------------------------------------------------------------------
      // Revoking Identity Public ID
      // -----------------------------------------------------------------------

      dto.revokedByPublicId !== undefined
        ? new IdentityPublicId(dto.revokedByPublicId)
        : undefined,

      // -----------------------------------------------------------------------
      // Reason
      // -----------------------------------------------------------------------

      dto.reason,
    );

    const aggregate = await this.revokeIdentityRoleHandler.execute(command);

    return IdentityResponseMapper.toResponse(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default IdentitiesController;
