// src/domains/identity/domain/exceptions/identity-not-pending.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class IdentityNotPendingException extends DomainException {
  constructor() {
    super('Only pending identities can be activated.', 'IDENTITY_NOT_PENDING');
  }
}
