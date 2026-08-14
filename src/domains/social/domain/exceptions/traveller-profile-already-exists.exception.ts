// src/domains/social/domain/exceptions/traveller-profile-already-exists.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfileAlreadyExistsException extends TravellerProfileException {
  constructor() {
    super('The traveller profile already exists.');
  }
}
