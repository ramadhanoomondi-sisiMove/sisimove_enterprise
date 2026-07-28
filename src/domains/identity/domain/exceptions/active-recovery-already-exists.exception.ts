// src/domains/identity/domain/exceptions/active-recovery-already-exists.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

import type { RecoveryType } from '../value-objects/recovery-type.enum';

export class ActiveRecoveryAlreadyExistsException extends DomainException {
  public constructor(recoveryType: RecoveryType) {
    super(
      `An active ${recoveryType} recovery request already exists.`,
      'RECOVERY_ACTIVE_ALREADY_EXISTS',
    );

    Object.freeze(this);
  }
}
