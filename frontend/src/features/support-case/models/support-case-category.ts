// -----------------------------------------------------------------------------
// sisiMove — Support Case Category
// -----------------------------------------------------------------------------
//
// API/application model for the category values returned by the Support HTTP
// API.
//
// Responsibilities:
// - represent the finite set of Support Case categories;
// - provide a strongly typed frontend union;
// - keep frontend category handling aligned with backend serialized values.
//
// Non-responsibilities:
// - determining category eligibility;
// - deciding whether a category may be changed;
// - performing Support routing;
// - determining internal Support ownership;
// - reproducing SupportCaseAggregate behavior.
//
// The backend remains authoritative for category validation and lifecycle
// behavior.
//
// -----------------------------------------------------------------------------

export const SUPPORT_CASE_CATEGORIES = [
  'JOURNEY',
  'BOOKING',
  'PAYMENT',
  'WALLET',
  'REFUND',
  'TRUST',
  'VERIFICATION',
  'MESSAGING',
  'ACCOUNT',
  'SAFETY',
  'OTHER',
] as const;

export type SupportCaseCategory =
  (typeof SUPPORT_CASE_CATEGORIES)[number];