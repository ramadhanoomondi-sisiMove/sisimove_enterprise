// src/domains/social/domain/exceptions/traveller-profile-corridor-already-exists.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfileCorridorAlreadyExistsException extends TravellerProfileException {
  constructor() {
    super('The traveller profile corridor already exists.');
  }
}
