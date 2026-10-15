// -----------------------------------------------------------------------------
// Count Journey Completions By Status Query
// -----------------------------------------------------------------------------
//
// Counts Journey Completion aggregate roots by lifecycle status.
//
// The query uses the domain's JourneyCompletionStatusValue type so callers
// can specify only a valid Journey Completion lifecycle status.
//
// Compatible with:
// - exactOptionalPropertyTypes: true
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

import type { JourneyCompletionStatusValue } from '../../domain/value-objects';

// =============================================================================
// Props
// =============================================================================

export interface CountJourneyCompletionsByStatusQueryProps {
  status: JourneyCompletionStatusValue;
}

// =============================================================================
// Query
// =============================================================================

export class CountJourneyCompletionsByStatusQuery extends Query {
  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  public readonly status: JourneyCompletionStatusValue;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(props: CountJourneyCompletionsByStatusQueryProps) {
    super();

    this.status = props.status;
  }
}
