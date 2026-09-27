// -----------------------------------------------------------------------------
// sisiMove — Support Case Participant Role
// -----------------------------------------------------------------------------
//
// API/application model for participant roles returned by the Support HTTP
// API.
//
// Responsibilities:
// - represent the finite set of Support Case participant roles;
// - provide a strongly typed frontend union;
// - allow the frontend to present participant role information when exposed.
//
// Non-responsibilities:
// - determining whether a member may join or leave a case;
// - assigning participant roles;
// - deciding participant permissions;
// - managing participant membership;
// - reproducing SupportCaseAggregate participant rules.
//
// Participant membership and role semantics remain backend responsibilities.
//
// -----------------------------------------------------------------------------

export const SUPPORT_CASE_PARTICIPANT_ROLES = [
  'REQUESTER',
  'RESPONDENT',
  'SUPPORT_AGENT',
  'REVIEWER',
] as const;

export type SupportCaseParticipantRole =
  (typeof SUPPORT_CASE_PARTICIPANT_ROLES)[number];