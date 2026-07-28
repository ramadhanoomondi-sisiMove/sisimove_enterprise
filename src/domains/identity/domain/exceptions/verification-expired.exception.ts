import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class VerificationExpiredException extends DomainException {
  constructor() {
    super('VERIFICATION_EXPIRED', 'Verification has expired.');

    Object.setPrototypeOf(this, VerificationExpiredException.prototype);
  }
}
