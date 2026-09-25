// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant
// -----------------------------------------------------------------------------
//
// Presentation/API model for a traveller participating in a JourneyDemand.
//
// memberPublicId references Identity across the domain boundary.
//
// -----------------------------------------------------------------------------

import type { JourneyDemandParticipantStatus } from './journey-demand-participant-status';

export interface JourneyDemandParticipant {
  /**
   * Public identifier of this participation record.
   */
  publicId: string;

  /**
   * Public identity/member identifier.
   *
   * This is intentionally an opaque cross-domain reference.
   */
  memberPublicId: string;

  /**
   * Number of seats this participant contributes to the demand.
   */
  seats: number;

  /**
   * Current participation lifecycle state.
   */
  status: JourneyDemandParticipantStatus;

  /**
   * Time at which the participant joined.
   */
  joinedAt: string;

  /**
   * Time at which the participant withdrew, if applicable.
   */
  withdrawnAt: string | null;

  /**
   * Time at which the participant was removed, if applicable.
   */
  removedAt: string | null;

  createdAt: string;
  updatedAt: string;
}