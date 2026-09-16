// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Components
// -----------------------------------------------------------------------------
//
// Public barrel for Journey Demand marketplace presentation components.
//
// Consumers should import Journey Demand marketplace components through this
// barrel rather than depending directly on individual implementation files.
//
// Journey Demand is an independent marketplace feature domain. These
// components are responsible only for presenting a public Journey Demand and
// its associated:
//
//   - requested schedule
//   - requester
//   - route
//   - marketplace summary
//   - available navigation actions
//
// They do not:
//
// - fetch Journey Demand data;
// - manage Journey Demand state;
// - perform participation actions;
// - determine whether a visitor may join a Demand;
// - construct marketplace queries;
// - construct marketplace URLs;
// - contain marketplace composition/business logic.
//
// The public read model is supplied by the marketplace/application boundary.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Demand Marketplace Card
// -----------------------------------------------------------------------------
//
// Composition root for the individual marketplace listing.
//
// -----------------------------------------------------------------------------

export * from './demand-marketplace-card';

// -----------------------------------------------------------------------------
// Journey Demand Requested Schedule
// -----------------------------------------------------------------------------
//
// Presents the Demand's flexible departure window and optional arrival
// requirements.
//
// NOTE:
//
// A Journey Demand does not necessarily have one concrete departureAt value.
// Therefore this replaces the old Journey-style date representation.
// -----------------------------------------------------------------------------

export * from './demand-card-date';

// -----------------------------------------------------------------------------
// Journey Demand Requester
// -----------------------------------------------------------------------------
//
// Presents the public traveller who created the Demand together with their
// public trust information.
// -----------------------------------------------------------------------------

export * from './demand-card-requester';

// -----------------------------------------------------------------------------
// Journey Demand Route
// -----------------------------------------------------------------------------
//
// Presents the requested origin, destination, and intermediate locations.
// -----------------------------------------------------------------------------

export * from './demand-card-route';

// -----------------------------------------------------------------------------
// Journey Demand Marketplace Summary
// -----------------------------------------------------------------------------
//
// Presents the compact marketplace facts:
//
// - requested seats
// - remaining seats
// - matched seats
// - active participants
// - price expectation
// - public Demand status
//
// This intentionally replaces the former generic demand-card-details
// component. Marketplace cards should expose a focused summary rather than
// dumping every public Demand field into one component.
// -----------------------------------------------------------------------------

export * from './demand-card-summary';

// -----------------------------------------------------------------------------
// Journey Demand Actions
// -----------------------------------------------------------------------------
//
// Navigation-only actions such as View Demand and Join Demand.
//
// Eligibility and participation rules remain outside the presentation
// component.
// -----------------------------------------------------------------------------

export * from './demand-card-actions';