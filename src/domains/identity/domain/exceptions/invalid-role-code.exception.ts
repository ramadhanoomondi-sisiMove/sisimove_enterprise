// src/domains/authorization/domain/exceptions/invalid-role-code.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidRoleCodeException extends DomainException {
  public constructor(message: string) {
    super(message, 'INVALID_ROLE_CODE');

    Object.freeze(this);
  }
}
