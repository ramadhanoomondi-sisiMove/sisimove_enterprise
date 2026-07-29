// src/domains/identity/domain/exceptions/invalid-audit-resource-type.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidAuditResourceTypeException extends DomainException {
  public constructor(message: string) {
    super(message, 'INVALID_AUDIT_RESOURCE_TYPE');

    Object.freeze(this);
  }
}
