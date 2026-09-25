// -----------------------------------------------------------------------------
// Journey Booking — API Barrel
// -----------------------------------------------------------------------------
//
// Public API surface for the Journey Booking feature.
//
// The feature API is divided into four explicit boundaries:
//
// - discovery  → identifier-based booking reads
// - management → authenticated passenger booking reads
// - lifecycle  → booking lifecycle mutations
// - payment    → booking-local payment-state mutations
//
// Consumers should import Journey Booking HTTP operations from this barrel
// rather than reaching into individual API implementation directories.
//
// No business logic belongs in this file.
// -----------------------------------------------------------------------------

export * from './discovery';
export * from './management';
export * from './lifecycle';
export * from './payment';