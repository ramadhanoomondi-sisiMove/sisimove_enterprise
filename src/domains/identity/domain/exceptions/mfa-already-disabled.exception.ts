// src/domains/identity/domain/exceptions/mfa-already-disabled.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class MfaAlreadyDisabledException extends DomainException {
  constructor() {
    super(
      'MFA_ALREADY_DISABLED',
      'Multi-factor authentication is already disabled.',
    );
  }
}
