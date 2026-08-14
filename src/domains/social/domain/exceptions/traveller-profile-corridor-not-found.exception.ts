// src/domains/social/domain/exceptions/traveller-profile-corridor-not-found.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfileCorridorNotFoundException extends TravellerProfileException {
  constructor() {
    super('The traveller profile corridor was not found.');
  }
}
