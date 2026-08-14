// src/domains/social/domain/exceptions/traveller-profile-primary-corridor-not-found.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfilePrimaryCorridorNotFoundException extends TravellerProfileException {
  constructor() {
    super('The traveller profile does not have a primary corridor.');
  }
}
