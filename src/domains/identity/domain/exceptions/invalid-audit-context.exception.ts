// src/domains/identity/domain/exceptions/invalid-audit-context.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidAuditContextException extends DomainException {
  public constructor(message: string) {
    super(message, 'INVALID_AUDIT_CONTEXT');

    Object.freeze(this);
  }
}
