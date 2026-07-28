// src/domains/authorization/domain/exceptions/invalid-permission-name.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidPermissionNameException extends DomainException {
  public constructor(message: string) {
    super(message, 'INVALID_PERMISSION_NAME');

    Object.freeze(this);
  }
}
