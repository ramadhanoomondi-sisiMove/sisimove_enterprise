// src/domains/identity/application/queries/get-identity-permissions.query.ts

export class GetIdentityPermissionsQuery {
  constructor(
    public readonly identityId: string,
    public readonly correlationId: string,
  ) {}
}
