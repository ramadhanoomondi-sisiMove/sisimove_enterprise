// src/domains/trust/domain/events/index.ts

// -----------------------------------------------------------------------------
// Base Domain Event
// -----------------------------------------------------------------------------

export * from './trust-profile-domain.event';

// -----------------------------------------------------------------------------
// Trust Profile Events
// -----------------------------------------------------------------------------

export * from './trust-profile-created.event';
export * from './trust-profile-status-changed.event';
export * from './trust-profile-restricted.event';
export * from './trust-profile-restored.event';
export * from './trust-profile-suspended.event';

// -----------------------------------------------------------------------------
// Trust Verification Events
// -----------------------------------------------------------------------------

export * from './trust-verification-granted.event';
export * from './trust-verification-revoked.event';

// -----------------------------------------------------------------------------
// Trust Journey Events
// -----------------------------------------------------------------------------

export * from './trust-journey-completed.event';
export * from './trust-journey-cancelled.event';

// -----------------------------------------------------------------------------
// Trust Rating Events
// -----------------------------------------------------------------------------

export * from './trust-rating-received.event';
export * from './trust-rating-hidden.event';
export * from './trust-rating-removed.event';
export * from './trust-rating-restored.event';

// -----------------------------------------------------------------------------
// Trust Review Events
// -----------------------------------------------------------------------------

export * from './trust-review-created.event';
export * from './trust-review-updated.event';
export * from './trust-review-removed.event';

// -----------------------------------------------------------------------------
// Trust Badge Events
// -----------------------------------------------------------------------------

export * from './trust-badge-awarded.event';
export * from './trust-badge-revoked.event';

// -----------------------------------------------------------------------------
// Trust Dispute Events
// -----------------------------------------------------------------------------

export * from './trust-dispute-opened.event';
export * from './trust-dispute-resolved.event';

// -----------------------------------------------------------------------------
// Trust Administration Events
// -----------------------------------------------------------------------------

export * from './trust-manual-adjustment.event';
