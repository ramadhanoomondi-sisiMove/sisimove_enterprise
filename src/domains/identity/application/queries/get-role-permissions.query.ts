// src/domains/identity/application/queries/get-role-permissions.query.ts

export class GetRolePermissionsQuery {
  constructor(
    public readonly roleCode: string,
    public readonly correlationId: string,
  ) {}
}
