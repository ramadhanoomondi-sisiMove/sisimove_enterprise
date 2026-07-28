// src/domains/identity/application/commands/trust-device.command.ts

export class TrustDeviceCommand {
  constructor(
    public readonly publicId: string,
    public readonly correlationId: string,
  ) {}
}
