// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for Journey pricing API adapters.
//
// Pricing capabilities exposed by the frozen Journey controller:
//
//   GET    /journeys/:journeyPublicId/pricing
//   POST   /journeys/:journeyPublicId/pricing
//   DELETE /journeys/:journeyPublicId/pricing
//
// IMPORTANT:
//
// The Journey controller does NOT create pricing details.
//
// The POST operation only attaches an existing pricing configuration using:
//
//   {
//     pricingPublicId: string
//   }
//
// Pricing creation and management therefore remain outside this Journey API
// surface.
//
// All adapters use the authenticated API client because these are protected
// Journey management operations.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Get pricing
// -----------------------------------------------------------------------------

export {
  getJourneyPricing,
} from './get-journey-pricing.api';

// -----------------------------------------------------------------------------
// Attach pricing
// -----------------------------------------------------------------------------

export {
  attachJourneyPricing,
  type AttachJourneyPricingRequest,
} from './attach-journey-pricing.api';

// -----------------------------------------------------------------------------
// Remove pricing
// -----------------------------------------------------------------------------

export {
  removeJourneyPricing,
} from './remove-journey-pricing.api';