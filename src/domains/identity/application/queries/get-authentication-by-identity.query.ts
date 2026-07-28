// src/domains/identity/application/queries/get-authentication-by-identity.query.ts

import type { IdentityId } from '../../domain/value-objects/identity-id.vo';

export class GetAuthenticationByIdentityQuery {
  constructor(
    public readonly identityId: IdentityId,
    public readonly correlationId?: string,
  ) {}
}
