// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Corridor API
// -----------------------------------------------------------------------------
//
// Public export boundary for Journey Demand corridor operations.
//
// The corridor API is kept separate from the root Journey Demand API because
// the corridor is a Journey Demand-owned component with its own HTTP mutation.
//
// This file contains exports only. It does not contain HTTP logic,
// orchestration, validation, or state management.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Corridor mutation
// -----------------------------------------------------------------------------

export {
  updateJourneyDemandCorridor,
} from './update-journey-demand-corridor.api';

export type {
  UpdateJourneyDemandCorridorRequest,
} from './update-journey-demand-corridor.api';