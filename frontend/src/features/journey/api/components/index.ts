// -----------------------------------------------------------------------------
// sisiMove — Journey Component APIs Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for all Journey component API adapters.
//
// Journey component capabilities exposed by the frozen Journey controller:
//
//   Corridor
//   Waypoints
//   Schedule
//   Vehicle
//   Capacity
//   Pricing
//   Preferences
//   Assets
//
// Each component API remains isolated within its own feature folder. This
// barrel provides the stable public API surface for consumers that need to
// access multiple Journey component operations.
//
// IMPORTANT:
//
// These APIs attach existing component resources to a Journey. They do not
// create the underlying component resources unless explicitly supported by
// another bounded context.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Corridor
// -----------------------------------------------------------------------------

export * from './corridor';

// -----------------------------------------------------------------------------
// Waypoints
// -----------------------------------------------------------------------------

export * from './waypoints';

// -----------------------------------------------------------------------------
// Schedule
// -----------------------------------------------------------------------------

export * from './schedule';

// -----------------------------------------------------------------------------
// Vehicle
// -----------------------------------------------------------------------------

export * from './vehicle';

// -----------------------------------------------------------------------------
// Capacity
// -----------------------------------------------------------------------------

export * from './capacity';

// -----------------------------------------------------------------------------
// Pricing
// -----------------------------------------------------------------------------

export * from './pricing';

// -----------------------------------------------------------------------------
// Preferences
// -----------------------------------------------------------------------------

export * from './preferences';

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------

export * from './assets';