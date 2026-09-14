// src/domains/social/domain/exceptions/traveller-profile-public-not-found.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfilePublicNotFoundException extends TravellerProfileException {
  constructor() {
    super('The public traveller profile could not be found.');
  }
}

export default TravellerProfilePublicNotFoundException;
