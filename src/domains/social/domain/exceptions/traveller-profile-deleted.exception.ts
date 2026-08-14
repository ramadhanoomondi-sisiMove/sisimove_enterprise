// src/domains/social/domain/exceptions/traveller-profile-deleted.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfileDeletedException extends TravellerProfileException {
  constructor() {
    super('The traveller profile has been deleted.');
  }
}
