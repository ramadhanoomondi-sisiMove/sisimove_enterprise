// src/domains/authorization/domain/exceptions/invalid-permission-code.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidPermissionCodeException extends DomainException {
  public constructor(message: string) {
    super(message, 'INVALID_PERMISSION_CODE');

    Object.freeze(this);
  }
}
