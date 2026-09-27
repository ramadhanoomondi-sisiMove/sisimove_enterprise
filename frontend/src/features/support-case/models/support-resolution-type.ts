// -----------------------------------------------------------------------------
// sisiMove — Support Case Resolution Type
// -----------------------------------------------------------------------------
//
// API/application model for resolution types returned by the Support HTTP API.
//
// Responsibilities:
// - represent the finite set of Support Case resolution types;
// - provide a strongly typed frontend union;
// - allow member-facing resolution presentation.
//
// Non-responsibilities:
// - creating resolutions;
// - deciding whether a case may be resolved;
// - determining the appropriate resolution type;
// - performing Support actions;
// - reproducing SupportCaseAggregate resolution rules.
//
// Resolution decisions remain backend Support-domain responsibilities.
//
// -----------------------------------------------------------------------------

export const SUPPORT_RESOLUTION_TYPES = [
  'INFORMATION_PROVIDED',
  'ACTION_TAKEN',
  'REFUND_ISSUED',
  'BOOKING_CANCELLED',
  'JOURNEY_CANCELLED',
  'ACCOUNT_RESTRICTED',
  'TRUST_ACTION',
  'VERIFICATION_ACTION',
  'NO_ACTION_REQUIRED',
  'REFERRED',
  'OTHER',
] as const;

export type SupportResolutionType =
  (typeof SUPPORT_RESOLUTION_TYPES)[number];