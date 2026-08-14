// src/domains/social/domain/exceptions/traveller-profile-cannot-remove-primary-corridor.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfileCannotRemovePrimaryCorridorException extends TravellerProfileException {
  constructor() {
    super('The primary traveller profile corridor cannot be removed.');
  }
}
