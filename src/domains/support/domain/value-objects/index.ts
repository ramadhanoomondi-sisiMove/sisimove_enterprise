// -----------------------------------------------------------------------------
// Support — Value Objects
// -----------------------------------------------------------------------------
//
// Central barrel export for all Support domain value objects.
//
// Value objects represented:
//
// - Support Case identity;
// - Support Case lifecycle;
// - Support Case classification;
// - Support Case requester and assignment;
// - Support Case external references;
// - Support Case participants;
// - Support Case messages;
// - Support Case notes;
// - Support Case evidence;
// - Support Case resolution.
//
// Domain behavior remains inside the individual value objects.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Support Case
// -----------------------------------------------------------------------------

export * from './support-case-public-id.vo';
export * from './support-case-status.vo';
export * from './support-case-priority.vo';
export * from './support-case-category.vo';
export * from './support-case-subject.vo';
export * from './support-case-description.vo';

// -----------------------------------------------------------------------------
// Support Case — Requester & Assignment
// -----------------------------------------------------------------------------

export * from './support-case-requester-public-id.vo';
export * from './support-case-assigned-to-public-id.vo';

// -----------------------------------------------------------------------------
// Support Case — External Reference
// -----------------------------------------------------------------------------

export * from './support-case-reference-type.vo';
export * from './support-case-reference-public-id.vo';

// -----------------------------------------------------------------------------
// Support Case — Participant
// -----------------------------------------------------------------------------

export * from './support-case-participant-public-id.vo';
export * from './support-case-participant-role.vo';

// -----------------------------------------------------------------------------
// Support Case — Message
// -----------------------------------------------------------------------------

export * from './support-case-message-public-id.vo';
export * from './support-case-message-type.vo';
export * from './support-case-message-content.vo';
export * from './support-case-message-sender-public-id.vo';
export * from './support-case-message-asset-id.vo';

// -----------------------------------------------------------------------------
// Support Case — Note
// -----------------------------------------------------------------------------

export * from './support-case-note-public-id.vo';
export * from './support-case-note-content.vo';
export * from './support-case-note-author-public-id.vo';

// -----------------------------------------------------------------------------
// Support Case — Evidence
// -----------------------------------------------------------------------------

export * from './support-case-evidence-public-id.vo';
export * from './support-case-evidence-submitted-by-public-id.vo';
export * from './support-case-evidence-asset-id.vo';
export * from './support-case-evidence-description.vo';

// -----------------------------------------------------------------------------
// Support Case — Resolution
// -----------------------------------------------------------------------------

export * from './support-case-resolution-public-id.vo';
export * from './support-case-resolution-type.vo';
export * from './support-case-resolution-summary.vo';
export * from './support-case-resolution-resolved-by-public-id.vo';
