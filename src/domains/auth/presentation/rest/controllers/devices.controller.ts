// -----------------------------------------------------------------------------
// Device — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Device aggregate operations.
//
// Aggregate:
//
//     DeviceAggregate
//     └── DeviceEntity
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
// This controller contains NO Device business rules.
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURAL BOUNDARIES
// -----------------------------------------------------------------------------
//
// Domain:
//
//     DeviceAggregate
//     DeviceEntity
//
// Application:
//
//     command handlers;
//     query handlers.
//
// Persistence:
//
//     DeviceRepository.
//
// Security:
//
//     JWT authentication;
//     authorization;
//     device ownership;
//     device lifecycle policy;
//     trusted-device policy;
//     device-revocation policy.
//
// Security and ownership rules are implemented by the appropriate
// application/domain services and handlers rather than by this controller.
//
// -----------------------------------------------------------------------------
//
// AGGREGATE BOUNDARY
// -----------------------------------------------------------------------------
//
// Device is an independent aggregate:
//
//     DeviceAggregate
//     └── DeviceEntity
//
// Identity is a separate aggregate:
//
//     IdentityAggregate
//     └── IdentityEntity
//
// Authentication is a separate aggregate:
//
//     AuthenticationAggregate
//     └── AuthenticationEntity
//
// Session is a separate aggregate:
//
//     SessionAggregate
//     └── SessionEntity
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
// These are deliberately separate security concerns.
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
// The controller does not implement either security mechanism.
//
// -----------------------------------------------------------------------------
//
// ENDPOINT SECURITY MODEL
// -----------------------------------------------------------------------------
//
// Query operations:
//
//     GET /devices/active
//         JwtAuthGuard + PermissionsGuard
//         device:read
//
//     GET /devices/:devicePublicId
//         JwtAuthGuard + PermissionsGuard
//         device:read
//
//     GET /devices
//         JwtAuthGuard + PermissionsGuard
//         device:read
//
// Device-management operations:
//
//     POST /devices
//         JwtAuthGuard + PermissionsGuard
//         device:create
//
//     PATCH /devices/:devicePublicId/trust
//         JwtAuthGuard + PermissionsGuard
//         device:trust
//
//     PATCH /devices/:devicePublicId/seen
//         JwtAuthGuard + PermissionsGuard
//         device:write
//
//     PATCH /devices/:devicePublicId/revoke
//         JwtAuthGuard + PermissionsGuard
//         device:revoke
//
// Authentication and authorization are intentionally declared at the
// endpoint level rather than at controller level.
//
// This prevents a future public endpoint from accidentally inheriting an
// inappropriate security policy and makes each endpoint's security boundary
// explicit.
//
// -----------------------------------------------------------------------------
//
// DEVICE OWNERSHIP
// -----------------------------------------------------------------------------
//
// Device public IDs are not authorization credentials.
//
// For operations such as:
//
//     GET /devices/:devicePublicId
//     PATCH /devices/:devicePublicId/trust
//     PATCH /devices/:devicePublicId/seen
//     PATCH /devices/:devicePublicId/revoke
//
// the application layer MUST ensure that the authenticated principal is
// permitted to operate on the referenced Device.
//
// Conceptually:
//
//     request.user.identityPublicId
//                 │
//                 ▼
//        authenticated Identity
//                 │
//                 ▼
//             Device
//                 │
//                 └── identityPublicId
//
// The controller does not implement this ownership rule.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT — IDENTITY BINDING
// -----------------------------------------------------------------------------
//
// Device creation is always performed in the security context of the
// authenticated Identity.
//
// Therefore:
//
//     POST /devices
//
// MUST NOT accept:
//
//     identityPublicId
//
// from the client request body.
//
// Instead:
//
//     JWT
//       │
//       ▼
//     JwtStrategy
//       │
//       ▼
//     request.user.identityPublicId
//       │
//       ▼
//     DeviceIdentityPublicId
//
// This prevents a caller from attempting to create a Device belonging to
// another Identity simply by supplying another Identity public ID.
//
// -----------------------------------------------------------------------------
//
// DEVICE CREATION
// -----------------------------------------------------------------------------
//
// Normal Device creation may occur during authentication:
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
//                 └── establish Session
//
// Therefore:
//
//     POST /devices
//
// is an explicit Device-management operation.
//
// If Device creation is required as part of authentication, the authentication
// application workflow should invoke the Device application capability
// directly rather than making an internal HTTP request to this controller.
//
// -----------------------------------------------------------------------------
//
// TRUST DEVICE
// -----------------------------------------------------------------------------
//
// Trusting a Device is a security-sensitive state transition.
//
//     UNTRUSTED
//         │
//         ▼
//     TRUSTED
//
// The client may request the operation, but authorization and Device ownership
// must be enforced by the application layer.
//
// The controller only converts:
//
//     trustedAt → DeviceTrustedAt
//
// -----------------------------------------------------------------------------
//
// RECORD DEVICE SEEN
// -----------------------------------------------------------------------------
//
// Recording a Device observation updates the Device's last-seen information.
//
//     lastSeenAt
//
// This operation does not establish authentication by itself.
//
// The authenticated principal and authorization policy remain responsible for
// determining whether the caller may update the referenced Device.
//
// -----------------------------------------------------------------------------
//
// REVOKE DEVICE
// -----------------------------------------------------------------------------
//
// Revoking a Device is a security-sensitive lifecycle operation.
//
//     ACTIVE / TRUSTED
//             │
//             ▼
//          REVOKED
//
// The controller does not directly mutate the Device aggregate.
//
// It constructs RevokeDeviceCommand and delegates the state transition to the
// application layer.
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
// - resolve authorization permissions;
// - determine Device ownership;
// - mutate Device state directly;
// - access Prisma;
// - access repositories directly;
// - create Identity records;
// - create Authentication records;
// - create Sessions;
// - create Recovery records;
// - create OTP Challenges;
// - perform external security side effects.
//
// -----------------------------------------------------------------------------
//
// CORRELATION AND CAUSATION
// -----------------------------------------------------------------------------
//
// HTTP-originated commands receive a new correlation ID:
//
//     correlationId = randomUUID()
//
// An optional causation ID is propagated only when present.
//
// With:
//
//     exactOptionalPropertyTypes: true
//
// optional properties should be omitted rather than explicitly assigned
// undefined when using object-based command contracts.
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

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
  CreateDeviceCommand,
  RecordDeviceSeenCommand,
  RevokeDeviceCommand,
  TrustDeviceCommand,
} from '../../../application/commands';

// -----------------------------------------------------------------------------
// Application — Queries
// -----------------------------------------------------------------------------

import {
  GetActiveDevicesQuery,
  GetDeviceQuery,
  GetDevicesQuery,
} from '../../../application/queries';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { DeviceAggregate } from '../../../domain/aggregates/device.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  DeviceBrowser,
  DeviceBrowserVersion,
  DeviceFingerprint,
  DeviceIdentityPublicId,
  DeviceLastSeenAt,
  DeviceName,
  DeviceOperatingSystem,
  DeviceOperatingSystemVersion,
  DevicePlatform,
  DevicePublicId,
  DeviceRevokedAt,
  DeviceTrustedAt,
  DeviceType,
} from '../../../domain/value-objects';

import type { DeviceTypeValue } from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Presentation — Request DTOs
// -----------------------------------------------------------------------------

import {
  CreateDeviceRequestDto,
  RecordDeviceSeenRequestDto,
  RevokeDeviceRequestDto,
  TrustDeviceRequestDto,
} from '../dto/request';

// -----------------------------------------------------------------------------
// Presentation — Query DTOs
// -----------------------------------------------------------------------------

import { GetDeviceQueryDto } from '../queries';

// -----------------------------------------------------------------------------
// Presentation — Response
// -----------------------------------------------------------------------------

import type { DeviceResponse } from '../mappers/device.response.mapper';

import { DeviceResponseMapper } from '../mappers/device.response.mapper';

// =============================================================================
// Controller
// =============================================================================

@ApiTags('Devices')
@Controller('devices')
export class DevicesController {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Create Device
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.CREATE_DEVICE)
    private readonly createDeviceHandler: CommandHandler<
      CreateDeviceCommand,
      DeviceAggregate
    >,

    // -------------------------------------------------------------------------
    // Trust Device
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.TRUST_DEVICE)
    private readonly trustDeviceHandler: CommandHandler<
      TrustDeviceCommand,
      DeviceAggregate
    >,

    // -------------------------------------------------------------------------
    // Record Device Seen
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.RECORD_DEVICE_SEEN)
    private readonly recordDeviceSeenHandler: CommandHandler<
      RecordDeviceSeenCommand,
      DeviceAggregate
    >,

    // -------------------------------------------------------------------------
    // Revoke Device
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.COMMAND_HANDLERS.REVOKE_DEVICE)
    private readonly revokeDeviceHandler: CommandHandler<
      RevokeDeviceCommand,
      DeviceAggregate
    >,

    // -------------------------------------------------------------------------
    // Get Device
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.QUERY_HANDLERS.GET_DEVICE)
    private readonly getDeviceHandler: QueryHandler<
      GetDeviceQuery,
      DeviceAggregate | null
    >,

    // -------------------------------------------------------------------------
    // Get Devices
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.QUERY_HANDLERS.GET_DEVICES)
    private readonly getDevicesHandler: QueryHandler<
      GetDevicesQuery,
      DeviceAggregate[]
    >,

    // -------------------------------------------------------------------------
    // Get Active Devices
    // -------------------------------------------------------------------------

    @Inject(AUTH_TOKENS.QUERY_HANDLERS.GET_ACTIVE_DEVICES)
    private readonly getActiveDevicesHandler: QueryHandler<
      GetActiveDevicesQuery,
      DeviceAggregate[]
    >,
  ) {}

  // ===========================================================================
  // Queries
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Active Devices
  // ---------------------------------------------------------------------------
  //
  // GET /devices/active
  //
  // Returns active Devices belonging to the authenticated Identity.
  //
  // The Identity is derived exclusively from the authenticated security
  // principal.
  //
  // No identityPublicId is accepted from the request.
  //
  // ---------------------------------------------------------------------------

  @Get('active')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('device:read')
  public async getActive(@Req() request: Request): Promise<DeviceResponse[]> {
    const identityPublicId = this.getAuthenticatedIdentityPublicId(request);

    const query = new GetActiveDevicesQuery(identityPublicId);

    const aggregates = await this.getActiveDevicesHandler.execute(query);

    return aggregates.map((aggregate) =>
      DeviceResponseMapper.toResponse(aggregate),
    );
  }

  // ---------------------------------------------------------------------------
  // Get Device
  // ---------------------------------------------------------------------------
  //
  // GET /devices/:devicePublicId
  //
  // The Device public ID identifies the resource.
  //
  // The application layer MUST verify that the authenticated principal is
  // authorized to access the referenced Device.
  //
  // ---------------------------------------------------------------------------

  @Get(':devicePublicId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('device:read')
  public async get(
    @Req() request: Request,
    @Param() dto: GetDeviceQueryDto,
  ): Promise<DeviceResponse | null> {
    // -------------------------------------------------------------------------
    // Authentication context
    // -------------------------------------------------------------------------
    //
    // Reading the authenticated Identity here intentionally makes the security
    // context available to the application layer if the query contract supports
    // ownership-aware lookup.
    //
    // If GetDeviceQuery currently accepts only DevicePublicId, ownership must
    // still be enforced by the handler/application authorization policy.
    //
    // -------------------------------------------------------------------------

    this.getAuthenticatedIdentityPublicId(request);

    const devicePublicId = new DevicePublicId(dto.devicePublicId);

    const query = new GetDeviceQuery(devicePublicId);

    const aggregate = await this.getDeviceHandler.execute(query);

    if (aggregate === null) {
      return null;
    }

    return DeviceResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Get Devices
  // ---------------------------------------------------------------------------
  //
  // GET /devices
  //
  // Devices are scoped to the authenticated Identity.
  //
  // There is intentionally no query DTO because this endpoint does not expose
  // client-controlled filtering.
  //
  // ---------------------------------------------------------------------------

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('device:read')
  public async getMany(@Req() request: Request): Promise<DeviceResponse[]> {
    const identityPublicId = this.getAuthenticatedIdentityPublicId(request);

    const query = new GetDevicesQuery(identityPublicId);

    const aggregates = await this.getDevicesHandler.execute(query);

    return aggregates.map((aggregate) =>
      DeviceResponseMapper.toResponse(aggregate),
    );
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Create Device
  // ---------------------------------------------------------------------------
  //
  // POST /devices
  //
  // The Identity public identifier is ALWAYS obtained from the authenticated
  // principal.
  //
  // It is NEVER accepted from the request body.
  //
  // DTO → Domain mapping:
  //
  //     string → DeviceFingerprint
  //     string → DeviceName
  //     string → DevicePlatform
  //     string → DeviceOperatingSystem
  //     string → DeviceOperatingSystemVersion
  //     string → DeviceBrowser
  //     string → DeviceBrowserVersion
  //     string → DeviceType
  //
  // ---------------------------------------------------------------------------

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('device:create')
  public async create(
    @Req() request: Request,
    @Body() dto: CreateDeviceRequestDto,
  ): Promise<DeviceResponse> {
    const identityPublicId = this.getAuthenticatedIdentityPublicId(request);

    const command = new CreateDeviceCommand(
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      identityPublicId,

      // -----------------------------------------------------------------------
      // Fingerprint
      // -----------------------------------------------------------------------

      DeviceFingerprint.create(dto.fingerprint),

      // -----------------------------------------------------------------------
      // Name
      // -----------------------------------------------------------------------

      dto.name !== undefined ? DeviceName.create(dto.name) : undefined,

      // -----------------------------------------------------------------------
      // Platform
      // -----------------------------------------------------------------------

      dto.platform !== undefined
        ? DevicePlatform.create(dto.platform)
        : undefined,

      // -----------------------------------------------------------------------
      // Operating System
      // -----------------------------------------------------------------------

      dto.operatingSystem !== undefined
        ? DeviceOperatingSystem.create(dto.operatingSystem)
        : undefined,

      // -----------------------------------------------------------------------
      // Operating System Version
      // -----------------------------------------------------------------------

      dto.operatingSystemVersion !== undefined
        ? DeviceOperatingSystemVersion.create(dto.operatingSystemVersion)
        : undefined,

      // -----------------------------------------------------------------------
      // Browser
      // -----------------------------------------------------------------------

      dto.browser !== undefined ? DeviceBrowser.create(dto.browser) : undefined,

      // -----------------------------------------------------------------------
      // Browser Version
      // -----------------------------------------------------------------------

      dto.browserVersion !== undefined
        ? DeviceBrowserVersion.create(dto.browserVersion)
        : undefined,

      // -----------------------------------------------------------------------
      // Device Type
      // -----------------------------------------------------------------------

      DeviceType.create(dto.deviceType as DeviceTypeValue),

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      randomUUID(),

      // -----------------------------------------------------------------------
      // Causation
      // -----------------------------------------------------------------------

      dto.causationId,
    );

    // -------------------------------------------------------------------------
    // Execute
    // -------------------------------------------------------------------------

    const aggregate = await this.createDeviceHandler.execute(command);

    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return DeviceResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Trust Device
  // ---------------------------------------------------------------------------
  //
  // PATCH /devices/:devicePublicId/trust
  //
  // Security-sensitive Device lifecycle operation.
  //
  // ---------------------------------------------------------------------------

  @Patch(':devicePublicId/trust')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('device:trust')
  public async trust(
    @Param('devicePublicId') devicePublicId: string,
    @Body() dto: TrustDeviceRequestDto,
  ): Promise<DeviceResponse> {
    const command = new TrustDeviceCommand(
      // -----------------------------------------------------------------------
      // Device public ID
      // -----------------------------------------------------------------------

      new DevicePublicId(devicePublicId),

      // -----------------------------------------------------------------------
      // Trusted at
      // -----------------------------------------------------------------------

      DeviceTrustedAt.create(new Date(dto.trustedAt)),

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      randomUUID(),

      // -----------------------------------------------------------------------
      // Causation
      // -----------------------------------------------------------------------

      dto.causationId,
    );

    const aggregate = await this.trustDeviceHandler.execute(command);

    return DeviceResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Record Device Seen
  // ---------------------------------------------------------------------------
  //
  // PATCH /devices/:devicePublicId/seen
  //
  // Records the latest observation of the Device.
  //
  // This endpoint does not authenticate the Device itself. The caller is
  // authenticated through the access-token security boundary.
  //
  // ---------------------------------------------------------------------------

  @Patch(':devicePublicId/seen')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('device:write')
  public async recordSeen(
    @Param('devicePublicId') devicePublicId: string,
    @Body() dto: RecordDeviceSeenRequestDto,
  ): Promise<DeviceResponse> {
    const command = new RecordDeviceSeenCommand(
      // -----------------------------------------------------------------------
      // Device public ID
      // -----------------------------------------------------------------------

      new DevicePublicId(devicePublicId),

      // -----------------------------------------------------------------------
      // Last seen at
      // -----------------------------------------------------------------------

      DeviceLastSeenAt.create(new Date(dto.lastSeenAt)),

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      randomUUID(),

      // -----------------------------------------------------------------------
      // Causation
      // -----------------------------------------------------------------------

      dto.causationId,
    );

    const aggregate = await this.recordDeviceSeenHandler.execute(command);

    return DeviceResponseMapper.toResponse(aggregate);
  }

  // ---------------------------------------------------------------------------
  // Revoke Device
  // ---------------------------------------------------------------------------
  //
  // PATCH /devices/:devicePublicId/revoke
  //
  // Security-sensitive Device lifecycle operation.
  //
  // ---------------------------------------------------------------------------

  @Patch(':devicePublicId/revoke')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('device:revoke')
  public async revoke(
    @Param('devicePublicId') devicePublicId: string,
    @Body() dto: RevokeDeviceRequestDto,
  ): Promise<DeviceResponse> {
    const command = new RevokeDeviceCommand(
      // -----------------------------------------------------------------------
      // Device public ID
      // -----------------------------------------------------------------------

      new DevicePublicId(devicePublicId),

      // -----------------------------------------------------------------------
      // Revoked at
      // -----------------------------------------------------------------------

      DeviceRevokedAt.create(new Date(dto.revokedAt)),

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      randomUUID(),

      // -----------------------------------------------------------------------
      // Causation
      // -----------------------------------------------------------------------

      dto.causationId,
    );

    const aggregate = await this.revokeDeviceHandler.execute(command);

    return DeviceResponseMapper.toResponse(aggregate);
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Get Authenticated Identity
  // ---------------------------------------------------------------------------
  //
  // JwtStrategy transforms:
  //
  //     JWT sub
  //        ↓
  //     identityPublicId
  //
  // Therefore request.user is already an authenticated security principal.
  //
  // This helper does NOT:
  //
  // - decode the JWT;
  // - inspect the Authorization header;
  // - verify the JWT;
  // - resolve Identity from persistence.
  //
  // It only validates the shape of the security context supplied by
  // JwtStrategy and converts it into the Device bounded-context reference.
  //
  // ---------------------------------------------------------------------------

  private getAuthenticatedIdentityPublicId(
    request: Request,
  ): DeviceIdentityPublicId {
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

    return new DeviceIdentityPublicId(user.identityPublicId.trim());
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default DevicesController;
