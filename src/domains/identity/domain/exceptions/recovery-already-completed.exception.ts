// src/domains/identity/domain/exceptions/recovery-already-completed.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RecoveryAlreadyCompletedException extends DomainException {
  constructor() {
    super(
      'IDENTITY_RECOVERY_ALREADY_COMPLETED',
      'The recovery request has already been completed.',
    );
  }
}
