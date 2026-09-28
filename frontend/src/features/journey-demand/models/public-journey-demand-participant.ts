// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Participant
// -----------------------------------------------------------------------------
//
// Public representation of participation in a Journey Demand.
//
// JourneyDemandParticipant stores memberPublicId as an opaque Identity
// reference. That internal identity reference is deliberately not exposed.
//
// The public projection resolves that reference into:
//
//     PublicTraveller
//           +
//     PublicTravellerTrust
//
// IMPORTANT:
//
// Participation is not the same thing as the Demand requester.
//
// The requester created the Demand.
// Participants are additional travellers who joined that Demand.
//
// This model is intended for public Demand detail/participant projections.
// The anonymous marketplace list should normally use the aggregated
// PublicJourneyDemandDemand projection instead of exposing individual
// participants.
// -----------------------------------------------------------------------------

import type { PublicTraveller } from '../../traveller-profile/models/public-traveller';
import type { PublicTravellerTrust } from '../../trust/models/public-traveller-trust';

export type PublicJourneyDemandParticipantStatus =
  | 'ACTIVE'
  | 'WITHDRAWN'
  | 'REMOVED';

export interface PublicJourneyDemandParticipant {
  /**
   * Public identifier of the Demand participant association.
   *
   * The internal database ID is never exposed.
   */
  readonly publicId: string;

  /**
   * Public traveller information.
   */
  readonly traveller: PublicTraveller;

  /**
   * Public trust information for the participant.
   */
  readonly trust: PublicTravellerTrust;

  /**
   * Number of seats requested by this participant.
   */
  readonly seats: number;

  /**
   * Public participation state.
   */
  readonly status: PublicJourneyDemandParticipantStatus;

  /**
   * ISO-8601 timestamp indicating when the traveller joined the Demand.
   *
   * The frontend presentation layer is responsible for formatting this
   * value for the traveller's locale/timezone.
   */
  readonly joinedAt: string;
}