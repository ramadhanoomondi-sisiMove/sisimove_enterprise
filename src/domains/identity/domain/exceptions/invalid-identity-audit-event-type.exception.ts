// src/domains/identity/domain/exceptions/invalid-identity-audit-event-type.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidIdentityAuditEventTypeException extends DomainException {
  public constructor(message: string) {
    super(message, 'INVALID_IDENTITY_AUDIT_EVENT_TYPE');

    Object.freeze(this);
  }
}
