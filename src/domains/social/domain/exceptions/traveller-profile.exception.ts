// src/domains/social/domain/exceptions/traveller-profile.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class TravellerProfileException extends DomainException {
  constructor(message: string = 'A traveller profile domain error occurred.') {
    super('SOCIAL.TRAVELLER_PROFILE.ERROR', message);
  }
}
