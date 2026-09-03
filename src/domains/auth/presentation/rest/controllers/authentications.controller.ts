// -----------------------------------------------------------------------------
// Authentication — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Authentication aggregate operations.
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Responsibilities:
//
// - HTTP transport;
// - DTO binding and validation;
// - conversion from transport primitives to domain value objects;
// - delegation of password hashing for password provisioning/change;
// - dispatching application commands and queries;
// - mapping application/domain results to transport responses.
//
// The controller contains no business rules.
//
// Domain behavior remains inside:
// - AuthenticationAggregate;
// - AuthenticationEntity.
//
// Application orchestration remains inside:
// - command handlers;
// - query handlers.
//
// Persistence remains behind:
// - repositories.
//
// IMPORTANT:
//
// Authentication is an aggregate root.
//
// Related authentication boundaries:
//
// Authentication
// └── AuthenticationEntity
//
// Session
// └── SessionEntity
//
// Device
// └── DeviceEntity
//
// Recovery
// └── RecoveryEntity
//
// OtpChallenge
// └── OtpChallengeEntity
//
// These are separate aggregate boundaries.
//
// This controller does NOT:
//
// - validate credentials directly;
// - compare passwords;
// - implement password hashing algorithms;
// - resolve Identity directly;
// - create Devices directly;
// - create Sessions directly;
// - generate access tokens;
// - generate refresh tokens;
// - hash refresh tokens;
// - persist refresh tokens;
// - access Prisma;
// - perform persistence directly;
// - mutate Authentication state directly;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Authentication security boundary:
//
// Public onboarding / authentication operations:
//
// - create authentication;
// - activate authentication;
// - login.
//
// Protected operations against an existing Authentication:
//
// - retrieve authentication;
// - retrieve authentication by identity;
// - lock authentication;
// - unlock authentication;
// - disable authentication;
// - record authentication failure;
// - change authentication password.
//
// Public and protected operations coexist explicitly within this controller.
//
// -----------------------------------------------------------------------------
//
// Complete login:
//
// The public HTTP contract contains only:
//
//     emailOrPhoneNumber
//     password
//
// Technical device/session context is request metadata and is NOT part of the
// user-facing request DTO.
//
// The controller obtains technical context from the HTTP request and passes it
// to the application command.
//
//     HTTP request
//          │
//          ├── credentials
//          │      └── AuthenticateLoginRequestDto
//          │
//          └── technical request context
//                 ├── device fingerprint
//                 ├── device type
//                 ├── user agent
//                 ├── IP address
//                 └── other request metadata
//          │
//          ▼
// AuthenticateLoginCommand
//          │
//          ▼
// AuthenticateLoginHandler
//          │
//          ├── AuthenticateHandler
//          │       │
//          │       └── credential authentication
//          │
//          ├── Device
//          │
//          ├── Session
//          │
//          ├── access token
//          │
//          └── refresh token
//          │
//          ▼
// AuthenticateLoginResult
//
// The controller does not participate in the orchestration.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// The client does NOT provide through the login DTO:
//
// - identityPublicId;
// - authenticationPublicId;
// - devicePublicId;
// - sessionPublicId;
// - tokenFamilyPublicId;
// - refreshToken;
// - refreshTokenHash;
// - accessToken;
// - correlationId;
// - causationId.
//
// Device/session metadata is technical request context and should not appear
// as user-facing Swagger form fields.
//
// -----------------------------------------------------------------------------
//
// Password provisioning:
//
// plaintext password
//        │
//        ▼
// PasswordHasher.hash()
//        │
//        ▼
// AuthenticationPasswordHash
//        │
//        ▼
// CreateAuthenticationCommand
//
// Plaintext passwords never enter CreateAuthenticationCommand.
//
// -----------------------------------------------------------------------------
//
// Password change:
//
// plaintext password
//        │
//        ▼
// PasswordHasher.hash()
//        │
//        ▼
// AuthenticationPasswordHash
//        │
//        ▼
// ChangePasswordCommand
//
// -----------------------------------------------------------------------------
//
// Application message metadata:
//
// Direct HTTP commands begin a new application operation.
//
// Therefore:
//
// - correlationId is generated at the HTTP/application boundary;
// - causationId is omitted because there is no preceding command or event.
//
// The generated correlationId is propagated into application commands and
// subsequently into domain events where applicable.
//
// -----------------------------------------------------------------------------
//
// Temporal responsibility:
//
// Mutation timestamps that represent the occurrence of a successful domain
// mutation are determined by the aggregate.
//
// The controller therefore does NOT construct timestamps such as:
//
// - activatedAt.
//
// Security/business facts explicitly supplied by the API contract may remain
// command inputs where appropriate, for example:
//
// - lockedAt;
// - lockedUntil;
// - failure reason;
// - failedAt;
// - password changedAt.
//
// -----------------------------------------------------------------------------
//
// Login failure behavior:
//
// Failed credential authentication MUST terminate the login workflow.
//
// The controller simply returns the discriminated login result:
//
//     { success: false, reason: 'INVALID_CREDENTIALS' }
//
// It does not:
//
// - resolve/create a Device;
// - create a Session;
// - generate tokens;
// - expose whether the email/phone exists;
// - expose whether a Device was invalid.
//
// -----------------------------------------------------------------------------
//
// Successful login:
//
// A successful login result contains:
//
// - identityPublicId;
// - authenticationPublicId;
// - devicePublicId;
// - sessionPublicId;
// - accessToken;
// - refreshToken.
//
// The controller returns the application result without reimplementing the
// login workflow.
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
  Req,
  UseGuards,
} from '@nestjs/common';

// -----------------------------------------------------------------------------
// HTTP
// -----------------------------------------------------------------------------

import type { Request } from 'express';

// -----------------------------------------------------------------------------
// Swagger
// -----------------------------------------------------------------------------

import { ApiTags } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Foundation — Security
// -----------------------------------------------------------------------------

import type { PasswordHasher } from '../../../../../foundation/security';

import {
  JwtAuthGuard,
  PermissionsGuard,
  RequirePermissions,
} from '../../../../../foundation/security/auth';

// -----------------------------------------------------------------------------
// Infrastructure — Security
// -----------------------------------------------------------------------------

import { SECURITY_PASSWORD_HASHER } from '../../../../../infrastructure/security';

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
  ActivateAuthenticationCommand,
  AuthenticateLoginCommand,
  ChangePasswordCommand,
  CreateAuthenticationCommand,
  DisableAuthenticationCommand,
  LockAuthenticationCommand,
  RecordAuthenticationFailureCommand,
  UnlockAuthenticationCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Login Result
// -----------------------------------------------------------------------------

import type { AuthenticateLoginResult } from '../../../application/command-handlers/authenticate-login.handler';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetAuthenticationByIdentityQuery,
  GetAuthenticationQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { AuthenticationAggregate } from '../../../domain/aggregates/authentication.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  AuthenticationFailureCount,
  AuthenticationFailureReason,
  AuthenticationIdentityPublicId,
  AuthenticationLastFailedAt,
  AuthenticationLockedAt,
  AuthenticationLockedUntil,
  AuthenticationPasswordChangedAt,
  AuthenticationPasswordHash,
  AuthenticationPublicId,
} from '../../../domain/value-objects';

import {
  DeviceBrowser,
  DeviceBrowserVersion,
  DeviceFingerprint,
  DeviceName,
  DeviceOperatingSystem,
  DeviceOperatingSystemVersion,
  DevicePlatform,
  DeviceType,
} from '../../../domain/value-objects';

import {
  SessionCity,
  SessionCountryCode,
  SessionIpAddress,
  SessionUserAgent,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  AuthenticateLoginRequestDto,
  ChangePasswordRequestDto,
  CreateAuthenticationRequestDto,
  DisableAuthenticationRequestDto,
  LockAuthenticationRequestDto,
  RecordAuthenticationFailureRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import {
  GetAuthenticationByIdentityQueryDto,
  GetAuthenticationQueryDto,
} from '../queries';

// -----------------------------------------------------------------------------
// Presentation — Response Model
// -----------------------------------------------------------------------------

import type { AuthenticationResponse } from '../mappers/authentication.response.mapper';

// -----------------------------------------------------------------------------
// Presentation — Response Mapper
// -----------------------------------------------------------------------------

import { AuthenticationResponseMapper } from '../mappers/authentication.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Authentications')
@Controller('authentications')
export class AuthenticationsController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Security
    // -------------------------------------------------------------------------

    @Inject(SECURITY_PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,

    // -------------------------------------------------------------------------
    // Authentication Command Handlers
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.CREATE_AUTHENTICATION)
    private readonly createAuthenticationHandler: CommandHandler<
      CreateAuthenticationCommand,
      AuthenticationAggregate
    >,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.ACTIVATE_AUTHENTICATION)
    private readonly activateAuthenticationHandler: CommandHandler<
      ActivateAuthenticationCommand,
      AuthenticationAggregate
    >,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.LOCK_AUTHENTICATION)
    private readonly lockAuthenticationHandler: CommandHandler<
      LockAuthenticationCommand,
      AuthenticationAggregate
    >,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.UNLOCK_AUTHENTICATION)
    private readonly unlockAuthenticationHandler: CommandHandler<
      UnlockAuthenticationCommand,
      AuthenticationAggregate
    >,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.DISABLE_AUTHENTICATION)
    private readonly disableAuthenticationHandler: CommandHandler<
      DisableAuthenticationCommand,
      AuthenticationAggregate
    >,

    // -------------------------------------------------------------------------
    // Complete Login Handler
    // -------------------------------------------------------------------------
    //
    // AuthenticateLoginHandler owns the complete login workflow:
    //
    // credentials
    //     ↓
    // AuthenticateHandler
    //     ↓
    // Authentication
    //     ↓
    // Device
    //     ↓
    // Session
    //     ↓
    // access + refresh tokens
    //
    // The controller only constructs the command and dispatches it.
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.AUTHENTICATE_LOGIN)
    private readonly authenticateLoginHandler: CommandHandler<
      AuthenticateLoginCommand,
      AuthenticateLoginResult
    >,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.RECORD_AUTHENTICATION_FAILURE)
    private readonly recordAuthenticationFailureHandler: CommandHandler<
      RecordAuthenticationFailureCommand,
      AuthenticationAggregate
    >,

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.CHANGE_PASSWORD)
    private readonly changePasswordHandler: CommandHandler<
      ChangePasswordCommand,
      AuthenticationAggregate
    >,

    // -------------------------------------------------------------------------
    // Authentication Query Handlers
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.QUERY_HANDLERS.GET_AUTHENTICATION)
    private readonly getAuthenticationHandler: QueryHandler<
      GetAuthenticationQuery,
      AuthenticationAggregate | null
    >,

    @Inject(AUTH_TOKENS.QUERY_HANDLERS.GET_AUTHENTICATION_BY_IDENTITY)
    private readonly getAuthenticationByIdentityHandler: QueryHandler<
      GetAuthenticationByIdentityQuery,
      AuthenticationAggregate | null
    >,
  ) {}

  // ===========================================================================
  // Authentication Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Authentication By Identity
  // ---------------------------------------------------------------------------
  //
  // GET /authentications/identity/:identityPublicId
  //
  // Protected:
  //
  //     authentication:read
  //
  // The static "identity" route is declared before:
  //
  //     GET /authentications/:authenticationPublicId
  //
  // ---------------------------------------------------------------------------

  @Get('identity/:identityPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication:read')
  public async getByIdentity(
    @Param() dto: GetAuthenticationByIdentityQueryDto,
  ): Promise<AuthenticationResponse | null> {
    const query = new GetAuthenticationByIdentityQuery(
      new AuthenticationIdentityPublicId(dto.identityPublicId),
    );

    const aggregate =
      await this.getAuthenticationByIdentityHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return AuthenticationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Authentication
  // ---------------------------------------------------------------------------
  //
  // GET /authentications/:authenticationPublicId
  //
  // Protected:
  //
  //     authentication:read
  //
  // ---------------------------------------------------------------------------

  @Get(':authenticationPublicId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication:read')
  public async get(
    @Param() dto: GetAuthenticationQueryDto,
  ): Promise<AuthenticationResponse | null> {
    const query = new GetAuthenticationQuery(
      new AuthenticationPublicId(dto.authenticationPublicId),
    );

    const aggregate = await this.getAuthenticationHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return AuthenticationResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Authentication Onboarding
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Authentication
  // ---------------------------------------------------------------------------
  //
  // POST /authentications
  //
  // Public credential provisioning.
  //
  // Plaintext password is hashed at the HTTP/application boundary and never
  // enters CreateAuthenticationCommand.
  //
  // ---------------------------------------------------------------------------

  @Post()
  public async create(
    @Body() dto: CreateAuthenticationRequestDto,
  ): Promise<AuthenticationResponse> {
    const correlationId = randomUUID();

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const passwordHash = AuthenticationPasswordHash.create(hashedPassword);

    const command = new CreateAuthenticationCommand(
      new AuthenticationIdentityPublicId(dto.identityPublicId),
      correlationId,
      passwordHash,
    );

    const aggregate = await this.createAuthenticationHandler.execute(command);

    return AuthenticationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Activate Authentication
  // ---------------------------------------------------------------------------
  //
  // PATCH /authentications/:authenticationPublicId/activate
  //
  // Public authentication activation.
  //
  // Lifecycle:
  //
  //     PENDING → ACTIVE
  //
  // activatedAt is determined by AuthenticationAggregate.
  //
  // ---------------------------------------------------------------------------

  @Patch(':authenticationPublicId/activate')
  public async activate(
    @Param('authenticationPublicId') authenticationPublicId: string,
  ): Promise<AuthenticationResponse> {
    const command = new ActivateAuthenticationCommand(
      new AuthenticationPublicId(authenticationPublicId),
      randomUUID(),
    );

    const aggregate = await this.activateAuthenticationHandler.execute(command);

    return AuthenticationResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Complete Authentication Login
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------
  //
  // POST /authentications/login
  //
  // Public authentication operation.
  //
  // User-facing request:
  //
  //     {
  //       "emailOrPhoneNumber": "...",
  //       "password": "..."
  //     }
  //
  // Technical device/session context is obtained from the HTTP request rather
  // than exposed as user-facing DTO fields.
  //
  // ---------------------------------------------------------------------------

  @Post('login')
  public async login(
    @Body() dto: AuthenticateLoginRequestDto,
    @Req() request: Request,
  ): Promise<AuthenticateLoginResult> {
    const correlationId = randomUUID();

    // -------------------------------------------------------------------------
    // Technical Device Context
    // -------------------------------------------------------------------------
    //
    // These values are request metadata, not user-facing login fields.
    //
    // They are intentionally absent from AuthenticateLoginRequestDto and
    // therefore do not appear as manual Swagger form fields.
    //
    // -------------------------------------------------------------------------

    const deviceFingerprint = this.getHeader(request, 'x-device-fingerprint');

    const deviceType = this.getHeader(request, 'x-device-type');

    const deviceName = this.getOptionalHeader(request, 'x-device-name');

    const platform = this.getOptionalHeader(request, 'x-device-platform');

    const operatingSystem = this.getOptionalHeader(
      request,
      'x-device-operating-system',
    );

    const operatingSystemVersion = this.getOptionalHeader(
      request,
      'x-device-operating-system-version',
    );

    const browser = this.getOptionalHeader(request, 'x-device-browser');

    const browserVersion = this.getOptionalHeader(
      request,
      'x-device-browser-version',
    );

    // -------------------------------------------------------------------------
    // Session Request Context
    // -------------------------------------------------------------------------

    const ipAddress = this.getClientIpAddress(request);

    const userAgent = this.getOptionalHeader(request, 'user-agent');

    const countryCode = this.getOptionalHeader(request, 'x-country-code');

    const city = this.getOptionalHeader(request, 'x-city');

    // -------------------------------------------------------------------------
    // Application Command
    // -------------------------------------------------------------------------

    const command = new AuthenticateLoginCommand(
      // Credentials
      dto.emailOrPhoneNumber,
      dto.password,

      // Device
      DeviceFingerprint.create(deviceFingerprint),

      this.createDeviceType(deviceType),

      deviceName !== undefined ? DeviceName.create(deviceName) : undefined,

      platform !== undefined ? DevicePlatform.create(platform) : undefined,

      operatingSystem !== undefined
        ? DeviceOperatingSystem.create(operatingSystem)
        : undefined,

      operatingSystemVersion !== undefined
        ? DeviceOperatingSystemVersion.create(operatingSystemVersion)
        : undefined,

      browser !== undefined ? DeviceBrowser.create(browser) : undefined,

      browserVersion !== undefined
        ? DeviceBrowserVersion.create(browserVersion)
        : undefined,

      // Session
      ipAddress !== undefined ? SessionIpAddress.create(ipAddress) : undefined,

      userAgent !== undefined ? SessionUserAgent.create(userAgent) : undefined,

      countryCode !== undefined
        ? SessionCountryCode.create(countryCode)
        : undefined,

      city !== undefined ? SessionCity.create(city) : undefined,

      // Application message metadata
      correlationId,

      // Direct HTTP operation has no causation.
      undefined,
    );

    return this.authenticateLoginHandler.execute(command);
  }

  // ===========================================================================
  // Authentication Lifecycle
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Lock Authentication
  // ---------------------------------------------------------------------------

  @Patch(':authenticationPublicId/lock')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication:lock')
  public async lock(
    @Param('authenticationPublicId') authenticationPublicId: string,
    @Body() dto: LockAuthenticationRequestDto,
  ): Promise<AuthenticationResponse> {
    const command = new LockAuthenticationCommand(
      new AuthenticationPublicId(authenticationPublicId),

      AuthenticationLockedAt.create(new Date(dto.lockedAt)),

      dto.lockedUntil !== undefined
        ? AuthenticationLockedUntil.create(new Date(dto.lockedUntil))
        : undefined,

      dto.reason !== undefined
        ? AuthenticationFailureReason.create(dto.reason)
        : undefined,

      randomUUID(),
    );

    const aggregate = await this.lockAuthenticationHandler.execute(command);

    return AuthenticationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Unlock Authentication
  // ---------------------------------------------------------------------------

  @Patch(':authenticationPublicId/unlock')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication:unlock')
  public async unlock(
    @Param('authenticationPublicId') authenticationPublicId: string,
  ): Promise<AuthenticationResponse> {
    const command = new UnlockAuthenticationCommand(
      new AuthenticationPublicId(authenticationPublicId),
      randomUUID(),
    );

    const aggregate = await this.unlockAuthenticationHandler.execute(command);

    return AuthenticationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Disable Authentication
  // ---------------------------------------------------------------------------

  @Patch(':authenticationPublicId/disable')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication:disable')
  public async disable(
    @Param('authenticationPublicId') authenticationPublicId: string,
    @Body() dto: DisableAuthenticationRequestDto,
  ): Promise<AuthenticationResponse> {
    const command = new DisableAuthenticationCommand(
      new AuthenticationPublicId(authenticationPublicId),

      dto.reason !== undefined
        ? AuthenticationFailureReason.create(dto.reason)
        : undefined,

      randomUUID(),
    );

    const aggregate = await this.disableAuthenticationHandler.execute(command);

    return AuthenticationResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Authentication Security
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Record Authentication Failure
  // ---------------------------------------------------------------------------

  @Post(':authenticationPublicId/failures')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication:record-failure')
  public async recordFailure(
    @Param('authenticationPublicId') authenticationPublicId: string,
    @Body() dto: RecordAuthenticationFailureRequestDto,
  ): Promise<AuthenticationResponse> {
    const command = new RecordAuthenticationFailureCommand(
      new AuthenticationPublicId(authenticationPublicId),

      AuthenticationFailureCount.create(dto.count),

      AuthenticationLastFailedAt.create(new Date(dto.failedAt)),

      AuthenticationFailureReason.create(dto.reason),

      randomUUID(),
    );

    const aggregate =
      await this.recordAuthenticationFailureHandler.execute(command);

    return AuthenticationResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Change Password
  // ---------------------------------------------------------------------------

  @Patch(':authenticationPublicId/password')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication:change-password')
  public async changePassword(
    @Param('authenticationPublicId') authenticationPublicId: string,
    @Body() dto: ChangePasswordRequestDto,
  ): Promise<AuthenticationResponse> {
    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const passwordHash = AuthenticationPasswordHash.create(hashedPassword);

    const command = new ChangePasswordCommand(
      new AuthenticationPublicId(authenticationPublicId),

      passwordHash,

      AuthenticationPasswordChangedAt.create(new Date(dto.changedAt)),

      randomUUID(),
    );

    const aggregate = await this.changePasswordHandler.execute(command);

    return AuthenticationResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // HTTP Request Helpers
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Required Header
  // ---------------------------------------------------------------------------
  //
  // Required technical request metadata.
  //
  // HTTP headers may be represented by Express as:
  //
  //     string
  //     string[]
  //     undefined
  //
  // This helper normalizes those transport representations into a required
  // non-empty string.
  //
  // No domain logic is performed here.
  //
  // ---------------------------------------------------------------------------

  private getHeader(request: Request, name: string): string {
    const value = request.headers[name];

    // -------------------------------------------------------------------------
    // Single header value
    // -------------------------------------------------------------------------

    if (typeof value === 'string' && value.length > 0) {
      return value;
    }

    // -------------------------------------------------------------------------
    // Multiple header values
    // -------------------------------------------------------------------------

    if (Array.isArray(value)) {
      const firstValue = value[0];

      if (typeof firstValue === 'string' && firstValue.length > 0) {
        return firstValue;
      }
    }

    // -------------------------------------------------------------------------
    // Required header missing or empty
    // -------------------------------------------------------------------------

    throw new Error(`Missing required request header: ${name}`);
  }
  // ---------------------------------------------------------------------------
  // Get Optional Header
  // ---------------------------------------------------------------------------

  private getOptionalHeader(
    request: Request,
    name: string,
  ): string | undefined {
    const value = request.headers[name];

    // -------------------------------------------------------------------------
    // Single header value
    // -------------------------------------------------------------------------

    if (typeof value === 'string' && value.length > 0) {
      return value;
    }

    // -------------------------------------------------------------------------
    // Multiple header values
    // -------------------------------------------------------------------------

    if (Array.isArray(value)) {
      const firstValue = value[0];

      if (typeof firstValue === 'string' && firstValue.length > 0) {
        return firstValue;
      }
    }

    // -------------------------------------------------------------------------
    // Header missing or empty
    // -------------------------------------------------------------------------

    return undefined;
  }

  // ---------------------------------------------------------------------------
  // Get Client IP Address
  // ---------------------------------------------------------------------------
  //
  // Prefer the framework's resolved IP address.
  //
  // Proxy trust configuration belongs to infrastructure/application bootstrap
  // and must be configured correctly before relying on forwarded addresses.
  //
  // ---------------------------------------------------------------------------

  private getClientIpAddress(request: Request): string | undefined {
    if (typeof request.ip === 'string' && request.ip.length > 0) {
      return request.ip;
    }

    return undefined;
  }

  // ---------------------------------------------------------------------------
  // Create Device Type
  // ---------------------------------------------------------------------------
  //
  // HTTP headers are untyped strings.
  //
  // DeviceType.create(), however, intentionally accepts the domain's
  // DeviceTypeValue rather than an arbitrary string.
  //
  // We do NOT duplicate the domain's allowed device-type values here.
  //
  // The DeviceType value object remains the single source of truth for:
  //
  // - normalization;
  // - validation;
  // - allowed values;
  // - construction.
  //
  // Parameters<typeof DeviceType.create>[0] extracts the exact argument type
  // expected by the domain factory. This keeps this controller synchronized
  // with the DeviceType.create() contract without inventing a second list of
  // allowed values at the HTTP boundary.
  //
  // Runtime validation remains the responsibility of DeviceType.create().
  //
  // ---------------------------------------------------------------------------

  private createDeviceType(value: string): DeviceType {
    type DeviceTypeValue = Parameters<typeof DeviceType.create>[0];

    return DeviceType.create(value as DeviceTypeValue);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AuthenticationsController;
