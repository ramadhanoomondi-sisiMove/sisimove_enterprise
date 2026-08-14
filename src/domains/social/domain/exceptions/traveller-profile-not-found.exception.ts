// src/domains/social/domain/exceptions/traveller-profile-not-found.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfileNotFoundException extends TravellerProfileException {
  constructor() {
    super('The traveller profile was not found.');
  }
}
