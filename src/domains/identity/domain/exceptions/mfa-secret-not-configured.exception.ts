// src/domains/identity/domain/exceptions/mfa-secret-not-configured.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class MfaSecretNotConfiguredException extends DomainException {
  constructor() {
    super(
      'MFA_SECRET_NOT_CONFIGURED',
      'Multi-factor authentication secret is not configured.',
    );
  }
}
