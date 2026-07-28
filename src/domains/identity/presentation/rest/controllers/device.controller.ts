// src/domains/identity/presentation/rest/device.controller.ts

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CorrelationId } from '../../../../../foundation/logging/correlation-id';

import {
  RegisterDeviceCommand,
  type DeviceMetadata,
} from '../../../application/commands/register-device.command';
import { RevokeDeviceCommand } from '../../../application/commands/revoke-device.command';
import { TrustDeviceCommand } from '../../../application/commands/trust-device.command';

import { RegisterDeviceHandler } from '../../../application/handlers/register-device.handler';
import { RevokeDeviceHandler } from '../../../application/handlers/revoke-device.handler';
import { TrustDeviceHandler } from '../../../application/handlers/trust-device.handler';

import { GetDeviceHandler } from '../../../application/handlers/query-handlers/get-device.handler';
import { ListIdentityDevicesHandler } from '../../../application/handlers/query-handlers/list-identity-devices.handler';

import { GetDeviceQuery } from '../../../application/queries/get-device.query';
import { ListIdentityDevicesQuery } from '../../../application/queries/list-identity-devices.query';

import type { DeviceEntity } from '../../../domain/entities/device.entity';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { RequirePermissions } from '../../auth/require-permissions.decorator';

import { RegisterDeviceDto } from '../dto/register-device.dto';

@ApiTags('Devices')
@ApiBearerAuth()
@Controller('devices')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DeviceController {
  constructor(
    private readonly registerDeviceHandler: RegisterDeviceHandler,
    private readonly trustDeviceHandler: TrustDeviceHandler,
    private readonly revokeDeviceHandler: RevokeDeviceHandler,
    private readonly getDeviceHandler: GetDeviceHandler,
    private readonly listIdentityDevicesHandler: ListIdentityDevicesHandler,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions('DEVICE_REGISTER')
  @ApiOperation({
    summary: 'Register device',
    description: 'Registers a new device for an identity.',
  })
  @ApiCreatedResponse({
    description: 'Device registered successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  async register(
    @Body() dto: RegisterDeviceDto,
  ): Promise<{ publicId: string }> {
    const metadata: DeviceMetadata | undefined =
      dto.name !== undefined ||
      dto.platform !== undefined ||
      dto.operatingSystem !== undefined ||
      dto.operatingSystemVersion !== undefined ||
      dto.browser !== undefined ||
      dto.browserVersion !== undefined
        ? {
            ...(dto.name !== undefined && { name: dto.name }),
            ...(dto.platform !== undefined && {
              platform: dto.platform,
            }),
            ...(dto.operatingSystem !== undefined && {
              operatingSystem: dto.operatingSystem,
            }),
            ...(dto.operatingSystemVersion !== undefined && {
              operatingSystemVersion: dto.operatingSystemVersion,
            }),
            ...(dto.browser !== undefined && {
              browser: dto.browser,
            }),
            ...(dto.browserVersion !== undefined && {
              browserVersion: dto.browserVersion,
            }),
          }
        : undefined;

    const publicId = await this.registerDeviceHandler.execute(
      new RegisterDeviceCommand(
        dto.identityPublicId,
        dto.fingerprint,
        dto.deviceType,
        CorrelationId.generate(),
        metadata,
      ),
    );

    return { publicId };
  }

  @Patch(':publicId/trust')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('DEVICE_TRUST')
  @ApiOperation({
    summary: 'Trust device',
    description: 'Marks a registered device as trusted.',
  })
  @ApiOkResponse({
    description: 'Device trusted successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  @ApiNotFoundResponse({
    description: 'Device not found.',
  })
  async trust(
    @Param('publicId') publicId: string,
  ): Promise<{ message: string }> {
    await this.trustDeviceHandler.execute(
      new TrustDeviceCommand(publicId, CorrelationId.generate()),
    );

    return {
      message: 'Device trusted successfully',
    };
  }

  @Patch(':publicId/revoke')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('DEVICE_REVOKE')
  @ApiOperation({
    summary: 'Revoke device',
    description: 'Revokes a registered device.',
  })
  @ApiOkResponse({
    description: 'Device revoked successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  @ApiNotFoundResponse({
    description: 'Device not found.',
  })
  async revoke(
    @Param('publicId') publicId: string,
  ): Promise<{ message: string }> {
    await this.revokeDeviceHandler.execute(
      new RevokeDeviceCommand(publicId, CorrelationId.generate()),
    );

    return {
      message: 'Device revoked successfully',
    };
  }

  @Get(':publicId')
  @RequirePermissions('DEVICE_VIEW')
  @ApiOperation({
    summary: 'Get device',
    description: 'Returns a device by its public identifier.',
  })
  @ApiOkResponse({
    description: 'Device retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  @ApiNotFoundResponse({
    description: 'Device not found.',
  })
  async get(@Param('publicId') publicId: string): Promise<DeviceEntity | null> {
    return this.getDeviceHandler.execute(new GetDeviceQuery(publicId));
  }

  @Get('identity/:identityPublicId')
  @RequirePermissions('DEVICE_VIEW')
  @ApiOperation({
    summary: 'List identity devices',
    description: 'Returns all devices registered for an identity.',
  })
  @ApiOkResponse({
    description: 'Devices retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
  })
  @ApiForbiddenResponse({
    description: 'Insufficient permissions.',
  })
  @ApiNotFoundResponse({
    description: 'Identity not found.',
  })
  async list(
    @Param('identityPublicId') identityPublicId: string,
  ): Promise<DeviceEntity[]> {
    return this.listIdentityDevicesHandler.execute(
      new ListIdentityDevicesQuery(identityPublicId),
    );
  }
}
