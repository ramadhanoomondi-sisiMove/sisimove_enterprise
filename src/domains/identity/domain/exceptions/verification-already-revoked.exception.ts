// src/domains/identity/domain/exceptions/verification-already-revoked.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class VerificationAlreadyRevokedException extends DomainException {
  constructor() {
    super(
      'Verification has already been revoked.',
      'VERIFICATION_ALREADY_REVOKED',
    );
  }
}
