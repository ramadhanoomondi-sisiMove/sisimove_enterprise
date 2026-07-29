// src/domains/identity/domain/exceptions/invalid-audit-result.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidAuditResultException extends DomainException {
  public constructor(message: string) {
    super(message, 'INVALID_AUDIT_RESULT');

    Object.freeze(this);
  }
}
