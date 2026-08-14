// src/domains/social/domain/exceptions/traveller-profile-deactivated.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfileDeactivatedException extends TravellerProfileException {
  constructor() {
    super('The traveller profile is deactivated.');
  }
}
