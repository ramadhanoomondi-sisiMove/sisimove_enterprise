// src/domains/social/domain/exceptions/traveller-profile-primary-corridor-already-exists.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfilePrimaryCorridorAlreadyExistsException extends TravellerProfileException {
  constructor() {
    super('The traveller profile already has a primary corridor.');
  }
}
