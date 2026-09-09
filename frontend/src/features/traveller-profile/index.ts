// -----------------------------------------------------------------------------
// Traveller Profile Feature
// -----------------------------------------------------------------------------
//
// Public entry point for the traveller-profile feature.
//
// Consumers should import traveller-profile functionality through this barrel
// rather than reaching into internal feature directories.
//
// -----------------------------------------------------------------------------

export * from './api';
export * from './hooks';
export * from './models';

// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Components
// -----------------------------------------------------------------------------
//
// Public exports for Traveller Profile presentation components.
//
// Consumers should import Traveller Profile components through this barrel
// rather than reaching into individual component files.
//
// Non-responsibilities:
// - No feature-model re-exports.
// - No API exports.
// - No hook exports.
// - No Trust exports.
//
// -----------------------------------------------------------------------------

