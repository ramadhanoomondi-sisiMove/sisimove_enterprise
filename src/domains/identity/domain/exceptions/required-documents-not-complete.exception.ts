import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class RequiredDocumentsNotCompleteException extends DomainException {
  constructor() {
    super(
      'REQUIRED_DOCUMENTS_NOT_COMPLETE',
      'Required verification documents have not all been approved.',
    );

    Object.setPrototypeOf(
      this,
      RequiredDocumentsNotCompleteException.prototype,
    );
  }
}
