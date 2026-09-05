// -----------------------------------------------------------------------------
// Identity — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Identity aggregate operations.
//
// Aggregate:
//
//     IdentityAggregate
//     └── IdentityEntity
//         └── IdentityRoleEntity[]
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion of transport primitives into domain value objects;
// - construction of application commands and queries;
// - dispatching application commands and queries;
// - mapping application/domain results into transport responses.
//
// This controller contains NO Identity business rules.
//
// -----------------------------------------------------------------------------
//
// DOMAIN
// -----------------------------------------------------------------------------
//
// IdentityAggregate owns:
//
//     IdentityEntity
//     IdentityRoleEntity[]
//
// Role remains a separate aggregate and is referenced through its opaque
// Role public identifier.
//
// Related aggregates remain separate:
//
//     AuthenticationAggregate
//     SessionAggregate
//     DeviceAggregate
//     RecoveryAggregate
//     OtpChallengeAggregate
//     RoleAggregate
//     PermissionAggregate
//     RolePermissionAggregate
//
// The controller never directly coordinates those aggregates.
//
// -----------------------------------------------------------------------------
//
// IDENTITY LIFECYCLE
// -----------------------------------------------------------------------------
//
//     PENDING ───────► ACTIVE
//         │               │
//         │               ▼
//         └──────────► SUSPENDED
//                             │
//                             ▼
//                           ACTIVE
//
//     PENDING / ACTIVE / SUSPENDED ───────► CLOSED
//
// CLOSED is terminal.
//
// Mutation timestamps such as:
//
// - activatedAt;
// - suspendedAt;
// - closedAt;
//
// are domain facts and are therefore determined by IdentityAggregate.
//
// -----------------------------------------------------------------------------
//
// SECURITY MODEL
// -----------------------------------------------------------------------------
//
// Public:
//
//     POST /identities
//
// Authenticated self-service:
//
//     GET /identities/me
//
// Privileged:
//
//     GET /identities/by-email/:email
//     GET /identities/by-phone-number/:phoneNumber
//
// Protected target-identity operations:
//
//     GET    /identities/:identityPublicId
//     PATCH  /identities/:identityPublicId/activate
//     PATCH  /identities/:identityPublicId/email
//     PATCH  /identities/:identityPublicId/phone-number
//     PATCH  /identities/:identityPublicId/suspend
//     PATCH  /identities/:identityPublicId/close
//     GET    /identities/:identityPublicId/roles
//     POST   /identities/:identityPublicId/roles
//     PATCH  /identities/:identityPublicId/roles/:rolePublicId/revoke
//
// Authentication:
//
//     JwtAuthGuard
//
// Authorization for privileged/target operations:
//
//     PermissionsGuard
//     @RequirePermissions(...)
//
// Guards are deliberately applied per endpoint rather than at controller level.
//
// IMPORTANT:
//
//     GET /identities/me
//
// is authenticated but NOT permission-gated.
//
// The authenticated identity is allowed to retrieve its own Identity through
// the principal established by JwtAuthGuard/JwtStrategy.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT — ACTIVATION
// -----------------------------------------------------------------------------
//
// Activation must never be authorized merely by possession of:
//
//     identityPublicId
//
// If activation is part of a public registration flow, the public activation
// endpoint must instead require a dedicated activation proof such as:
//
//     activation token
//     OTP challenge
//     verified recovery/authentication workflow
//
// The current ActivateIdentityCommand accepts only IdentityPublicId.
//
// Therefore this controller treats activation as an authenticated operation:
//
//     PATCH /identities/:identityPublicId/activate
//
// with:
//
//     identity:activate
//
// Until a dedicated activation-proof workflow exists.
//
// The controller does not invent or manufacture activation credentials.
//
// -----------------------------------------------------------------------------
//
// IDENTITY CREATION
// -----------------------------------------------------------------------------
//
// Registration remains public:
//
//     POST /identities
//
// because the Identity does not yet exist as an authenticated principal.
//
// The command creates the initial identity state:
//
//     HTTP
//       │
//       ▼
//     CreateIdentityCommand
//       │
//       ▼
//     IdentityAggregate
//       │
//       ▼
//     PENDING
//
// -----------------------------------------------------------------------------
//
// NORMAL USER IDENTITY ACCESS
// -----------------------------------------------------------------------------
//
// Normal authenticated clients should use:
//
//     GET /identities/me
//
// The identity is derived from:
//
//     request.user.identityPublicId
//
// The client does not provide an Identity public ID.
//
// This endpoint requires authentication only:
//
//     JwtAuthGuard
//
// It deliberately does NOT require:
//
//     PermissionsGuard
//     identity:read
//
// because self-access is established by the authenticated principal rather
// than by a general target-identity permission.
//
// -----------------------------------------------------------------------------
//
// PRIVILEGED IDENTITY LOOKUPS
// -----------------------------------------------------------------------------
//
// The following endpoints are deliberately treated as privileged:
//
//     GET /identities/by-email/:email
//     GET /identities/by-phone-number/:phoneNumber
//
// These operations can become account-enumeration surfaces.
//
// They therefore require:
//
//     identity:lookup
//
// -----------------------------------------------------------------------------
//
// TARGET IDENTITY ACCESS
// -----------------------------------------------------------------------------
//
// Endpoints containing:
//
//     :identityPublicId
//
// operate against a target Identity.
//
// Possession of that public identifier does not grant authorization.
//
// Permissions answer:
//
//     "May this principal perform this operation?"
//
// Scope answers:
//
//     "May this principal perform it against THIS identity?"
//
// The application layer MUST enforce ownership, administrative scope, or
// delegated authority where required.
//
// The controller does not implement target-identity authorization.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATED IDENTITY
// -----------------------------------------------------------------------------
//
// For authenticated operations, JwtAuthGuard has already validated the access
// token and JwtStrategy has attached:
//
//     request.user.identityPublicId
//
// This controller may use that value as the authenticated actor/context.
//
// It does NOT:
//
// - decode JWTs;
// - verify JWTs;
// - inspect Authorization headers;
// - resolve permissions;
// - load Identity from Prisma.
//
// -----------------------------------------------------------------------------
//
// ACTOR VS TARGET
// -----------------------------------------------------------------------------
//
// Operations such as:
//
//     assign role
//     revoke role
//
// contain two identities:
//
//     target identity
//     authenticated actor
//
// Target:
//
//     /identities/:identityPublicId
//
// Actor:
//
//     request.user.identityPublicId
//
// The actor MUST NOT be accepted from the request body.
//
// -----------------------------------------------------------------------------
//
// CONTACT INFORMATION
// -----------------------------------------------------------------------------
//
// Email and phone-number changes are Identity lifecycle mutations.
//
// The controller converts transport primitives into:
//
//     IdentityEmail
//     IdentityPhoneNumber
//
// The aggregate/application layer remains responsible for:
//
// - uniqueness;
// - lifecycle restrictions;
// - verification requirements;
// - mutation policy.
//
// -----------------------------------------------------------------------------
//
// ROLE MANAGEMENT
// -----------------------------------------------------------------------------
//
// IdentityRoleEntity is owned by IdentityAggregate.
//
// Therefore role assignment and revocation are application operations against
// the Identity aggregate boundary.
//
// Role itself remains a separate aggregate.
//
// The controller transports:
//
//     rolePublicId
//
// as an opaque reference.
//
// Business-effective expiration:
//
//     expiresAt
//
// is valid input because it represents policy.
//
// Mutation timestamps such as:
//
//     assignedAt
//     revokedAt
//
// remain domain facts and are not accepted from HTTP.
//
// -----------------------------------------------------------------------------
//
// APPLICATION MESSAGE METADATA
// -----------------------------------------------------------------------------
//
// For direct HTTP commands:
//
//     correlationId = randomUUID()
//
// The HTTP request is the root application operation.
//
// Causation is omitted.
//
// -----------------------------------------------------------------------------
//
// IDENTITY CLASSIFICATION
// -----------------------------------------------------------------------------
//
// IdentityType is intentionally absent from this controller.
//
// Every Identity currently represents a SisiMove user, so classification adds
// no additional business value at this boundary.
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
// - resolve permissions;
// - determine identity ownership;
// - access Prisma;
// - access repositories;
// - directly mutate IdentityAggregate;
// - generate domain timestamps;
// - create Authentication;
// - create Sessions;
// - create Devices;
// - create Recovery records;
// - create OTP Challenges;
// - resolve Roles;
// - resolve Permissions.
//
// =============================================================================

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
  Req,
  UnauthorizedException,
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
// Express
// -----------------------------------------------------------------------------

import type { Request } from 'express';

// -----------------------------------------------------------------------------
// Security — Authentication & Authorization
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
// Application — Dependency Injection Tokens
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

// =============================================================================
// Controller
// =============================================================================

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

  // ---------------------------------------------------------------------------
  // Create Identity
  // ---------------------------------------------------------------------------
  //
  // POST /identities
  //
  // Public registration endpoint.
  //
  // ---------------------------------------------------------------------------

  @Post()
  @ApiOperation({
    summary: 'Create identity',
    description:
      'Creates a new Identity for registration. The initial Identity lifecycle state is established by the domain/application workflow.',
  })
  @ApiBody({
    type: CreateIdentityRequestDto,
  })
  @ApiCreatedResponse({
    description: 'Identity created successfully.',
  })
  public async create(
    @Body() dto: CreateIdentityRequestDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    const command = new CreateIdentityCommand(
      IdentityEmail.create(dto.email),
      IdentityPhoneNumber.create(dto.phoneNumber),
      randomUUID(),
    );

    const aggregate = await this.createIdentityHandler.execute(command);

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Authenticated Identity
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Current Identity
  // ---------------------------------------------------------------------------
  //
  // GET /identities/me
  //
  // Self-service endpoint.
  //
  // Authentication is sufficient because the target Identity is derived from
  // the authenticated principal.
  //
  // ---------------------------------------------------------------------------

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get current identity',
    description:
      'Returns the Identity associated with the authenticated access token. The client does not provide an Identity public identifier. Self-access requires authentication only and does not require the identity:read permission.',
  })
  @ApiOkResponse({
    description: 'Current Identity retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @UseGuards(JwtAuthGuard)
  public async getMe(
    @Req() request: Request,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse> | null> {
    const identityPublicId = this.getAuthenticatedIdentityPublicId(request);

    const query = new GetIdentityQuery(identityPublicId);

    const aggregate = await this.getIdentityHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Privileged Identity Lookups
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Identity By Email
  // ---------------------------------------------------------------------------
  //
  // GET /identities/by-email/:email
  //
  // ---------------------------------------------------------------------------

  @Get('by-email/:email')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get identity by email',
    description:
      'Performs a privileged Identity lookup by email address. This endpoint requires identity:lookup because it can expose account-existence information.',
  })
  @ApiParam({
    name: 'email',
    type: String,
    required: true,
    description: 'Email address associated with the Identity.',
    example: 'user@example.com',
  })
  @ApiOkResponse({
    description: 'Identity lookup completed successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the identity:lookup permission.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:lookup')
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
  //
  // GET /identities/by-phone-number/:phoneNumber
  //
  // ---------------------------------------------------------------------------

  @Get('by-phone-number/:phoneNumber')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get identity by phone number',
    description:
      'Performs a privileged Identity lookup by phone number. This endpoint requires identity:lookup because it can expose account-existence information.',
  })
  @ApiParam({
    name: 'phoneNumber',
    type: String,
    required: true,
    description: 'Phone number associated with the Identity.',
    example: '+254700000000',
  })
  @ApiOkResponse({
    description: 'Identity lookup completed successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the identity:lookup permission.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:lookup')
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
  // Identity Target Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Identity By Public ID
  // ---------------------------------------------------------------------------
  //
  // GET /identities/:identityPublicId
  //
  // Target-identity authorization remains an application-layer concern.
  //
  // ---------------------------------------------------------------------------

  @Get(':identityPublicId')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get identity',
    description:
      'Returns a target Identity identified by its public identifier. Possession of the identifier does not itself grant access; target-identity scope is enforced by the application layer.',
  })
  @ApiParam({
    name: 'identityPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the target Identity.',
    example: 'ID-5GH3MK',
  })
  @ApiOkResponse({
    description: 'Identity retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission or target-identity authority.',
  })
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

  // ===========================================================================
  // Identity Activation
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Activate Identity
  // ---------------------------------------------------------------------------
  //
  // PATCH /identities/:identityPublicId/activate
  //
  // Protected until a dedicated activation-proof workflow exists.
  //
  // ---------------------------------------------------------------------------

  @Patch(':identityPublicId/activate')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Activate identity',
    description:
      'Activates a target Identity. Until a dedicated activation-proof workflow exists, activation requires the identity:activate permission.',
  })
  @ApiParam({
    name: 'identityPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the Identity to activate.',
    example: 'ID-5GH3MK',
  })
  @ApiOkResponse({
    description: 'Identity activated successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:activate')
  public async activate(
    @Param('identityPublicId') identityPublicId: string,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    const command = new ActivateIdentityCommand(
      new IdentityPublicId(identityPublicId),
    );

    const aggregate = await this.activateIdentityHandler.execute(command);

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Identity Contact Information
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Change Identity Email
  // ---------------------------------------------------------------------------
  //
  // PATCH /identities/:identityPublicId/email
  //
  // ---------------------------------------------------------------------------

  @Patch(':identityPublicId/email')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Change identity email',
    description:
      'Changes the email address of a target Identity. Identity lifecycle, uniqueness, verification, and mutation policies remain in the application/domain layer.',
  })
  @ApiParam({
    name: 'identityPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the Identity.',
    example: 'ID-5GH3MK',
  })
  @ApiBody({
    type: ChangeIdentityEmailRequestDto,
  })
  @ApiOkResponse({
    description: 'Identity email changed successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission or target-identity authority.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:change-email')
  public async changeEmail(
    @Param('identityPublicId') identityPublicId: string,
    @Body() dto: ChangeIdentityEmailRequestDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    const command = new ChangeIdentityEmailCommand(
      new IdentityPublicId(identityPublicId),
      IdentityEmail.create(dto.email),
      randomUUID(),
    );

    const aggregate = await this.changeIdentityEmailHandler.execute(command);

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Change Identity Phone Number
  // ---------------------------------------------------------------------------
  //
  // PATCH /identities/:identityPublicId/phone-number
  //
  // ---------------------------------------------------------------------------

  @Patch(':identityPublicId/phone-number')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Change identity phone number',
    description:
      'Changes the phone number of a target Identity. Identity lifecycle, uniqueness, verification, and mutation policies remain in the application/domain layer.',
  })
  @ApiParam({
    name: 'identityPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the Identity.',
    example: 'ID-5GH3MK',
  })
  @ApiBody({
    type: ChangeIdentityPhoneNumberRequestDto,
  })
  @ApiOkResponse({
    description: 'Identity phone number changed successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission or target-identity authority.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:change-phone-number')
  public async changePhoneNumber(
    @Param('identityPublicId') identityPublicId: string,
    @Body() dto: ChangeIdentityPhoneNumberRequestDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    const command = new ChangeIdentityPhoneNumberCommand(
      new IdentityPublicId(identityPublicId),
      IdentityPhoneNumber.create(dto.phoneNumber),
      randomUUID(),
    );

    const aggregate =
      await this.changeIdentityPhoneNumberHandler.execute(command);

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Identity Lifecycle
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Suspend Identity
  // ---------------------------------------------------------------------------
  //
  // PATCH /identities/:identityPublicId/suspend
  //
  // ---------------------------------------------------------------------------

  @Patch(':identityPublicId/suspend')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Suspend identity',
    description:
      'Suspends a target Identity. Lifecycle invariants and suspension rules remain inside the application/domain boundary.',
  })
  @ApiParam({
    name: 'identityPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the Identity to suspend.',
    example: 'ID-5GH3MK',
  })
  @ApiOkResponse({
    description: 'Identity suspended successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission or target-identity authority.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:suspend')
  public async suspend(
    @Param('identityPublicId') identityPublicId: string,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    const command = new SuspendIdentityCommand(
      new IdentityPublicId(identityPublicId),
      randomUUID(),
    );

    const aggregate = await this.suspendIdentityHandler.execute(command);

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Close Identity
  // ---------------------------------------------------------------------------
  //
  // PATCH /identities/:identityPublicId/close
  //
  // ---------------------------------------------------------------------------

  @Patch(':identityPublicId/close')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Close identity',
    description:
      'Closes a target Identity. CLOSED is terminal and lifecycle invariants remain inside the application/domain boundary.',
  })
  @ApiParam({
    name: 'identityPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the Identity to close.',
    example: 'ID-5GH3MK',
  })
  @ApiOkResponse({
    description: 'Identity closed successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission or target-identity authority.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity:close')
  public async close(
    @Param('identityPublicId') identityPublicId: string,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    const command = new CloseIdentityCommand(
      new IdentityPublicId(identityPublicId),
      randomUUID(),
    );

    const aggregate = await this.closeIdentityHandler.execute(command);

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Identity Roles
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Identity Roles
  // ---------------------------------------------------------------------------
  //
  // GET /identities/:identityPublicId/roles
  //
  // ---------------------------------------------------------------------------

  @Get(':identityPublicId/roles')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get identity roles',
    description:
      'Returns the roles owned by the target Identity aggregate. Target-identity authorization remains an application-layer responsibility.',
  })
  @ApiParam({
    name: 'identityPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the target Identity.',
    example: 'ID-5GH3MK',
  })
  @ApiOkResponse({
    description: 'Identity roles retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission or target-identity authority.',
  })
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
  // POST /identities/:identityPublicId/roles
  //
  // Target:
  //
  //     :identityPublicId
  //
  // Actor:
  //
  //     request.user.identityPublicId
  //
  // ---------------------------------------------------------------------------

  @Post(':identityPublicId/roles')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Assign role to identity',
    description:
      'Assigns an existing Role to the target Identity. The authenticated principal is used as the actor; actor identity cannot be supplied by the client.',
  })
  @ApiParam({
    name: 'identityPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the target Identity.',
    example: 'ID-5GH3MK',
  })
  @ApiBody({
    type: AssignIdentityRoleRequestDto,
  })
  @ApiOkResponse({
    description: 'Role assigned to Identity successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission or target-identity authority.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity-role:assign')
  public async assignRole(
    @Req() request: Request,
    @Param('identityPublicId') identityPublicId: string,
    @Body() dto: AssignIdentityRoleRequestDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.roleFromEntity>> {
    const actorPublicId = this.getAuthenticatedIdentityPublicId(request);

    const command = new AssignIdentityRoleCommand(
      // Target Identity
      new IdentityPublicId(identityPublicId),

      // Role
      new IdentityRoleRolePublicId(dto.rolePublicId),

      // Correlation
      randomUUID(),

      // Authenticated Actor
      actorPublicId,

      // Business-effective Expiration
      dto.expiresAt !== undefined ? new Date(dto.expiresAt) : undefined,
    );

    const identityRole = await this.assignIdentityRoleHandler.execute(command);

    return IdentityResponseMapper.roleFromEntity(identityRole);
  }

  // ---------------------------------------------------------------------------
  // Revoke Identity Role
  // ---------------------------------------------------------------------------
  //
  // PATCH /identities/:identityPublicId/roles/:rolePublicId/revoke
  //
  // Target Identity:
  //
  //     :identityPublicId
  //
  // Target Role:
  //
  //     :rolePublicId
  //
  // Actor:
  //
  //     request.user.identityPublicId
  //
  // ---------------------------------------------------------------------------

  @Patch(':identityPublicId/roles/:rolePublicId/revoke')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Revoke role from identity',
    description:
      'Revokes a Role assignment from the target Identity. The authenticated principal is used as the actor; actor identity cannot be supplied by the client.',
  })
  @ApiParam({
    name: 'identityPublicId',
    type: String,
    required: true,
    description: 'Public identifier of the target Identity.',
    example: 'ID-5GH3MK',
  })
  @ApiParam({
    name: 'rolePublicId',
    type: String,
    required: true,
    description: 'Public identifier of the Role being revoked.',
    example: 'ROL-5GH3MK',
  })
  @ApiBody({
    type: RevokeIdentityRoleRequestDto,
  })
  @ApiOkResponse({
    description: 'Role revoked from Identity successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required or the access token is invalid.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated identity does not have the required permission or target-identity authority.',
  })
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('identity-role:revoke')
  public async revokeRole(
    @Req() request: Request,
    @Param('identityPublicId') identityPublicId: string,
    @Param('rolePublicId') rolePublicId: string,
    @Body() dto: RevokeIdentityRoleRequestDto,
  ): Promise<ReturnType<typeof IdentityResponseMapper.toResponse>> {
    const actorPublicId = this.getAuthenticatedIdentityPublicId(request);

    const command = new RevokeIdentityRoleCommand(
      // Target Identity
      new IdentityPublicId(identityPublicId),

      // Target Role
      new IdentityRoleRolePublicId(rolePublicId),

      // Correlation
      randomUUID(),

      // Authenticated Actor
      actorPublicId,

      // Reason
      dto.reason,
    );

    const aggregate = await this.revokeIdentityRoleHandler.execute(command);

    return IdentityResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Authenticated Identity Public ID
  // ---------------------------------------------------------------------------
  //
  // JwtStrategy has already authenticated the request and attached:
  //
  //     request.user.identityPublicId
  //
  // This method merely validates the expected principal shape.
  //
  // ---------------------------------------------------------------------------

  private getAuthenticatedIdentityPublicId(request: Request): IdentityPublicId {
    const user = request.user as {
      identityPublicId?: unknown;
    };

    if (
      typeof user.identityPublicId !== 'string' ||
      user.identityPublicId.trim().length === 0
    ) {
      throw new UnauthorizedException(
        'Authenticated principal does not contain identityPublicId.',
      );
    }

    return new IdentityPublicId(user.identityPublicId.trim());
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default IdentitiesController;
