// src/domains/social/domain/exceptions/traveller-profile-invalid-visibility.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfileInvalidVisibilityException extends TravellerProfileException {
  constructor(visibility: string) {
    super(`Invalid traveller profile visibility "${visibility}".`);
  }
}
