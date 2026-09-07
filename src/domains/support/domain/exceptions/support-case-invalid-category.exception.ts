// -----------------------------------------------------------------------------
// Support Case — Invalid Category Exception
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SupportCaseException } from './support-case.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Raised when an invalid Support Case category is supplied.
 */
export class SupportCaseInvalidCategoryException extends SupportCaseException {
  public constructor(message: string = 'Invalid support case category.') {
    super(message);
  }
}
