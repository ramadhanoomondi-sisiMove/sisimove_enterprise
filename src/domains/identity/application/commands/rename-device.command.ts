// src/domains/identity/application/commands/rename-device.command.ts

export class RenameDeviceCommand {
  constructor(
    public readonly devicePublicId: string,
    public readonly name: string,
    public readonly renamedByPublicId: string,
    public readonly correlationId: string,
  ) {}
}
