import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

import type { VerificationRequestType } from '../enums/verification-request-type.enum';

export class VerificationRequestAlreadyExistsException extends DomainException {
  constructor(type: VerificationRequestType) {
    super(
      'IDENTITY_VERIFICATION_REQUEST_ALREADY_EXISTS',
      `A pending ${type} verification request already exists.`,
    );
  }
}
