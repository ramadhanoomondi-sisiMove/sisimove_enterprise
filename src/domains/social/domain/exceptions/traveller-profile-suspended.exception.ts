// src/domains/social/domain/exceptions/traveller-profile-suspended.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfileSuspendedException extends TravellerProfileException {
  constructor() {
    super('The traveller profile is suspended.');
  }
}
