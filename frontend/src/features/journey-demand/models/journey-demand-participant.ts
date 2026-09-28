// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant Model
// -----------------------------------------------------------------------------
//
// Frontend representation of JourneyDemandParticipantResponse.
//
// The member identity remains an opaque public identifier. The frontend does
// not reconstruct the referenced Identity or TravellerProfile aggregate.
// -----------------------------------------------------------------------------

import type { JourneyDemandParticipantStatus } from './journey-demand-participant-status';

/**
 * Journey Demand participant response model.
 */
export interface JourneyDemandParticipant {
  /**
   * Stable public identifier of the participant record.
   */
  readonly publicId: string;

  /**
   * Opaque public identifier of the participating member.
   */
  readonly memberPublicId: string;

  /**
   * Number of seats requested by this participant.
   */
  readonly seats: number;

  /**
   * Current participant status.
   */
  readonly status: JourneyDemandParticipantStatus;

  /**
   * Participant lifecycle timestamps.
   */
  readonly joinedAt: Date;
  readonly withdrawnAt: Date | undefined;
  readonly removedAt: Date | undefined;

  /**
   * Backend-provided participant state.
   */
  readonly isActive: boolean;
  readonly isWithdrawn: boolean;
  readonly isRemoved: boolean;
  readonly canParticipate: boolean;
  readonly hasWithdrawn: boolean;
  readonly hasBeenRemoved: boolean;

  /**
   * Backend timestamps.
   */
  readonly createdAt: Date;
  readonly updatedAt: Date;
}