import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class VerificationAlreadyCompletedException extends DomainException {
  constructor() {
    super(
      'VERIFICATION_ALREADY_COMPLETED',
      'Verification has already been completed.',
    );

    Object.setPrototypeOf(
      this,
      VerificationAlreadyCompletedException.prototype,
    );
  }
}
