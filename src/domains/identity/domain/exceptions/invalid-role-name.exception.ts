// src/domains/authorization/domain/exceptions/invalid-role-name.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidRoleNameException extends DomainException {
  public constructor(message: string) {
    super(message, 'INVALID_ROLE_NAME');

    Object.freeze(this);
  }
}
