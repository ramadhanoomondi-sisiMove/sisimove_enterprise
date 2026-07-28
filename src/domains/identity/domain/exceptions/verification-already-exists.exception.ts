import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class VerificationAlreadyExistsException extends DomainException {
  constructor(identityPublicId: string) {
    super(
      'VERIFICATION_ALREADY_EXISTS',
      `Identity '${identityPublicId}' already has a verification.`,
    );

    Object.setPrototypeOf(this, VerificationAlreadyExistsException.prototype);
  }
}
