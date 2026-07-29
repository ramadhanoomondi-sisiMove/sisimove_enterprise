// src/domains/identity/domain/exceptions/invalid-audit-actor-type.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidAuditActorTypeException extends DomainException {
  public constructor(message: string) {
    super(message, 'INVALID_AUDIT_ACTOR_TYPE');

    Object.freeze(this);
  }
}
