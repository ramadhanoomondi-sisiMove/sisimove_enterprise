import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class VerificationAlreadyExpiredException extends DomainException {
  constructor() {
    super(
      'IDENTITY_VERIFICATION_ALREADY_EXPIRED',
      'Verification has already expired.',
    );
  }
}
