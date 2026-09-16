// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Components
// -----------------------------------------------------------------------------
//
// Public barrel for Journey marketplace presentation components.
//
// Consumers should import Journey marketplace components through this barrel
// rather than depending directly on individual implementation files.
//
// Journey is the primary marketplace supply feature.
//
// These components are presentation-only. They consume the public Journey
// read model and render the individual marketplace sections:
//
//   JourneyMarketplaceCard
//   ├── JourneyCardDate
//   ├── JourneyCardProvider
//   ├── JourneyCardRoute
//   ├── JourneyCardVehicle
//   ├── JourneyCardPrice
//   └── JourneyCardActions
//
// They do not:
//
// - fetch Journey data;
// - manage Journey state;
// - perform booking actions;
// - determine booking eligibility;
// - construct marketplace queries;
// - perform marketplace filtering or sorting;
// - resolve cross-domain references;
// - contain Journey business rules.
//
// The marketplace composition remains owned by the parent marketplace layer.
// These components only present the public Journey read model.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Marketplace Card
// -----------------------------------------------------------------------------
//
// Top-level Journey marketplace listing.
//
// This is the component consumers normally use when rendering a Journey in
// the public marketplace result stream.
//
export * from './journey-marketplace-card';

// -----------------------------------------------------------------------------
// Journey Date
// -----------------------------------------------------------------------------
//
// Compact departure date/time presentation.
//
export * from './journey-card-date';

// -----------------------------------------------------------------------------
// Journey Provider
// -----------------------------------------------------------------------------
//
// Public provider identity and trust presentation.
//
// Journey remains the owner of the provider relationship. Traveller and Trust
// are read-side enrichment exposed through the Journey public read model.
//
export * from './journey-card-provider';

// -----------------------------------------------------------------------------
// Journey Route
// -----------------------------------------------------------------------------
//
// Origin, destination, and intermediate waypoint presentation.
//
export * from './journey-card-route';

// -----------------------------------------------------------------------------
// Journey Vehicle
// -----------------------------------------------------------------------------
//
// Vehicle image and compact vehicle identity presentation.
//
export * from './journey-card-vehicle';

// -----------------------------------------------------------------------------
// Journey Price
// -----------------------------------------------------------------------------
//
// Price-per-seat and seat availability presentation.
//
export * from './journey-card-price';

// -----------------------------------------------------------------------------
// Journey Actions
// -----------------------------------------------------------------------------
//
// Marketplace navigation actions such as View Journey and optional Book.
//
export * from './journey-card-actions';