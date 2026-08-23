// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

import { FinancialException } from './financial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Financial entity attempts an invalid lifecycle
 * status transition.
 *
 * Examples include:
 *
 * - COMPLETED -> PENDING
 * - CANCELLED -> COMPLETED
 * - CLOSED -> ACTIVE
 * - FAILED -> PROCESSING
 *
 * The specific aggregate or state transition should be described
 * by the supplied message.
 */
export class FinancialInvalidStatusTransitionException extends FinancialException {
  public constructor(
    message: string = 'The requested financial status transition is invalid.',
  ) {
    super(message);
  }
}
