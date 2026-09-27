// -----------------------------------------------------------------------------
// sisiMove — Support Case Priority
// -----------------------------------------------------------------------------
//
// API/application model for the priority values returned by the Support HTTP
// API.
//
// Responsibilities:
// - represent the finite set of Support Case priority values;
// - provide a strongly typed frontend union;
// - keep frontend comparisons aligned with backend serialized values.
//
// Non-responsibilities:
// - deciding who may change priority;
// - deciding when priority may change;
// - performing escalation;
// - reproducing SupportCaseAggregate rules;
// - determining operational urgency;
// - performing authorization.
//
// Priority is presentation/application data. The backend remains authoritative
// for all Support Case priority rules.
//
// -----------------------------------------------------------------------------

export const SUPPORT_CASE_PRIORITIES = [
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT',
] as const;

export type SupportCasePriority =
  (typeof SUPPORT_CASE_PRIORITIES)[number];