// src/domains/identity/domain/exceptions/invalid-audit-metadata.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidAuditMetadataException extends DomainException {
  public constructor(message: string) {
    super(message, 'INVALID_AUDIT_METADATA');

    Object.freeze(this);
  }
}
