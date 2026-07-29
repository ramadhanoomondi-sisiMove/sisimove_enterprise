// src/domains/identity/domain/exceptions/invalid-audit-correlation-id.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidAuditCorrelationIdException extends DomainException {
  public constructor(message: string) {
    super(message, 'INVALID_AUDIT_CORRELATION_ID');

    Object.freeze(this);
  }
}
