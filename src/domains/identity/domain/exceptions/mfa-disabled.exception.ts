// src/domains/identity/domain/exceptions/mfa-disabled.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class MfaDisabledException extends DomainException {
  constructor() {
    super('MFA_DISABLED', 'Multi-factor authentication is disabled.');
  }
}
