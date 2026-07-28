// src/domains/identity/domain/exceptions/recovery-cancelled.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RecoveryCancelledException extends DomainException {
  constructor() {
    super(
      'IDENTITY_RECOVERY_CANCELLED',
      'The recovery request has been cancelled.',
    );
  }
}
