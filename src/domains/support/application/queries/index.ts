// -----------------------------------------------------------------------------
// Support — Query Barrel
// -----------------------------------------------------------------------------
//
// Central export surface for Support application queries.
//
// Query groups:
//
// - Support Case queries;
// - Support Case participant queries;
// - Support Case message queries;
// - Support Case note queries;
// - Support Case evidence queries;
// - Support Case resolution queries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Support Case queries
// -----------------------------------------------------------------------------

export { GetSupportCaseQuery } from './get-support-case.query';
export { GetSupportCasesQuery } from './get-support-cases.query';
export { GetSupportCasesByRequesterQuery } from './get-support-cases-by-requester.query';
export { GetSupportCasesByAssigneeQuery } from './get-support-cases-by-assignee.query';
export { GetSupportCasesByReferenceQuery } from './get-support-cases-by-reference.query';
export { GetSupportCasesByStatusQuery } from './get-support-cases-by-status.query';
export { GetSupportCasesByCategoryQuery } from './get-support-cases-by-category.query';
export { GetSupportCasesByPriorityQuery } from './get-support-cases-by-priority.query';

// -----------------------------------------------------------------------------
// Support Case participants
// -----------------------------------------------------------------------------

export { GetSupportCaseParticipantsQuery } from './get-support-case-participants.query';

// -----------------------------------------------------------------------------
// Support Case messages
// -----------------------------------------------------------------------------

export { GetSupportCaseMessagesQuery } from './get-support-case-messages.query';

// -----------------------------------------------------------------------------
// Support Case notes
// -----------------------------------------------------------------------------

export { GetSupportCaseNotesQuery } from './get-support-case-notes.query';

// -----------------------------------------------------------------------------
// Support Case evidence
// -----------------------------------------------------------------------------

export { GetSupportCaseEvidenceQuery } from './get-support-case-evidence.query';

// -----------------------------------------------------------------------------
// Support Case resolution
// -----------------------------------------------------------------------------

export { GetSupportCaseResolutionQuery } from './get-support-case-resolution.query';

// -----------------------------------------------------------------------------
// Default aliases
// -----------------------------------------------------------------------------

export { default as GetSupportCase } from './get-support-case.query';
export { default as GetSupportCases } from './get-support-cases.query';
export { default as GetSupportCasesByRequester } from './get-support-cases-by-requester.query';
export { default as GetSupportCasesByAssignee } from './get-support-cases-by-assignee.query';
export { default as GetSupportCasesByReference } from './get-support-cases-by-reference.query';
export { default as GetSupportCasesByStatus } from './get-support-cases-by-status.query';
export { default as GetSupportCasesByCategory } from './get-support-cases-by-category.query';
export { default as GetSupportCasesByPriority } from './get-support-cases-by-priority.query';

export { default as GetSupportCaseParticipants } from './get-support-case-participants.query';
export { default as GetSupportCaseMessages } from './get-support-case-messages.query';
export { default as GetSupportCaseNotes } from './get-support-case-notes.query';
export { default as GetSupportCaseEvidence } from './get-support-case-evidence.query';
export { default as GetSupportCaseResolution } from './get-support-case-resolution.query';
