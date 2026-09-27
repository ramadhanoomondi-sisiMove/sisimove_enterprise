// -----------------------------------------------------------------------------
// sisiMove — Support Case Status
// -----------------------------------------------------------------------------
//
// API/application model for the lifecycle status values returned by the
// Support HTTP API.
//
// Responsibilities:
// - represent the finite set of Support Case status values;
// - provide a strongly typed frontend union;
// - keep frontend comparisons aligned with backend serialized values.
//
// Non-responsibilities:
// - determining whether a status transition is valid;
// - deciding which actor may perform a transition;
// - reproducing SupportCaseAggregate lifecycle rules;
// - deciding whether a case is operational or terminal;
// - performing authorization;
// - performing transport validation.
//
// The backend SupportCaseAggregate remains authoritative for all lifecycle
// rules. The frontend consumes the resulting status and presents it.
//
// -----------------------------------------------------------------------------

export const SUPPORT_CASE_STATUSES = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING_FOR_MEMBER',
  'WAITING_FOR_INTERNAL_ACTION',
  'RESOLVED',
  'CLOSED',
  'CANCELLED',
] as const;

export type SupportCaseStatus =
  (typeof SUPPORT_CASE_STATUSES)[number];