// -----------------------------------------------------------------------------
// Device — HTTP Controller
// -----------------------------------------------------------------------------
//
// REST controller for Device aggregate operations.
//
// Aggregate:
//
// DeviceAggregate
// └── DeviceEntity
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
  DeviceOperatingSystemVersion,
  DevicePlatform,
  DevicePublicId,
  DeviceRevokedAt,
  DeviceTrustedAt,
  DeviceType,
  DeviceTypeValue,
} from '../../../domain/value-objects';

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
@UseGuards(JwtAuthGuard, PermissionsGuard)
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
  // The authenticated Identity is authoritative.
  //
  // No identityPublicId is accepted from the request.
  //
  // ---------------------------------------------------------------------------

  @Get('active')
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
  // ---------------------------------------------------------------------------

  @Get(':devicePublicId')
  @RequirePermissions('device:read')
  public async get(
    @Param() dto: GetDeviceQueryDto,
  ): Promise<DeviceResponse | null> {
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
  // There is intentionally no query DTO because the query contains no
  // client-supplied filtering parameters.
  //
  // ---------------------------------------------------------------------------

  @Get()
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
  // The Identity public identifier is obtained from the authenticated
  // principal. It is never accepted from the request body.
  //
  // The request DTO contains transport primitives only.
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
      // Operating system
      // -----------------------------------------------------------------------

      dto.operatingSystem !== undefined
        ? DeviceOperatingSystem.create(dto.operatingSystem)
        : undefined,

      // -----------------------------------------------------------------------
      // Operating system version
      // -----------------------------------------------------------------------

      dto.operatingSystemVersion !== undefined
        ? DeviceOperatingSystemVersion.create(dto.operatingSystemVersion)
        : undefined,

      // -----------------------------------------------------------------------
      // Browser
      // -----------------------------------------------------------------------

      dto.browser !== undefined ? DeviceBrowser.create(dto.browser) : undefined,

      // -----------------------------------------------------------------------
      // Browser version
      // -----------------------------------------------------------------------

      dto.browserVersion !== undefined
        ? DeviceBrowserVersion.create(dto.browserVersion)
        : undefined,

      // -----------------------------------------------------------------------
      // Device type
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
  // ---------------------------------------------------------------------------

  @Patch(':devicePublicId/trust')
  @RequirePermissions('device:trust')
  public async trust(
    @Param('devicePublicId') devicePublicId: string,
    @Body() dto: TrustDeviceRequestDto,
  ): Promise<DeviceResponse> {
    const command = new TrustDeviceCommand(
      // Device public ID
      new DevicePublicId(devicePublicId),

      // Trusted at
      DeviceTrustedAt.create(new Date(dto.trustedAt)),

      // Correlation
      randomUUID(),

      // Causation
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
  // ---------------------------------------------------------------------------
  //
  // This records the latest observation of the Device.
  //
  // ---------------------------------------------------------------------------

  @Patch(':devicePublicId/seen')
  @RequirePermissions('device:write')
  public async recordSeen(
    @Param('devicePublicId') devicePublicId: string,
    @Body() dto: RecordDeviceSeenRequestDto,
  ): Promise<DeviceResponse> {
    const command = new RecordDeviceSeenCommand(
      // Device public ID
      new DevicePublicId(devicePublicId),

      // Last seen at
      DeviceLastSeenAt.create(new Date(dto.lastSeenAt)),

      // Correlation
      randomUUID(),

      // Causation
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
  // ---------------------------------------------------------------------------

  @Patch(':devicePublicId/revoke')
  @RequirePermissions('device:revoke')
  public async revoke(
    @Param('devicePublicId') devicePublicId: string,
    @Body() dto: RevokeDeviceRequestDto,
  ): Promise<DeviceResponse> {
    const command = new RevokeDeviceCommand(
      // Device public ID
      new DevicePublicId(devicePublicId),

      // Revoked at
      DeviceRevokedAt.create(new Date(dto.revokedAt)),

      // Correlation
      randomUUID(),

      // Causation
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
  // JwtAuthGuard is expected to populate:
  //
  //     request.user.identityPublicId
  //
  // The value is converted into the Device bounded-context reference:
  //
  //     DeviceIdentityPublicId
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
      throw new Error(
        'Authenticated principal does not contain identityPublicId.',
      );
    }

    return new DeviceIdentityPublicId(user.identityPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default DevicesController;
