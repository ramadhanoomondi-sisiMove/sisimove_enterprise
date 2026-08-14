// src/domains/social/domain/exceptions/traveller-profile-corridor-limit-exceeded.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfileCorridorLimitExceededException extends TravellerProfileException {
  constructor(limit: number) {
    super(`The traveller profile cannot have more than ${limit} corridors.`);
  }
}
