// -----------------------------------------------------------------------------
// sisiMove — Journey Feature
// Feature Barrel
// -----------------------------------------------------------------------------
//
// Public entry point for the Journey feature.
//
// Consumers should import Journey functionality through:
//
//     @/features/journey
//
// rather than reaching into internal directories such as:
//
//     @/features/journey/models
//     @/features/journey/api
//     @/features/journey/hooks
//     @/features/journey/mappers
//
// This keeps the feature's internal structure replaceable while providing a
// stable public API to the rest of the frontend.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain-facing models
// -----------------------------------------------------------------------------

export * from './models';

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
//
// API functions remain available to feature consumers that need direct
// transport access. Application UI should generally prefer the hooks layer.

export * from './api';

// -----------------------------------------------------------------------------
// React hooks
// -----------------------------------------------------------------------------

export * from './hooks';

// -----------------------------------------------------------------------------
// Mappers
// -----------------------------------------------------------------------------
//
// Mappers are exported because they form part of the feature's presentation
// boundary when API responses need to be normalized outside the hooks.

export * from './mappers';