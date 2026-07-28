import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class VerificationAlreadyVerifiedException extends DomainException {
  constructor() {
    super(
      'IDENTITY_VERIFICATION_ALREADY_VERIFIED',
      'Verification has already been completed.',
    );
  }
}
