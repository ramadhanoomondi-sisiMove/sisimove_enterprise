// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Demand
// -----------------------------------------------------------------------------
//
// Aggregated public evidence of participation in a Journey Demand.
//
// The marketplace does not need the complete participant collection merely to
// communicate how much demand exists.
//
// Instead, the public Journey Demand projection exposes:
//
//     participantCount
//     joinedSeats
//
// This keeps the anonymous marketplace projection compact while still making
// visible demand strength clear to potential providers.
//
// Individual participant representations belong to the separate
// PublicJourneyDemandParticipant model and should only be included by a
// projection that actually needs participant-level information.
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandDemand {
  /**
   * Number of travellers currently participating in the Demand.
   */
  readonly participantCount: number;

  /**
   * Total number of seats represented by participating travellers.
   */
  readonly joinedSeats: number;
}