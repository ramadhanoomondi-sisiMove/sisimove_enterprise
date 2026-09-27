// -----------------------------------------------------------------------------
// sisiMove — Support Case Message Type
// -----------------------------------------------------------------------------
//
// API/application model for the message types returned by the Support HTTP
// API.
//
// Responsibilities:
// - represent the finite set of Support Case message types;
// - provide a strongly typed frontend union;
// - allow presentation components to select the appropriate message UI.
//
// Non-responsibilities:
// - deciding who may send a message;
// - validating message content;
// - determining message lifecycle;
// - handling asset storage or delivery;
// - reproducing SupportCaseAggregate message rules.
//
// Message semantics and validation remain backend responsibilities.
//
// -----------------------------------------------------------------------------

export const SUPPORT_MESSAGE_TYPES = [
  'TEXT',
  'IMAGE',
  'FILE',
  'SYSTEM',
] as const;

export type SupportMessageType =
  (typeof SUPPORT_MESSAGE_TYPES)[number];