// src/domains/identity/application/queries/get-password-history.query.ts

export class GetPasswordHistoryQuery {
  constructor(
    public readonly authenticationId: string,
    public readonly correlationId?: string,
  ) {}
}
