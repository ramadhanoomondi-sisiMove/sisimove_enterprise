// src/domains/identity/application/commands/record-device-activity.command.ts

export class RecordDeviceActivityCommand {
  constructor(
    public readonly devicePublicId: string,
    public readonly correlationId: string,
  ) {}
}
