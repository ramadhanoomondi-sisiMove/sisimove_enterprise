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
// - password hashing for password provisioning/change;
// - dispatching application commands and queries;
// - mapping application/domain results to transport responses;
// - extracting technical request metadata required by login.
//
// The controller contains NO business rules.
//
// Domain behavior remains inside:
//
// - AuthenticationAggregate;
// - AuthenticationEntity.
//
// Application orchestration remains inside:
//
// - command handlers;
// - query handlers.
//
// Persistence remains behind:
//
// - repositories.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundaries:
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
// These are independent aggregate boundaries.
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
// - orchestrate the complete login workflow;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Authentication security boundary:
//
// Public authentication operations:
//
// - create authentication;
// - activate authentication;
// - login.
//
// Protected Authentication operations:
//
// - retrieve authentication;
// - retrieve authentication by identity;
// - lock authentication;
// - unlock authentication;
// - disable authentication;
// - record authentication failure;
// - change authentication password.
//
// Authentication and authorization remain separate concerns.
//
// JwtAuthGuard establishes:
//
//     "Who is authenticated?"
//
// PermissionsGuard establishes:
//
//     "Is the authenticated principal authorized?"
//
// -----------------------------------------------------------------------------
//
// Complete login:
//
// The public HTTP request body contains only:
//
//     emailOrPhoneNumber
//     password
//
// Technical device/session information is HTTP request metadata and is NOT
// exposed as user-facing DTO properties.
//
//     HTTP request
//          │
//          ├── credentials
//          │      └── AuthenticateLoginRequestDto
//          │
//          └── technical request context
//                 ├── device fingerprint
//                 ├── device type
//                 ├── device name
//                 ├── device platform
//                 ├── operating system
//                 ├── operating-system version
//                 ├── browser
//                 ├── browser version
//                 ├── user agent
//                 ├── IP address
//                 ├── country
//                 └── city
//          │
//          ▼
// AuthenticateLoginCommand
//          │
//          ▼
// AuthenticateLoginHandler
//          │
//          ├── Authentication
//          ├── Device
//          ├── Session
//          ├── access token
//          └── refresh token
//          │
//          ▼
// AuthenticateLoginResult
//
// The controller does not participate in orchestration beyond constructing the
// application command.
//
// -----------------------------------------------------------------------------
//
// The login client does NOT provide:
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
// These values are generated or derived by the application workflow.
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
// - causationId is undefined because there is no preceding application
//   command/event in this HTTP request.
//
// -----------------------------------------------------------------------------
//
// Temporal responsibility:
//
// Aggregate-owned mutation timestamps are determined by aggregate behavior.
//
// The controller therefore does NOT construct aggregate-owned timestamps such
// as:
//
// - activatedAt.
//
// Where the command contract explicitly requires security/business timestamps
// supplied by the transport contract, the controller converts them from
// transport primitives to domain value objects.
//
// Examples:
//
// - lockedAt;
// - lockedUntil;
// - failedAt;
// - changedAt.
//
// -----------------------------------------------------------------------------
//
// Login failure behavior:
//
// Failed credential authentication MUST terminate the login workflow.
//
// The controller simply returns the discriminated login result.
//
// Example:
//
//     { success: false, reason: 'INVALID_CREDENTIALS' }
//
// The controller does NOT:
//
// - resolve/create a Device;
// - create a Session;
// - generate tokens;
// - reveal whether the identity exists;
// - reveal whether authentication exists;
// - expose device-validation details.
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
// authentication workflow.
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
  BadRequestException,
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

import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

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

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.AUTHENTICATE_LOGIN)
    private readonly authenticateLoginHandler: CommandHandler<
      AuthenticateLoginCommand,
      AuthenticateLoginResult
    >,

    // -------------------------------------------------------------------------
    // Authentication Security Command Handlers
    // -------------------------------------------------------------------------

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
  // Returns the Authentication aggregate associated with an Identity.
  //
  // Authorization:
  //
  //     authentication:read
  //
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
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

  @ApiBearerAuth('access-token')
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
  // Public onboarding operation.
  //
  // Password hashing occurs before the application command is constructed.
  //
  // The plaintext password therefore never crosses into the application
  // command contract.
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
  // Activation is intentionally kept public according to the current
  // authentication onboarding contract.
  //
  // If activation becomes an administrative operation, this endpoint should
  // be protected with JwtAuthGuard + PermissionsGuard.
  //
  // ---------------------------------------------------------------------------

  @Patch(':authenticationPublicId/activate')
  public async activate(
    @Param('authenticationPublicId')
    authenticationPublicId: string,
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
  // Request body:
  //
  //     {
  //       "emailOrPhoneNumber": "...",
  //       "password": "..."
  //     }
  //
  // Required technical headers:
  //
  //     x-device-fingerprint
  //     x-device-type
  //
  // Optional technical headers:
  //
  //     x-device-name
  //     x-device-platform
  //     x-device-operating-system
  //     x-device-operating-system-version
  //     x-device-browser
  //     x-device-browser-version
  //     x-country-code
  //     x-city
  //
  // Standard HTTP header:
  //
  //     user-agent
  //
  // Technical metadata intentionally remains outside the request DTO.
  //
  // ---------------------------------------------------------------------------

  @ApiHeader({
    name: 'x-device-fingerprint',
    description: 'Stable fingerprint identifying the client device.',
    required: true,
  })
  @ApiHeader({
    name: 'x-device-type',
    description: 'Client device type.',
    required: true,
  })
  @ApiHeader({
    name: 'x-device-name',
    description: 'Human-readable device name.',
    required: false,
  })
  @ApiHeader({
    name: 'x-device-platform',
    description: 'Client device platform.',
    required: false,
  })
  @ApiHeader({
    name: 'x-device-operating-system',
    description: 'Client operating system.',
    required: false,
  })
  @ApiHeader({
    name: 'x-device-operating-system-version',
    description: 'Client operating-system version.',
    required: false,
  })
  @ApiHeader({
    name: 'x-device-browser',
    description: 'Client browser.',
    required: false,
  })
  @ApiHeader({
    name: 'x-device-browser-version',
    description: 'Client browser version.',
    required: false,
  })
  @ApiHeader({
    name: 'x-country-code',
    description: 'ISO 3166-1 alpha-2 country code.',
    required: false,
  })
  @ApiHeader({
    name: 'x-city',
    description: 'Client city.',
    required: false,
  })
  @Post('login')
  public async login(
    @Body() dto: AuthenticateLoginRequestDto,
    @Req() request: Request,
  ): Promise<AuthenticateLoginResult> {
    // -------------------------------------------------------------------------
    // Application Message Metadata
    // -------------------------------------------------------------------------

    const correlationId = randomUUID();

    // -------------------------------------------------------------------------
    // Technical Device Context
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
    //
    // The command contains domain value objects rather than raw HTTP metadata.
    //
    // The complete login workflow remains inside AuthenticateLoginHandler.
    //
    // -------------------------------------------------------------------------

    const command = new AuthenticateLoginCommand(
      // ---------------------------------------------------------------------
      // Credentials
      // ---------------------------------------------------------------------

      dto.emailOrPhoneNumber,
      dto.password,

      // ---------------------------------------------------------------------
      // Device
      // ---------------------------------------------------------------------

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

      // ---------------------------------------------------------------------
      // Session
      // ---------------------------------------------------------------------

      ipAddress !== undefined ? SessionIpAddress.create(ipAddress) : undefined,

      userAgent !== undefined ? SessionUserAgent.create(userAgent) : undefined,

      countryCode !== undefined
        ? SessionCountryCode.create(countryCode)
        : undefined,

      city !== undefined ? SessionCity.create(city) : undefined,

      // ---------------------------------------------------------------------
      // Application Message Metadata
      // ---------------------------------------------------------------------

      correlationId,

      // Direct HTTP operation has no causation.
      undefined,
    );

    // -------------------------------------------------------------------------
    // Complete Login Workflow
    // -------------------------------------------------------------------------
    //
    // The handler is solely responsible for deciding whether login succeeds
    // and for orchestrating Authentication, Device, Session, and token
    // creation.
    //
    // -------------------------------------------------------------------------

    return this.authenticateLoginHandler.execute(command);
  }

  // ===========================================================================
  // Authentication Lifecycle
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Lock Authentication
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @Patch(':authenticationPublicId/lock')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication:lock')
  public async lock(
    @Param('authenticationPublicId')
    authenticationPublicId: string,
    @Body()
    dto: LockAuthenticationRequestDto,
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

  @ApiBearerAuth('access-token')
  @Patch(':authenticationPublicId/unlock')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication:unlock')
  public async unlock(
    @Param('authenticationPublicId')
    authenticationPublicId: string,
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

  @ApiBearerAuth('access-token')
  @Patch(':authenticationPublicId/disable')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication:disable')
  public async disable(
    @Param('authenticationPublicId')
    authenticationPublicId: string,
    @Body()
    dto: DisableAuthenticationRequestDto,
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
  //
  // This endpoint is an administrative/security operation.
  //
  // Login itself does NOT call this endpoint through HTTP. Failed credential
  // authentication is handled internally by the authentication workflow.
  //
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @Post(':authenticationPublicId/failures')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication:record-failure')
  public async recordFailure(
    @Param('authenticationPublicId')
    authenticationPublicId: string,
    @Body()
    dto: RecordAuthenticationFailureRequestDto,
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
  //
  // The client provides a plaintext password only through the transport DTO.
  //
  // PasswordHasher converts it into a password hash before the application
  // command is constructed.
  //
  // ---------------------------------------------------------------------------

  @ApiBearerAuth('access-token')
  @Patch(':authenticationPublicId/password')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('authentication:change-password')
  public async changePassword(
    @Param('authenticationPublicId')
    authenticationPublicId: string,
    @Body()
    dto: ChangePasswordRequestDto,
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
  // Express represents request headers as:
  //
  // - string;
  // - string[];
  // - undefined.
  //
  // Required headers are normalized into a single non-empty string.
  //
  // Missing or empty required headers are transport errors and therefore become
  // HTTP 400 Bad Request.
  //
  // ---------------------------------------------------------------------------

  private getHeader(request: Request, name: string): string {
    const value = request.headers[name];

    // -------------------------------------------------------------------------
    // Single Header Value
    // -------------------------------------------------------------------------

    if (typeof value === 'string') {
      const normalized = value.trim();

      if (normalized.length > 0) {
        return normalized;
      }
    }

    // -------------------------------------------------------------------------
    // Multiple Header Values
    // -------------------------------------------------------------------------

    if (Array.isArray(value)) {
      const firstValue = value[0];

      if (typeof firstValue === 'string') {
        const normalized = firstValue.trim();

        if (normalized.length > 0) {
          return normalized;
        }
      }
    }

    // -------------------------------------------------------------------------
    // Missing / Empty Header
    // -------------------------------------------------------------------------

    throw new BadRequestException(`Missing required request header: ${name}`);
  }

  // ---------------------------------------------------------------------------
  // Get Optional Header
  // ---------------------------------------------------------------------------
  //
  // Missing, empty, or unsupported header values are normalized to undefined.
  //
  // ---------------------------------------------------------------------------

  private getOptionalHeader(
    request: Request,
    name: string,
  ): string | undefined {
    const value = request.headers[name];

    // -------------------------------------------------------------------------
    // Single Header Value
    // -------------------------------------------------------------------------

    if (typeof value === 'string') {
      const normalized = value.trim();

      return normalized.length > 0 ? normalized : undefined;
    }

    // -------------------------------------------------------------------------
    // Multiple Header Values
    // -------------------------------------------------------------------------

    if (Array.isArray(value)) {
      const firstValue = value[0];

      if (typeof firstValue === 'string') {
        const normalized = firstValue.trim();

        return normalized.length > 0 ? normalized : undefined;
      }
    }

    // -------------------------------------------------------------------------
    // Missing Header
    // -------------------------------------------------------------------------

    return undefined;
  }

  // ---------------------------------------------------------------------------
  // Get Client IP Address
  // ---------------------------------------------------------------------------
  //
  // Express resolves request.ip according to its proxy/trust configuration.
  //
  // Proxy trust configuration therefore belongs to infrastructure/bootstrap
  // configuration rather than this controller.
  //
  // ---------------------------------------------------------------------------

  private getClientIpAddress(request: Request): string | undefined {
    if (typeof request.ip !== 'string') {
      return undefined;
    }

    const normalized = request.ip.trim();

    return normalized.length > 0 ? normalized : undefined;
  }

  // ---------------------------------------------------------------------------
  // Create Device Type
  // ---------------------------------------------------------------------------
  //
  // HTTP headers are untyped strings.
  //
  // DeviceType remains the domain source of truth for:
  //
  // - allowed values;
  // - validation;
  // - normalization;
  // - construction.
  //
  // The controller deliberately does not duplicate the DeviceType value list.
  //
  // Parameters<typeof DeviceType.create>[0] obtains the exact argument type
  // expected by the domain factory.
  //
  // Runtime validation remains inside DeviceType.create().
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
