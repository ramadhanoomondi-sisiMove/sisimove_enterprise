// src/features/journey/api/corridor/index.ts

// -----------------------------------------------------------------------------
// sisiMove — Journey Corridor API
// -----------------------------------------------------------------------------
//
// Barrel exports for Journey corridor mutations.
//
// Corridor mutation APIs are kept separate from Journey-level lifecycle APIs.
// -----------------------------------------------------------------------------

export {
  attachJourneyCorridor,
} from "./attach-journey-corridor";

export type {
  AttachJourneyCorridorRequest,
} from "./attach-journey-corridor";

export {
  removeJourneyCorridor,
} from "./remove-journey-corridor";