// -----------------------------------------------------------------------------
// sisiMove — Journey Lifecycle API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for authenticated Journey lifecycle API adapters.
//
// Lifecycle capabilities exposed by the frozen Journey controller:
//
//   POST /journeys
//   POST /journeys/:journeyPublicId/publish
//   POST /journeys/:journeyPublicId/start
//   POST /journeys/:journeyPublicId/complete
//   POST /journeys/:journeyPublicId/cancel
//   POST /journeys/:journeyPublicId/expire
//
// Journey creation derives the provider from the authenticated JWT and
// therefore accepts no request body.
//
// Lifecycle transitions remain owned by the backend Journey aggregate and
// application layer. These adapters only transport the corresponding HTTP
// commands.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey creation
// -----------------------------------------------------------------------------

export {
  createJourney,
} from './create-journey.api';

// -----------------------------------------------------------------------------
// Journey publication
// -----------------------------------------------------------------------------

export {
  publishJourney,
  type PublishJourneyRequest,
} from './publish-journey.api';

// -----------------------------------------------------------------------------
// Journey start
// -----------------------------------------------------------------------------

export {
  startJourney,
  type StartJourneyRequest,
} from './start-journey.api';

// -----------------------------------------------------------------------------
// Journey completion
// -----------------------------------------------------------------------------

export {
  completeJourney,
  type CompleteJourneyRequest,
} from './complete-journey.api';

// -----------------------------------------------------------------------------
// Journey cancellation
// -----------------------------------------------------------------------------

export {
  cancelJourney,
  type CancelJourneyRequest,
} from './cancel-journey.api';

// -----------------------------------------------------------------------------
// Journey expiration
// -----------------------------------------------------------------------------

export {
  expireJourney,
  type ExpireJourneyRequest,
} from './expire-journey.api';