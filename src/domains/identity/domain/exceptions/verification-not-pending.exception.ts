import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class VerificationNotPendingException extends DomainException {
  constructor() {
    super(
      'VERIFICATION_NOT_PENDING',
      'Only pending verifications can be reviewed.',
    );

    Object.setPrototypeOf(this, VerificationNotPendingException.prototype);
  }
}
