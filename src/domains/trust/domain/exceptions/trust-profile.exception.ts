// src/domains/trust/domain/exceptions/trust-profile.exception.ts

import { TrustDomainException } from './trust-domain.exception';

// -----------------------------------------------------------------------------
// Base Trust Profile Exception
// -----------------------------------------------------------------------------

export class TrustProfileException extends TrustDomainException {
  constructor(message: string = 'A trust profile domain error occurred.') {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Trust Profile Not Found
// -----------------------------------------------------------------------------

export class TrustProfileNotFoundException extends TrustProfileException {
  constructor(message: string = 'Trust profile was not found.') {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Trust Profile Already Exists
// -----------------------------------------------------------------------------

export class TrustProfileAlreadyExistsException extends TrustProfileException {
  constructor(
    message: string = 'A trust profile already exists for this member.',
  ) {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Trust Profile Status
// -----------------------------------------------------------------------------

export class InvalidTrustProfileStatusException extends TrustProfileException {
  constructor(
    message: string = 'The requested trust profile status transition is invalid.',
  ) {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Trust Profile Verification
// -----------------------------------------------------------------------------

export class InvalidTrustProfileVerificationException extends TrustProfileException {
  constructor(
    message: string = 'The requested trust profile verification operation is invalid.',
  ) {
    super(message);
  }
}
