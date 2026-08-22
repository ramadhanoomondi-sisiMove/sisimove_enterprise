// -----------------------------------------------------------------------------
// Commercial Commission Rule
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { CommercialException } from './commercial.exception';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

/**
 * Thrown when a Commercial Commission Rule overlaps another rule of the
 * same commission type during an effective period.
 */
export class CommercialCommissionRuleOverlapException extends CommercialException {
  public constructor(type?: string, version?: number) {
    super(
      type && version !== undefined
        ? `Commercial commission rule "${type}" version "${version}" overlaps an existing effective rule.`
        : type
          ? `Commercial commission rule of type "${type}" overlaps an existing effective rule.`
          : 'Commercial commission rule overlaps an existing effective rule.',
    );
  }
}
