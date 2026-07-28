// src/domains/identity/application/commands/revoke-device.command.ts

export class RevokeDeviceCommand {
  constructor(
    public readonly publicId: string,
    public readonly correlationId: string,
  ) {}
}
