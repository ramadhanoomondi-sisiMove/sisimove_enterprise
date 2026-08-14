// src/domains/social/domain/exceptions/traveller-profile-preferences-already-exist.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfilePreferencesAlreadyExistException extends TravellerProfileException {
  constructor() {
    super('The traveller profile preferences already exist.');
  }
}
