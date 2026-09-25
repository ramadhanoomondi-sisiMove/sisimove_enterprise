// -----------------------------------------------------------------------------
// sisiMove — Journey API Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for the complete Journey frontend HTTP API surface.
//
// The Journey API is organized into four capabilities:
//
//   Discovery
//     Public marketplace discovery and published Journey search.
//
//   Management
//     Authenticated provider Journey retrieval.
//
//   Lifecycle
//     Journey creation and lifecycle transitions.
//
//   Components
//     Journey component retrieval, attachment, and removal.
//
// All HTTP transport remains encapsulated inside the individual API adapters.
// Consumers should import Journey API functions from this barrel rather than
// reaching into internal API directories.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public discovery
// -----------------------------------------------------------------------------

export * from './discovery';

// -----------------------------------------------------------------------------
// Authenticated management
// -----------------------------------------------------------------------------

export * from './management';

// -----------------------------------------------------------------------------
// Journey lifecycle
// -----------------------------------------------------------------------------

export * from './lifecycle';

// -----------------------------------------------------------------------------
// Journey components
// -----------------------------------------------------------------------------

export * from './components';