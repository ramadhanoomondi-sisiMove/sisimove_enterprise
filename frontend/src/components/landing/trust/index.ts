// src/components/landing/trust/index.ts

// -----------------------------------------------------------------------------
// sisiMove — Landing Trust Components
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Trust Section
// -----------------------------------------------------------------------------

export {
  TrustSection,
} from './trust-section';

export type {
  TrustSectionProps,
} from './trust-section';

// -----------------------------------------------------------------------------
// Trust Section Header
// -----------------------------------------------------------------------------

export {
  TrustSectionHeader,
} from './trust-section-header';

export type {
  TrustSectionHeaderProps,
} from './trust-section-header';

// -----------------------------------------------------------------------------
// Trust Signals
// -----------------------------------------------------------------------------

export {
  VerificationSummary,
} from './verification-summary';

export type {
  VerificationSummaryProps,
} from './verification-summary';

export {
  RatingSummary,
} from './rating-summary';

export type {
  RatingSummaryProps,
} from './rating-summary';

export {
  JourneyHistorySummary,
} from './journey-history-summary';

export type {
  JourneyHistorySummaryProps,
} from './journey-history-summary';

export {
  TrustSignalList,
} from './trust-signal-list';

export type {
  TrustSignal,
  TrustSignalListProps,
} from './trust-signal-list';

// -----------------------------------------------------------------------------
// sisiMove — Trust Components Barrel
// -----------------------------------------------------------------------------
//
// Public exports for Trust presentation components.
//
// Keeps consumers independent from the internal Trust component directory
// structure.
//
// -----------------------------------------------------------------------------

export {
  TravellerProfileTrust,
} from './traveller-profile-trust';

export type {
  TravellerProfileTrustProps,
} from './traveller-profile-trust';