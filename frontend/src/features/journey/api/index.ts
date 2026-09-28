// -----------------------------------------------------------------------------
// sisiMove — Journey API
// -----------------------------------------------------------------------------
//
// Public API barrel for the Journey feature.
//
// The Journey API is organized by capability:
// - journeys: lifecycle and journey-level queries
// - corridor: journey corridor attachment/removal
// - waypoints: corridor waypoint mutations
// - schedule: journey schedule attachment/removal
// - vehicle: journey vehicle attachment/removal
// - capacity: journey capacity attachment/removal
// - pricing: journey pricing attachment/removal
// - preferences: journey preference attachment/removal
// - assets: journey asset attachment/removal
//
// This file intentionally contains no API implementation. It only re-exports
// the feature's public HTTP capabilities so consumers can import from:
//
//   @/features/journey/api
//
// rather than depending on the internal directory structure.
//
// -----------------------------------------------------------------------------

export * from "./journeys";
export * from "./corridor";
export * from "./waypoints";
export * from "./schedule";
export * from "./vehicle";
export * from "./capacity";
export * from "./pricing";
export * from "./preferences";
export * from "./assets";