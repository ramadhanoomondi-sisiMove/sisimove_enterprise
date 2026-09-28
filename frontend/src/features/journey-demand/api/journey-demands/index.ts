// -----------------------------------------------------------------------------
// sisiMove — Journey Demand API
// -----------------------------------------------------------------------------
//
// Public API surface for root-level Journey Demand operations.
//
// This barrel intentionally exports only the APIs that operate on the
// Journey Demand resource itself:
//
// - public marketplace reads;
// - authenticated "my demands" reads;
// - root creation;
// - root update;
// - lifecycle commands.
//
// Component-specific APIs such as corridor, waypoints, schedule, capacity,
// pricing, and participants remain inside their own feature directories and
// are exported from their respective barrels.
//
// Architectural boundary:
//
// This file is only an export boundary. It contains no HTTP logic, state,
// mapping, orchestration, or business rules.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public marketplace reads
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Root creation and update
// -----------------------------------------------------------------------------

export {
  createJourneyDemand,
} from './create-journey-demand.api';

export type {
  CreateJourneyDemandRequest,
} from './create-journey-demand.api';

export {
  updateJourneyDemand,
} from './update-journey-demand.api';

export type {
  UpdateJourneyDemandRequest,
} from './update-journey-demand.api';

// -----------------------------------------------------------------------------
// Journey Demand lifecycle commands
// -----------------------------------------------------------------------------

export {
  publishJourneyDemand,
} from './publish-journey-demand.api';

export type {
  PublishJourneyDemandRequest,
} from './publish-journey-demand.api';

export {
  matchJourneyDemand,
} from './match-journey-demand.api';

export type {
  MatchJourneyDemandRequest,
} from './match-journey-demand.api';

export {
  convertJourneyDemand,
} from './convert-journey-demand.api';

export type {
  ConvertJourneyDemandRequest,
} from './convert-journey-demand.api';

export {
  fulfillJourneyDemand,
} from './fulfill-journey-demand.api';

export type {
  FulfillJourneyDemandRequest,
} from './fulfill-journey-demand.api';

export {
  cancelJourneyDemand,
} from './cancel-journey-demand.api';

export type {
  CancelJourneyDemandRequest,
} from './cancel-journey-demand.api';

export {
  expireJourneyDemand,
} from './expire-journey-demand.api';

export type {
  ExpireJourneyDemandRequest,
} from './expire-journey-demand.api';