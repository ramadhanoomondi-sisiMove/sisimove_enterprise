// src/domains/social/domain/exceptions/traveller-profile-invalid-status-transition.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfileInvalidStatusTransitionException extends TravellerProfileException {
  constructor(from: string, to: string) {
    super(
      `Invalid traveller profile status transition from "${from}" to "${to}".`,
    );
  }
}
