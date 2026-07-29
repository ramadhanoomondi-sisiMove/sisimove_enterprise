// src/domains/identity/domain/exceptions/invalid-audit-severity.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidAuditSeverityException extends DomainException {
  public constructor(message: string) {
    super(message, 'INVALID_AUDIT_SEVERITY');

    Object.freeze(this);
  }
}
