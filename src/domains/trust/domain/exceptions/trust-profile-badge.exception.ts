// src/domains/trust/domain/exceptions/trust-profile-badge.exception.ts

import { TrustDomainException } from './trust-domain.exception';

// -----------------------------------------------------------------------------
// Base Exception
// -----------------------------------------------------------------------------

export class TrustProfileBadgeException extends TrustDomainException {
  constructor(
    message: string = 'A trust profile badge domain error occurred.',
  ) {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Profile Badge Not Found
// -----------------------------------------------------------------------------

export class TrustProfileBadgeNotFoundException extends TrustProfileBadgeException {
  constructor(message: string = 'Trust profile badge was not found.') {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Profile Badge Already Exists
// -----------------------------------------------------------------------------

export class TrustProfileBadgeAlreadyExistsException extends TrustProfileBadgeException {
  constructor(message: string = 'Trust profile badge already exists.') {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Profile Badge Already Active
// -----------------------------------------------------------------------------

export class TrustProfileBadgeAlreadyActiveException extends TrustProfileBadgeException {
  constructor(message: string = 'Trust profile badge is already active.') {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Profile Badge Already Revoked
// -----------------------------------------------------------------------------

export class TrustProfileBadgeAlreadyRevokedException extends TrustProfileBadgeException {
  constructor(message: string = 'Trust profile badge is already revoked.') {
    super(message);
  }
}
