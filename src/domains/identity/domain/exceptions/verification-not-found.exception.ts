import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class VerificationNotFoundException extends DomainException {
  constructor(publicId: string) {
    super(
      'VERIFICATION_NOT_FOUND',
      `Verification '${publicId}' was not found.`,
    );

    Object.setPrototypeOf(this, VerificationNotFoundException.prototype);
  }
}
