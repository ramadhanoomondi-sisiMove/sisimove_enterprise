import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class VerificationRequestAlreadyReviewedException extends DomainException {
  constructor() {
    super(
      'VERIFICATION_REQUEST_ALREADY_REVIEWED',
      'Verification request has already been reviewed.',
    );

    Object.setPrototypeOf(
      this,
      VerificationRequestAlreadyReviewedException.prototype,
    );
  }
}
