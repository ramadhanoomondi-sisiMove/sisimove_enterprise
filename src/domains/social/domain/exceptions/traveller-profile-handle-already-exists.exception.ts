// src/domains/social/domain/exceptions/traveller-profile-handle-already-exists.exception.ts

import { TravellerProfileException } from './traveller-profile.exception';

export class TravellerProfileHandleAlreadyExistsException extends TravellerProfileException {
  constructor(handle: string) {
    super(`The traveller profile handle "${handle}" already exists.`);
  }
}
