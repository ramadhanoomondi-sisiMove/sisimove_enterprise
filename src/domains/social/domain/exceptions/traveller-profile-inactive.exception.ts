// src/domains/social/domain/exceptions/traveller-profile-inactive.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfileInactiveException extends TravellerProfileException {
  constructor() {
    super('The traveller profile is inactive.');
  }
}
