import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class VerificationAlreadyRejectedException extends DomainException {
  constructor() {
    super(
      'VERIFICATION_ALREADY_REJECTED',
      'Verification has already been rejected.',
    );

    Object.setPrototypeOf(this, VerificationAlreadyRejectedException.prototype);
  }
}
