// src/domains/identity/application/queries/get-latest-password-history.query.ts

export class GetLatestPasswordHistoryQuery {
  constructor(
    public readonly authenticationId: string,
    public readonly correlationId?: string,
  ) {}
}
