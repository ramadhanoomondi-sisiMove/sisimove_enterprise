// src/domains/identity/domain/exceptions/identity-audit-not-found.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class IdentityAuditNotFoundException extends DomainException {
  public constructor(publicId: string) {
    super(
      'IDENTITY_AUDIT_NOT_FOUND',
      `Identity audit '${publicId}' was not found.`,
    );

    Object.freeze(this);
  }
}
