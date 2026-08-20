// -----------------------------------------------------------------------------
// Journey Completion — Get Confirmations Query
// -----------------------------------------------------------------------------
//
// Retrieves confirmations belonging to a Journey Completion.
//
// Optional filters:
// - memberPublicId
// - bookingPublicId
// - role
// - status
//
// The query stores transport/application primitives. The query handler is
// responsible for converting them into domain value objects.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query Props
// -----------------------------------------------------------------------------

export interface GetJourneyCompletionConfirmationsQueryProps {
  completionPublicId: string;

  memberPublicId?: string;

  bookingPublicId?: string;

  role?: string;

  status?: string;
}

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyCompletionConfirmationsQuery extends Query {
  // ===========================================================================
  // Journey Completion
  // ===========================================================================

  public readonly completionPublicId: string;

  // ===========================================================================
  // Optional Member Filter
  // ===========================================================================

  public readonly memberPublicId?: string;

  // ===========================================================================
  // Optional Booking Filter
  // ===========================================================================

  public readonly bookingPublicId?: string;

  // ===========================================================================
  // Optional Role Filter
  // ===========================================================================

  public readonly role?: string;

  // ===========================================================================
  // Optional Status Filter
  // ===========================================================================

  public readonly status?: string;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(props: GetJourneyCompletionConfirmationsQueryProps) {
    super();

    this.completionPublicId = props.completionPublicId;

    if (props.memberPublicId !== undefined) {
      this.memberPublicId = props.memberPublicId;
    }

    if (props.bookingPublicId !== undefined) {
      this.bookingPublicId = props.bookingPublicId;
    }

    if (props.role !== undefined) {
      this.role = props.role;
    }

    if (props.status !== undefined) {
      this.status = props.status;
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionConfirmationsQuery;
