// -----------------------------------------------------------------------------
// Journey Booking — Hooks Barrel
// -----------------------------------------------------------------------------
//
// Public React hook surface for the Journey Booking feature.
//
// Hooks are divided into:
//
// - queries   → read existing Journey Booking state;
// - mutations → request backend-owned lifecycle transitions.
//
// HTTP communication remains inside the API layer, while transport mapping
// remains inside the mapper layer.
//
// This barrel provides the feature-level import boundary for React components.
// -----------------------------------------------------------------------------

export * from './queries';
export * from './mutations';