// src/domains/identity/application/queries/get-device.query.ts

export class GetDeviceQuery {
  constructor(
    public readonly publicId: string,
    public readonly correlationId?: string,
  ) {}
}
