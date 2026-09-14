// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Participant
// -----------------------------------------------------------------------------
//
// Public representation of participation in a Journey Demand.
//
// JourneyDemandParticipant stores memberPublicId as an opaque Identity
// reference. That internal identity reference is deliberately not exposed.
//
// The public marketplace should instead expose the participant as a public
// Traveller representation.
//
// IMPORTANT:
//
// Participation is not the same thing as the Demand requester.
//
// The requester created the Demand.
// Participants are additional travellers who joined that Demand.
//
// -----------------------------------------------------------------------------

import type { PublicTraveller } from "../../traveller-profile/models/public-traveller";
import type { PublicTravellerTrust } from "../../trust/models/public-traveller-trust";

export type PublicJourneyDemandParticipantStatus =
  | "ACTIVE"
  | "WITHDRAWN"
  | "REMOVED";

export interface PublicJourneyDemandParticipant {
  /**
   * Public identifier of the Demand participant association.
   *
   * The internal database ID is never exposed.
   */
  publicId: string;

  /**
   * Public traveller information.
   */
  traveller: PublicTraveller;

  /**
   * Public trust information for the participant.
   */
  trust: PublicTravellerTrust;

  /**
   * Number of seats requested by this participant.
   */
  seats: number;

  /**
   * Public participation state.
   */
  status: PublicJourneyDemandParticipantStatus;

  /**
   * When the traveller joined the Demand.
   */
  joinedAt: string;
}