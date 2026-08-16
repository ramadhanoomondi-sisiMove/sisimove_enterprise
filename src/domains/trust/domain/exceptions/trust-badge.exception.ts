// src/domains/trust/domain/exceptions/trust-badge.exception.ts

import { TrustDomainException } from './trust-domain.exception';

// -----------------------------------------------------------------------------
// Base Exception
// -----------------------------------------------------------------------------

export class TrustBadgeException extends TrustDomainException {
  constructor(message: string = 'A trust badge domain error occurred.') {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Badge Not Found
// -----------------------------------------------------------------------------

export class TrustBadgeNotFoundException extends TrustBadgeException {
  constructor(message: string = 'Trust badge was not found.') {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Badge Already Exists
// -----------------------------------------------------------------------------

export class TrustBadgeAlreadyExistsException extends TrustBadgeException {
  constructor(message: string = 'Trust badge already exists.') {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Badge Inactive
// -----------------------------------------------------------------------------

export class TrustBadgeInactiveException extends TrustBadgeException {
  constructor(message: string = 'Trust badge is inactive.') {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Badge Cannot Be Awarded
// -----------------------------------------------------------------------------

export class TrustBadgeCannotBeAwardedException extends TrustBadgeException {
  constructor(message: string = 'Trust badge cannot be awarded.') {
    super(message);
  }
}

// -----------------------------------------------------------------------------
// Badge Cannot Be Revoked
// -----------------------------------------------------------------------------

export class TrustBadgeCannotBeRevokedException extends TrustBadgeException {
  constructor(message: string = 'Trust badge cannot be revoked.') {
    super(message);
  }
}
