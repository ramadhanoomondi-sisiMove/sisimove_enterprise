// -----------------------------------------------------------------------------
// Support Case Evidence — Invalid Asset Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when the Asset associated with Support Case Evidence
 * is invalid or cannot be accepted by the Support domain.
 */
export class SupportCaseEvidenceAssetInvalidException extends SupportCaseException {
  public constructor(
    message: string = 'Support case evidence asset is invalid.',
  ) {
    super(message);
  }
}
