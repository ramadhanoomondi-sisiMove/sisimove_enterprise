// src/domains/social/domain/exceptions/traveller-profile-preferences-not-found.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfilePreferencesNotFoundException extends TravellerProfileException {
  constructor() {
    super('The traveller profile preferences were not found.');
  }
}
