// src/domains/identity/devices/identity-device.module.ts

import { Module } from '@nestjs/common';

import { RegisterDeviceHandler } from '../application/handlers/register-device.handler';
import { RevokeDeviceHandler } from '../application/handlers/revoke-device.handler';
import { TrustDeviceHandler } from '../application/handlers/trust-device.handler';

import { GetDeviceHandler } from '../application/handlers/query-handlers/get-device.handler';
import { ListIdentityDevicesHandler } from '../application/handlers/query-handlers/list-identity-devices.handler';

import { DevicePrismaRepository } from '../infrastructure/persistence/device.prisma.repository';

@Module({
  providers: [
    //
    // Command Handlers
    //
    RegisterDeviceHandler,
    TrustDeviceHandler,
    RevokeDeviceHandler,

    //
    // Query Handlers
    //
    GetDeviceHandler,
    ListIdentityDevicesHandler,

    //
    // Repository
    //
    DevicePrismaRepository,

    {
      provide: 'DeviceRepository',
      useExisting: DevicePrismaRepository,
    },
  ],

  exports: [
    RegisterDeviceHandler,
    TrustDeviceHandler,
    RevokeDeviceHandler,

    GetDeviceHandler,
    ListIdentityDevicesHandler,

    {
      provide: 'DeviceRepository',
      useExisting: DevicePrismaRepository,
    },
  ],
})
export class IdentityDeviceModule {}
