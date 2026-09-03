// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { VerificationException } from './verification.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Root exception for Verification aggregate/domain invariant violations.
 *
 * Use this exception when a Verification domain rule is violated and no more
 * specific Verification exception exists.
 *
 * Examples:
 *
 * - invalid aggregate state;
 * - invalid verification lifecycle operation;
 * - invalid verification evidence state;
 * - invalid verification request ownership;
 * - duplicate pending verification requests;
 * - invalid aggregate construction;
 * - invalid domain operation metadata.
 *
 * More specific Verification exceptions should extend this exception when
 * appropriate.
 */
export class VerificationInvariantException extends VerificationException {
  public constructor(
    message: string = 'A verification domain invariant was violated.',
  ) {
    super(message);
  }
}
