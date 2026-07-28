// src/domains/identity/domain/exceptions/mfa-already-enabled.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class MfaAlreadyEnabledException extends DomainException {
  constructor() {
    super(
      'MFA_ALREADY_ENABLED',
      'Multi-factor authentication is already enabled.',
    );
  }
}
