// src/domains/identity/application/queries/list-identity-devices.query.ts

export class ListIdentityDevicesQuery {
  constructor(
    public readonly identityPublicId: string,
    public readonly correlationId?: string,
  ) {}
}
