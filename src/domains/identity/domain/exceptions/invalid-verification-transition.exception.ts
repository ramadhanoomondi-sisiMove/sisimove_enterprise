import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidVerificationTransitionException extends DomainException {
  constructor(from: string, to: string) {
    super(
      'INVALID_VERIFICATION_TRANSITION',
      `Cannot transition verification from '${from}' to '${to}'.`,
    );

    Object.setPrototypeOf(
      this,
      InvalidVerificationTransitionException.prototype,
    );
  }
}
