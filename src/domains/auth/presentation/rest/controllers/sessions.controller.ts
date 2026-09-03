// -----------------------------------------------------------------------------
// Session — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Session aggregate operations.
//
// Aggregate:
//
//     SessionAggregate
//     └── SessionEntity
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This controller is responsible only for:
//
// - HTTP transport;
// - DTO binding;
// - DTO validation through NestJS pipes;
// - conversion of transport primitives into domain value objects;
// - construction of application commands and queries;
// - dispatching commands and queries;
// - mapping application/domain results into HTTP responses.
//
// This controller contains NO Session business rules.
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURAL BOUNDARIES
// -----------------------------------------------------------------------------
//
// Domain:
//
//     SessionAggregate
//     SessionEntity
//
// Application:
//
//     command handlers
//     query handlers
//
// Persistence:
//
//     SessionRepository
//
// Security:
//
//     JWT authentication;
//     refresh-token authentication;
//     refresh-token hashing/comparison;
//     token rotation;
//     token-reuse detection;
//     session security policy.
//
// Security behavior is implemented by the appropriate security/application
// services and handlers rather than by this HTTP controller.
//
// -----------------------------------------------------------------------------
//
// AGGREGATE BOUNDARY
// -----------------------------------------------------------------------------
//
// Session is an independent aggregate:
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
// This controller does not directly construct or mutate those aggregates.
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATION VS AUTHORIZATION
// -----------------------------------------------------------------------------
//
// Authentication answers:
//
//     "Is this request associated with an authenticated principal?"
//
// Authorization answers:
//
//     "Is this authenticated principal permitted to perform this operation?"
//
// These are deliberately separate concerns.
//
// Session lifecycle:
//
//     logout  → access-token authentication
//     refresh → refresh-token authentication
//
// Administrative/session-management operations require explicit permissions.
//
// -----------------------------------------------------------------------------
//
// ENDPOINT SECURITY MODEL
// -----------------------------------------------------------------------------
//
// Authorized session-management operations:
//
//     GET /sessions/active
//         JwtAuthGuard + PermissionsGuard
//         session:read
//
//     GET /sessions/:sessionPublicId
//         JwtAuthGuard + PermissionsGuard
//         session:read
//
//     GET /sessions
//         JwtAuthGuard + PermissionsGuard
//         session:read
//
//     POST /sessions
//         JwtAuthGuard + PermissionsGuard
//         session:create
//
//     PATCH /sessions/:sessionPublicId/revoke
//         JwtAuthGuard + PermissionsGuard
//         session:revoke
//
//     PATCH /sessions/:sessionPublicId/expire
//         JwtAuthGuard + PermissionsGuard
//         session:expire
//
// Authentication/session lifecycle operations:
//
//     POST /sessions/logout
//         JwtAuthGuard only
//
//     POST /sessions/:sessionPublicId/refresh
//         Refresh-token authentication only
//
// There are intentionally no:
//
//     session:logout
//     session:refresh
//
// permissions.
//
// -----------------------------------------------------------------------------
//
// TOKEN REUSE DETECTION
// -----------------------------------------------------------------------------
//
// Token reuse detection is NOT exposed as a public Session operation.
//
// There must not be an endpoint such as:
//
//     POST /sessions/:sessionPublicId/token-reuse
//
// Token reuse is a security event produced by the refresh workflow:
//
//     refresh request
//          │
//          ▼
//     RefreshSessionHandler
//          │
//          ├── validate Session
//          ├── validate presented refresh token
//          ├── detect reuse
//          │
//          └── rotate token
//
// The client must never be able to declare:
//
//     "token reuse occurred"
//
// through an HTTP endpoint.
//
// If a dedicated application command is required internally, it remains an
// internal security/application capability invoked by the refresh workflow.
//
// -----------------------------------------------------------------------------
//
// SESSION CREATION
// -----------------------------------------------------------------------------
//
// Normal Session creation occurs as part of successful authentication:
//
//     POST /authentications/login
//                 │
//                 ▼
//        AuthenticateLoginHandler
//                 │
//                 ├── resolve Identity
//                 ├── resolve Authentication
//                 ├── verify password
//                 ├── establish Device
//                 ├── generate refresh token
//                 ├── hash refresh token
//                 ├── establish token family
//                 └── create Session
//
// Therefore:
//
//     POST /sessions
//
// is NOT the normal login/session-creation path.
//
// If retained, it is an explicitly authorized session-provisioning operation.
//
// CreateSessionCommand accepts a SessionRefreshTokenHash, not a raw refresh
// token.
//
// Therefore this controller must receive/provide the hashed representation
// required by the command contract.
//
// -----------------------------------------------------------------------------
//
// LOGOUT
// -----------------------------------------------------------------------------
//
// Logout belongs to the Session boundary.
//
//     POST /sessions/logout
//             │
//             ▼
//       JwtAuthGuard
//             │
//             ▼
//       request.user
//             │
//             └── sessionPublicId
//                     │
//                     ▼
//          RevokeSessionCommand
//                     │
//                     ├── USER_LOGOUT
//                     │
//                     ▼
//            RevokeSessionHandler
//                     │
//                     ▼
//              SessionAggregate
//                     │
//                     ▼
//                  revoke()
//
// The client does NOT provide:
//
// - sessionPublicId;
// - revocation reason;
// - revokedAt.
//
// These values are derived from the authenticated security context and
// application policy.
//
// Session transition:
//
//     ACTIVE → REVOKED
//
// -----------------------------------------------------------------------------
//
// LOGOUT SECURITY
// -----------------------------------------------------------------------------
//
// The access JWT contains:
//
//     sub → Identity.publicId
//     sid → Session.publicId
//
// JwtStrategy transforms these claims into:
//
//     identityPublicId
//     sessionPublicId
//
// Therefore logout consumes:
//
//     request.user.identityPublicId
//     request.user.sessionPublicId
//
// The client cannot select an arbitrary Session for logout.
//
// The application layer MUST additionally verify that:
//
//     Session.identityPublicId
//         ===
//     authenticatedIdentity.identityPublicId
//
// Therefore:
//
//     Authentication: YES
//     Authorization:  NO
//     Session ownership: YES
//
// -----------------------------------------------------------------------------
//
// REFRESH
// -----------------------------------------------------------------------------
//
// Refresh deliberately does NOT use JwtAuthGuard.
//
// Reason:
//
//     access token
//         ↓
//     may already be expired
//         ↓
//     refresh is required
//
// Therefore an access token cannot be the credential required to refresh itself.
//
// The refresh token is the credential for the refresh workflow.
//
// This endpoint also does NOT use PermissionsGuard.
//
// RefreshSessionHandler owns the complete refresh security workflow.
//
// The controller forwards the raw refresh token exactly as received.
//
// The controller does NOT:
//
// - trim the refresh token;
// - hash the refresh token;
// - compare the refresh token;
// - construct SessionRefreshTokenHash from the raw token.
//
// -----------------------------------------------------------------------------
//
// REFRESH SESSION PUBLIC ID
// -----------------------------------------------------------------------------
//
// The endpoint:
//
//     POST /sessions/:sessionPublicId/refresh
//
// accepts a Session public ID as a binding/lookup value.
//
// The path parameter MUST NOT independently establish:
//
// - authentication;
// - authorization;
// - Session ownership.
//
// The application/security workflow validates:
//
//     sessionPublicId + presented refresh token
//
// together.
//
// -----------------------------------------------------------------------------
//
// RAW REFRESH TOKEN VS HASH
// -----------------------------------------------------------------------------
//
// A refresh-token value supplied over HTTP is a RAW credential.
//
// A SessionRefreshTokenHash is a persisted security representation.
//
// Therefore:
//
//     CreateSessionCommand
//
// receives:
//
//     refreshTokenHash: SessionRefreshTokenHash
//
// while:
//
//     RefreshSessionCommand
//
// receives:
//
//     refreshToken: string
//
// The controller forwards the raw credential without implementing refresh
// security policy.
//
// -----------------------------------------------------------------------------
//
// REFRESH RESPONSE
// -----------------------------------------------------------------------------
//
// RefreshSessionHandler returns:
//
//     RefreshSessionResult
//
// containing:
//
//     accessToken
//     refreshToken
//     sessionPublicId
//     identityPublicId
//
// The controller MUST NOT map RefreshSessionResult through
// SessionResponseMapper because the result is not a SessionAggregate.
//
// -----------------------------------------------------------------------------
//
// SECURITY BOUNDARY
// -----------------------------------------------------------------------------
//
// This controller does NOT:
//
// - compare raw refresh tokens;
// - hash refresh tokens;
// - generate refresh tokens;
// - generate access tokens;
// - sign JWTs;
// - verify JWTs;
// - determine token-reuse policy;
// - determine refresh expiration policy;
// - revoke token families directly;
// - mutate Session state directly.
//
// Those responsibilities belong to the application/security layer.
//
// -----------------------------------------------------------------------------
//
// AUTHORIZATION BOUNDARY
// -----------------------------------------------------------------------------
//
// The controller does not define authorization policy.
//
// Authorization remains outside the Session domain.
//
// Conceptually:
//
//     Identity
//        │
//        └── IdentityRole
//               │
//               └── Role
//                      │
//                      └── RolePermission
//                             │
//                             └── Permission
//
// The access JWT authenticates the principal.
//
// Authorization may resolve current authorization state independently.
//
// The absence of roles or permissions in the JWT does NOT invalidate an
// authenticated Session.
//
// -----------------------------------------------------------------------------
//
// CORRELATION
// -----------------------------------------------------------------------------
//
// Direct HTTP operations generate a new correlation ID:
//
//     correlationId = randomUUID()
//
// Causation IDs are propagated only when supplied by the transport contract.
//
// With exactOptionalPropertyTypes enabled, optional object properties are
// omitted rather than explicitly assigned undefined.
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
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Express
// -----------------------------------------------------------------------------

import type { Request } from 'express';

// -----------------------------------------------------------------------------
// Foundation — Security
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
  ExpireSessionCommand,
  RefreshSessionCommand,
  RevokeSessionCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Handlers
// -----------------------------------------------------------------------------

import type { RefreshSessionResult } from '../../../application/command-handlers/refresh-session.handler';

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
// Types
// =============================================================================

/**
 * Request-scoped authenticated principal supplied by JwtStrategy.
 *
 * This is intentionally limited to the claims required by Session HTTP
 * operations.
 */
interface AuthenticatedSessionPrincipal {
  readonly identityPublicId?: unknown;
  readonly sessionPublicId?: unknown;
}

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Sessions')
@Controller('sessions')
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
    //
    // IMPORTANT:
    //
    // RefreshSessionHandler returns RefreshSessionResult rather than
    // SessionAggregate because refresh issues new credentials.
    //

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.REFRESH_SESSION)
    private readonly refreshSessionHandler: CommandHandler<
      RefreshSessionCommand,
      RefreshSessionResult
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

  @Get('active')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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

  @Get(':sessionPublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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
  // This endpoint is explicitly authorized session provisioning.
  //
  // CreateSessionCommand requires:
  //
  //     refreshTokenHash: SessionRefreshTokenHash
  //
  // Therefore the DTO provides the already-hashed representation.
  //
  // A raw refresh token MUST NOT be passed to this command.
  //
  // ---------------------------------------------------------------------------

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
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
      // With exactOptionalPropertyTypes enabled, the optional property is
      // explicitly represented in the command props contract.
      //

      devicePublicId:
        dto.devicePublicId !== undefined
          ? new SessionDevicePublicId(dto.devicePublicId)
          : undefined,

      // -----------------------------------------------------------------------
      // Refresh Token Hash
      // -----------------------------------------------------------------------
      //
      // This is already the persisted security representation.
      //
      // The controller does NOT hash anything here.
      //

      refreshTokenHash: SessionRefreshTokenHash.create(dto.refreshTokenHash),

      // -----------------------------------------------------------------------
      // Token Family
      // -----------------------------------------------------------------------

      tokenFamilyPublicId: new SessionTokenFamilyPublicId(
        dto.tokenFamilyPublicId,
      ),

      // -----------------------------------------------------------------------
      // Request Context
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

      ...(dto.causationId !== undefined
        ? {
            causationId: dto.causationId,
          }
        : {}),
    });

    const aggregate = await this.createSessionHandler.execute(command);

    return SessionResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Authentication / Session Lifecycle
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------

  @Post('logout')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  public async logout(@Req() request: Request): Promise<{ success: true }> {
    const sessionPublicId = this.getAuthenticatedSessionPublicId(request);

    const command = new RevokeSessionCommand(
      sessionPublicId,
      SessionRevokedAt.create(new Date()),
      SessionRevocationReason.create(SessionRevocationReason.USER_LOGOUT),
      randomUUID(),
    );

    await this.revokeSessionHandler.execute(command);

    return {
      success: true,
    };
  }

  // ---------------------------------------------------------------------------
  // Refresh Session
  // ---------------------------------------------------------------------------
  //
  // POST /sessions/:sessionPublicId/refresh
  //
  // Refresh uses the refresh credential rather than the access JWT.
  //
  // The raw refresh token is forwarded exactly as received.
  //
  // The handler:
  //
  // - validates the Session;
  // - compares the presented token;
  // - resolves Authentication;
  // - generates the replacement token;
  // - hashes the replacement;
  // - rotates the Session hash;
  // - issues the replacement access token;
  // - persists the Session.
  //
  // ---------------------------------------------------------------------------

  @Post(':sessionPublicId/refresh')
  public async refresh(
    @Param('sessionPublicId') sessionPublicId: string,
    @Body() dto: RefreshSessionRequestDto,
  ): Promise<RefreshSessionResult> {
    const command = new RefreshSessionCommand(
      new SessionPublicId(sessionPublicId),

      // -----------------------------------------------------------------------
      // RAW REFRESH TOKEN
      // -----------------------------------------------------------------------
      //
      // Preserve the credential exactly as supplied.
      //
      // Do NOT trim, normalize, hash, decode, or wrap it in
      // SessionRefreshTokenHash.
      //

      dto.refreshToken,

      // -----------------------------------------------------------------------
      // Last Activity
      // -----------------------------------------------------------------------

      SessionLastActivityAt.create(new Date(dto.lastActivityAt)),

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      randomUUID(),

      // -----------------------------------------------------------------------
      // Causation
      // -----------------------------------------------------------------------

      ...(dto.causationId !== undefined ? [dto.causationId] : []),
    );

    return this.refreshSessionHandler.execute(command);
  }

  // ===========================================================================
  // Authorized Session Management
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Revoke Session
  // ---------------------------------------------------------------------------

  @Patch(':sessionPublicId/revoke')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('session:revoke')
  public async revoke(
    @Param('sessionPublicId') sessionPublicId: string,
    @Body() dto: RevokeSessionRequestDto,
  ): Promise<SessionResponse> {
    const reason = dto.reason as SessionRevocationReasonValue;

    const command = new RevokeSessionCommand(
      new SessionPublicId(sessionPublicId),

      SessionRevokedAt.create(new Date(dto.revokedAt)),

      SessionRevocationReason.create(reason),

      randomUUID(),

      dto.causationId,
    );

    const aggregate = await this.revokeSessionHandler.execute(command);

    return SessionResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Expire Session
  // ---------------------------------------------------------------------------

  @Patch(':sessionPublicId/expire')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('session:expire')
  public async expire(
    @Param('sessionPublicId') sessionPublicId: string,
    @Body() dto: ExpireSessionRequestDto,
  ): Promise<SessionResponse> {
    const command = new ExpireSessionCommand(
      new SessionPublicId(sessionPublicId),

      new Date(dto.referenceDate),

      randomUUID(),

      ...(dto.causationId !== undefined ? [dto.causationId] : []),
    );

    const aggregate = await this.expireSessionHandler.execute(command);

    return SessionResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Private Security Context Helpers
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Authenticated Principal
  // ---------------------------------------------------------------------------

  private getAuthenticatedPrincipal(
    request: Request,
  ): AuthenticatedSessionPrincipal {
    return request.user as AuthenticatedSessionPrincipal;
  }

  // ---------------------------------------------------------------------------
  // Get Authenticated Identity
  // ---------------------------------------------------------------------------

  private getAuthenticatedIdentityPublicId(
    request: Request,
  ): SessionIdentityPublicId {
    const user = this.getAuthenticatedPrincipal(request);

    if (
      typeof user.identityPublicId !== 'string' ||
      user.identityPublicId.trim().length === 0
    ) {
      throw new UnauthorizedException(
        'Authenticated principal does not contain identityPublicId.',
      );
    }

    return new SessionIdentityPublicId(user.identityPublicId.trim());
  }

  // ---------------------------------------------------------------------------
  // Get Authenticated Session
  // ---------------------------------------------------------------------------

  private getAuthenticatedSessionPublicId(request: Request): SessionPublicId {
    const user = this.getAuthenticatedPrincipal(request);

    if (
      typeof user.sessionPublicId !== 'string' ||
      user.sessionPublicId.trim().length === 0
    ) {
      throw new UnauthorizedException(
        'Authenticated principal does not contain sessionPublicId.',
      );
    }

    return new SessionPublicId(user.sessionPublicId.trim());
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default SessionsController;
