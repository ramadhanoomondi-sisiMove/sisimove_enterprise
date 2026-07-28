// src/domains/identity/domain/exceptions/password-history-violation.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class PasswordHistoryViolationException extends DomainException {
  constructor() {
    super(
      'IDENTITY.PASSWORD_HISTORY_VIOLATION',
      'The password matches one of the recently used passwords.',
    );
  }
}
