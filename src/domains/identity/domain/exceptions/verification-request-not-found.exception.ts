import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class VerificationRequestNotFoundException extends DomainException {
  constructor(publicId: string) {
    super(
      'VERIFICATION_REQUEST_NOT_FOUND',
      `Verification request '${publicId}' was not found.`,
    );

    Object.setPrototypeOf(this, VerificationRequestNotFoundException.prototype);
  }
}
