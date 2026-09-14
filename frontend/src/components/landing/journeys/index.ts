// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Components
// -----------------------------------------------------------------------------
//
// Public barrel for Journey marketplace presentation components.
//
// Consumers should import Journey marketplace components through this barrel
// rather than depending directly on individual implementation files.
//
// Journey is an independent marketplace feature domain. These components are
// responsible only for presenting a public Journey and its associated
// provider, route, details, and available actions.
//
// They do not:
//
// - fetch Journey data;
// - manage Journey state;
// - perform booking actions;
// - determine booking eligibility;
// - construct marketplace queries;
// - contain marketplace composition logic.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Marketplace Card
// -----------------------------------------------------------------------------

export * from './journey-marketplace-card';

// -----------------------------------------------------------------------------
// Journey Provider
// -----------------------------------------------------------------------------

export * from './journey-card-provider';

// -----------------------------------------------------------------------------
// Journey Route
// -----------------------------------------------------------------------------

export * from './journey-card-route';

// -----------------------------------------------------------------------------
// Journey Details
// -----------------------------------------------------------------------------

export * from './journey-card-details';

// -----------------------------------------------------------------------------
// Journey Actions
// -----------------------------------------------------------------------------

export * from './journey-card-actions';

