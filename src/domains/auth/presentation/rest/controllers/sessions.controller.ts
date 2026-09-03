// -----------------------------------------------------------------------------
// Session — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Session aggregate operations.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// -----------------------------------------------------------------------------
//
// Controller responsibilities
// -----------------------------------------------------------------------------
//
// This controller is responsible only for:
//
// - HTTP transport;
// - DTO binding;
// - DTO validation through NestJS pipes;
// - conversion of transport primitives into domain value objects;
// - construction of application commands/queries;
// - dispatching commands/queries;
// - mapping application/domain results into HTTP response models.
//
// -----------------------------------------------------------------------------
//
// Architectural boundaries
// -----------------------------------------------------------------------------
//
// Domain behavior:
//
// - SessionAggregate;
// - SessionEntity.
//
// Application orchestration:
//
// - command handlers;
// - query handlers.
//
// Persistence:
//
// - SessionRepository.
//
// Security:
//
// - token generation;
// - token hashing;
// - token comparison;
// - JWT creation;
// - JWT verification;
// - refresh-token security policy.
//
// -----------------------------------------------------------------------------
//
// Session aggregate boundary
// -----------------------------------------------------------------------------
//
// Session is an independent aggregate root.
//
//     SessionAggregate
//     └── SessionEntity
//
// Authentication is a separate aggregate:
//
//     AuthenticationAggregate
//     └── AuthenticationEntity
//
// Device is a separate aggregate:
//
//     DeviceAggregate
//     └── DeviceEntity
//
// Recovery is a separate aggregate:
//
//     RecoveryAggregate
//     └── RecoveryEntity
//
// OTP is a separate aggregate:
//
//     OtpChallengeAggregate
//     └── OtpChallengeEntity
//
// The Session controller does not directly construct or mutate any of these
// other aggregates.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT — SESSION CREATION
// -----------------------------------------------------------------------------
//
// Normal Session creation occurs as part of successful authentication.
//
// The normal flow is:
//
//     POST /authentications/authenticate
//                 │
//                 ▼
//        AuthenticateHandler
//                 │
//                 ├── resolve Identity
//                 ├── resolve Authentication
//                 ├── verify password
//                 ├── record successful Authentication
//                 ├── generate refresh token
//                 ├── hash refresh token
//                 ├── establish token family
//                 └── CreateSessionHandler
//                              │
//                              ▼
//                       SessionAggregate
//
// Therefore this controller does NOT expose Session creation as part of the
// normal login flow.
//
// If POST /sessions is retained, it is an explicit internal/administrative
// provisioning operation and MUST remain protected.
//
// -----------------------------------------------------------------------------
//
// SECURITY BOUNDARY
// -----------------------------------------------------------------------------
//
// Raw refresh tokens are security-sensitive transport values.
//
// This controller MUST NOT:
//
// - hash raw refresh tokens;
// - compare raw refresh tokens;
// - generate refresh tokens;
// - sign JWTs;
// - verify JWTs.
//
// The security/application workflow is responsible for converting:
//
//     raw refresh token
//            │
//            ▼
//     HashingService
//            │
//            ▼
//     SessionRefreshTokenHash
//
// The Session command must receive only the resulting domain value object.
//
// -----------------------------------------------------------------------------
//
// Correlation and causation
// -----------------------------------------------------------------------------
//
// Direct HTTP operations generate correlation IDs at the controller boundary:
//
//     correlationId = randomUUID()
//
// Causation ID is optional.
//
// With:
//
//     exactOptionalPropertyTypes: true
//
// the distinction is:
//
//     property?: T
//
// means:
//
//     property may be omitted
//
// while:
//
//     property: T | undefined
//
// means:
//
//     property is required but its value may be undefined.
//
// CreateSessionCommandProps intentionally uses the second form for optional
// Session references/context:
//
//     devicePublicId: SessionDevicePublicId | undefined
//
// Therefore those properties MUST always be supplied by this controller.
//
// `causationId` is different because CreateSessionCommandProps declares:
//
//     causationId?: string
//
// Therefore `causationId` is omitted when undefined.
//
// -----------------------------------------------------------------------------
//
// Controller does NOT
// -----------------------------------------------------------------------------
//
// This controller does NOT:
//
// - authenticate credentials;
// - verify passwords;
// - hash passwords;
// - hash refresh tokens;
// - compare refresh tokens;
// - generate refresh tokens;
// - generate access tokens;
// - sign JWTs;
// - verify JWTs;
// - determine token-reuse policy;
// - determine expiration policy;
// - calculate lock thresholds;
// - modify Session state directly;
// - access Prisma;
// - access repositories directly;
// - create Authentication records directly;
// - create Devices directly;
// - create Recovery records directly;
// - create OTP Challenges directly;
// - revoke token families directly;
// - perform external side effects.
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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Express
// -----------------------------------------------------------------------------

import type { Request } from 'express';

// -----------------------------------------------------------------------------
// Security
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

import { AUTH_TOKENS } from '../../../application/auth.tokens';

// -----------------------------------------------------------------------------
// Application — Commands
// -----------------------------------------------------------------------------

import {
  CreateSessionCommand,
  DetectSessionTokenReuseCommand,
  ExpireSessionCommand,
  RefreshSessionCommand,
  RevokeSessionCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetActiveSessionsQuery,
  GetSessionQuery,
  GetSessionsQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { SessionAggregate } from '../../../domain/aggregates/session.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  SessionAuthenticatedAt,
  SessionCity,
  SessionCountryCode,
  SessionDevicePublicId,
  SessionExpiresAt,
  SessionIdentityPublicId,
  SessionIpAddress,
  SessionLastActivityAt,
  SessionPublicId,
  SessionRefreshTokenHash,
  SessionRevocationReason,
  SessionRevocationReasonValue,
  SessionRevokedAt,
  SessionTokenFamilyPublicId,
  SessionUserAgent,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  CreateSessionRequestDto,
  DetectSessionTokenReuseRequestDto,
  ExpireSessionRequestDto,
  RefreshSessionRequestDto,
  RevokeSessionRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import { GetSessionQueryDto, GetSessionsQueryDto } from '../queries';

// -----------------------------------------------------------------------------
// Presentation — Response
// -----------------------------------------------------------------------------

import type { SessionResponse } from '../mappers/session.response.mapper';

import { SessionResponseMapper } from '../mappers/session.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Sessions')
@Controller('sessions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SessionsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Create Session
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.CREATE_SESSION)
    private readonly createSessionHandler: CommandHandler<
      CreateSessionCommand,
      SessionAggregate
    >,

    // -------------------------------------------------------------------------
    // Refresh Session
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.REFRESH_SESSION)
    private readonly refreshSessionHandler: CommandHandler<
      RefreshSessionCommand,
      SessionAggregate
    >,

    // -------------------------------------------------------------------------
    // Revoke Session
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.REVOKE_SESSION)
    private readonly revokeSessionHandler: CommandHandler<
      RevokeSessionCommand,
      SessionAggregate
    >,

    // -------------------------------------------------------------------------
    // Expire Session
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.EXPIRE_SESSION)
    private readonly expireSessionHandler: CommandHandler<
      ExpireSessionCommand,
      SessionAggregate
    >,

    // -------------------------------------------------------------------------
    // Detect Token Reuse
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.DETECT_SESSION_TOKEN_REUSE)
    private readonly detectSessionTokenReuseHandler: CommandHandler<
      DetectSessionTokenReuseCommand,
      SessionAggregate
    >,

    // -------------------------------------------------------------------------
    // Get Session
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.QUERY_HANDLERS.GET_SESSION)
    private readonly getSessionHandler: QueryHandler<
      GetSessionQuery,
      SessionAggregate | null
    >,

    // -------------------------------------------------------------------------
    // Get Sessions
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.QUERY_HANDLERS.GET_SESSIONS)
    private readonly getSessionsHandler: QueryHandler<
      GetSessionsQuery,
      SessionAggregate[]
    >,

    // -------------------------------------------------------------------------
    // Get Active Sessions
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.QUERY_HANDLERS.GET_ACTIVE_SESSIONS)
    private readonly getActiveSessionsHandler: QueryHandler<
      GetActiveSessionsQuery,
      SessionAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Active Sessions
  // ---------------------------------------------------------------------------
  //
  // GET /sessions/active
  //
  // Active Sessions are scoped to the authenticated Identity.
  //
  // The identity is deliberately NOT accepted from the query string.
  //
  // ---------------------------------------------------------------------------

  @Get('active')
  @RequirePermissions('session:read')
  public async getActive(@Req() request: Request): Promise<SessionResponse[]> {
    const identityPublicId = this.getAuthenticatedIdentityPublicId(request);

    const query = new GetActiveSessionsQuery(identityPublicId);

    const aggregates = await this.getActiveSessionsHandler.execute(query);

    return aggregates.map((aggregate) =>
      SessionResponseMapper.toResponse(aggregate),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Session
  // ---------------------------------------------------------------------------
  //
  // GET /sessions/:sessionPublicId
  //
  // ---------------------------------------------------------------------------

  @Get(':sessionPublicId')
  @RequirePermissions('session:read')
  public async get(
    @Param() dto: GetSessionQueryDto,
  ): Promise<SessionResponse | null> {
    const query = new GetSessionQuery(new SessionPublicId(dto.sessionPublicId));

    const aggregate = await this.getSessionHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return SessionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Sessions
  // ---------------------------------------------------------------------------
  //
  // GET /sessions
  //
  // An optional Identity scope is supported for explicitly authorized
  // session-management operations.
  //
  // ---------------------------------------------------------------------------

  @Get()
  @RequirePermissions('session:read')
  public async getMany(
    @Query() dto: GetSessionsQueryDto,
  ): Promise<SessionResponse[]> {
    const query =
      dto.identityPublicId !== undefined
        ? new GetSessionsQuery({
            identityPublicId: new SessionIdentityPublicId(dto.identityPublicId),
          })
        : new GetSessionsQuery({});

    const aggregates = await this.getSessionsHandler.execute(query);

    return aggregates.map((aggregate) =>
      SessionResponseMapper.toResponse(aggregate),
    );
  }

  // ===========================================================================
  // Session Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Session
  // ---------------------------------------------------------------------------
  //
  // POST /sessions
  //
  // This endpoint is NOT the normal login/session-creation path.
  //
  // Normal successful authentication creates the Session through
  // AuthenticateHandler.
  //
  // This endpoint is retained only for explicit internal/administrative
  // provisioning.
  //
  // ---------------------------------------------------------------------------

  @Post()
  @RequirePermissions('session:create')
  public async create(
    @Body() dto: CreateSessionRequestDto,
  ): Promise<SessionResponse> {
    const command = new CreateSessionCommand({
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      identityPublicId: new SessionIdentityPublicId(dto.identityPublicId),

      // -----------------------------------------------------------------------
      // Device
      // -----------------------------------------------------------------------
      //
      // REQUIRED command property.
      //
      // The value itself may be undefined.
      //
      // This matches:
      //
      //     devicePublicId: SessionDevicePublicId | undefined
      //
      // and is necessary because exactOptionalPropertyTypes is enabled.
      //
      // -----------------------------------------------------------------------

      devicePublicId:
        dto.devicePublicId !== undefined
          ? new SessionDevicePublicId(dto.devicePublicId)
          : undefined,

      // -----------------------------------------------------------------------
      // Refresh Token Hash
      // -----------------------------------------------------------------------
      //
      // IMPORTANT:
      //
      // This assumes SessionRefreshTokenHash.create() is a genuine
      // cryptographic hashing boundary.
      //
      // If it merely wraps the supplied value, this endpoint must instead
      // receive a pre-hashed value from the security/application layer.
      //
      // -----------------------------------------------------------------------

      refreshTokenHash: SessionRefreshTokenHash.create(dto.refreshToken),

      // -----------------------------------------------------------------------
      // Token Family
      // -----------------------------------------------------------------------

      tokenFamilyPublicId: new SessionTokenFamilyPublicId(
        dto.tokenFamilyPublicId,
      ),

      // -----------------------------------------------------------------------
      // Request Context
      // -----------------------------------------------------------------------
      //
      // These properties are required on CreateSessionCommandProps but their
      // values are intentionally allowed to be undefined.
      //
      // -----------------------------------------------------------------------

      ipAddress:
        dto.ipAddress !== undefined
          ? SessionIpAddress.create(dto.ipAddress)
          : undefined,

      userAgent:
        dto.userAgent !== undefined
          ? SessionUserAgent.create(dto.userAgent)
          : undefined,

      countryCode:
        dto.countryCode !== undefined
          ? SessionCountryCode.create(dto.countryCode)
          : undefined,

      city: dto.city !== undefined ? SessionCity.create(dto.city) : undefined,

      // -----------------------------------------------------------------------
      // Session Timestamps
      // -----------------------------------------------------------------------

      authenticatedAt: SessionAuthenticatedAt.create(
        new Date(dto.authenticatedAt),
      ),

      lastActivityAt: SessionLastActivityAt.create(
        new Date(dto.lastActivityAt),
      ),

      expiresAt: SessionExpiresAt.create(new Date(dto.expiresAt)),

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      correlationId: randomUUID(),

      // -----------------------------------------------------------------------
      // Causation
      // -----------------------------------------------------------------------
      //
      // Unlike the Session context properties above, causationId is declared
      // as an optional property:
      //
      //     causationId?: string
      //
      // Therefore it must be omitted when undefined.
      //
      // -----------------------------------------------------------------------

      ...(dto.causationId !== undefined
        ? {
            causationId: dto.causationId,
          }
        : {}),
    });

    const aggregate = await this.createSessionHandler.execute(command);

    return SessionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Refresh Session
  // ---------------------------------------------------------------------------
  //
  // POST /sessions/:sessionPublicId/refresh
  //
  // The controller does not compare refresh tokens.
  //
  // ---------------------------------------------------------------------------

  @Post(':sessionPublicId/refresh')
  @RequirePermissions('session:refresh')
  public async refresh(
    @Param('sessionPublicId') sessionPublicId: string,
    @Body() dto: RefreshSessionRequestDto,
  ): Promise<SessionResponse> {
    const command = new RefreshSessionCommand(
      new SessionPublicId(sessionPublicId),

      SessionRefreshTokenHash.create(dto.refreshToken),

      SessionLastActivityAt.create(new Date(dto.lastActivityAt)),

      randomUUID(),

      dto.causationId,
    );

    const aggregate = await this.refreshSessionHandler.execute(command);

    return SessionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Revoke Session
  // ---------------------------------------------------------------------------
  //
  // PATCH /sessions/:sessionPublicId/revoke
  //
  // ---------------------------------------------------------------------------

  @Patch(':sessionPublicId/revoke')
  @RequirePermissions('session:revoke')
  public async revoke(
    @Param('sessionPublicId') sessionPublicId: string,
    @Body() dto: RevokeSessionRequestDto,
  ): Promise<SessionResponse> {
    const command = new RevokeSessionCommand(
      new SessionPublicId(sessionPublicId),

      SessionRevokedAt.create(new Date(dto.revokedAt)),

      SessionRevocationReason.create(
        dto.reason as SessionRevocationReasonValue,
      ),

      randomUUID(),

      dto.causationId,
    );

    const aggregate = await this.revokeSessionHandler.execute(command);

    return SessionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Expire Session
  // ---------------------------------------------------------------------------
  //
  // PATCH /sessions/:sessionPublicId/expire
  //
  // The controller supplies the reference timestamp.
  //
  // The Session aggregate determines whether the Session is actually expired.
  //
  // ---------------------------------------------------------------------------

  @Patch(':sessionPublicId/expire')
  @RequirePermissions('session:expire')
  public async expire(
    @Param('sessionPublicId') sessionPublicId: string,
    @Body() dto: ExpireSessionRequestDto,
  ): Promise<SessionResponse> {
    const command = new ExpireSessionCommand(
      new SessionPublicId(sessionPublicId),

      new Date(dto.referenceDate),

      randomUUID(),

      dto.causationId,
    );

    const aggregate = await this.expireSessionHandler.execute(command);

    return SessionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Detect Session Token Reuse
  // ---------------------------------------------------------------------------
  //
  // POST /sessions/:sessionPublicId/token-reuse
  //
  // The controller does not determine whether reuse occurred.
  //
  // The security/application workflow makes that determination and dispatches
  // this command.
  //
  // ---------------------------------------------------------------------------

  @Post(':sessionPublicId/token-reuse')
  @RequirePermissions('session:detect-token-reuse')
  public async detectTokenReuse(
    @Param('sessionPublicId') sessionPublicId: string,
    @Body() dto: DetectSessionTokenReuseRequestDto,
  ): Promise<SessionResponse> {
    const command = new DetectSessionTokenReuseCommand(
      new SessionPublicId(sessionPublicId),

      new Date(dto.detectedAt),

      randomUUID(),

      dto.causationId,
    );

    const aggregate =
      await this.detectSessionTokenReuseHandler.execute(command);

    return SessionResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Authenticated Identity
  // ---------------------------------------------------------------------------
  //
  // The JWT authentication layer is expected to populate:
  //
  //     request.user.identityPublicId
  //
  // This keeps user-owned Session queries scoped to the authenticated
  // principal.
  //
  // ---------------------------------------------------------------------------

  private getAuthenticatedIdentityPublicId(
    request: Request,
  ): SessionIdentityPublicId {
    const user = request.user as {
      identityPublicId?: unknown;
    };

    if (
      typeof user.identityPublicId !== 'string' ||
      user.identityPublicId.length === 0
    ) {
      throw new Error(
        'Authenticated principal does not contain identityPublicId.',
      );
    }

    return new SessionIdentityPublicId(user.identityPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default SessionsController;
