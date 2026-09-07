// -----------------------------------------------------------------------------
// Support — Exceptions
// -----------------------------------------------------------------------------
//
// Central barrel export for all Support Case domain exceptions.
//
// Exception hierarchy:
//
// SupportCaseException
// ├── SupportCaseNotFoundException
// ├── SupportCaseInvalidStatusException
// ├── SupportCaseInvalidPriorityException
// ├── SupportCaseInvalidCategoryException
// ├── SupportCaseSubjectEmptyException
// ├── SupportCaseDescriptionEmptyException
// ├── SupportCaseAlreadyResolvedException
// ├── SupportCaseAlreadyClosedException
// ├── SupportCaseAlreadyCancelledException
// ├── SupportCaseAssigneeInvalidException
// │
// ├── SupportCaseParticipantNotFoundException
// ├── SupportCaseParticipantAlreadyExistsException
// ├── SupportCaseParticipantInvalidRoleException
// │
// ├── SupportCaseMessageNotFoundException
// ├── SupportCaseMessageEmptyException
// ├── SupportCaseMessageInvalidTypeException
// ├── SupportCaseMessageAlreadyEditedException
// ├── SupportCaseMessageAlreadyDeletedException
// │
// ├── SupportCaseNoteNotFoundException
// ├── SupportCaseNoteEmptyException
// │
// ├── SupportCaseEvidenceNotFoundException
// ├── SupportCaseEvidenceAssetInvalidException
// │
// ├── SupportCaseResolutionAlreadyExistsException
// ├── SupportCaseResolutionSummaryEmptyException
// └── SupportCaseResolutionInvalidTypeException
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Support Case
// -----------------------------------------------------------------------------

export * from './support-case.exception';

export * from './support-case-not-found.exception';
export * from './support-case-invalid-status.exception';
export * from './support-case-invalid-priority.exception';
export * from './support-case-invalid-category.exception';
export * from './support-case-subject-empty.exception';
export * from './support-case-description-empty.exception';
export * from './support-case-already-resolved.exception';
export * from './support-case-already-closed.exception';
export * from './support-case-already-cancelled.exception';
export * from './support-case-assignee-invalid.exception';

// -----------------------------------------------------------------------------
// Support Case Participant
// -----------------------------------------------------------------------------

export * from './support-case-participant-not-found.exception';
export * from './support-case-participant-already-exists.exception';
export * from './support-case-participant-invalid-role.exception';

// -----------------------------------------------------------------------------
// Support Case Message
// -----------------------------------------------------------------------------

export * from './support-case-message-not-found.exception';
export * from './support-case-message-empty.exception';
export * from './support-case-message-invalid-type.exception';
export * from './support-case-message-already-edited.exception';
export * from './support-case-message-already-deleted.exception';

// -----------------------------------------------------------------------------
// Support Case Note
// -----------------------------------------------------------------------------

export * from './support-case-note-not-found.exception';
export * from './support-case-note-empty.exception';

// -----------------------------------------------------------------------------
// Support Case Evidence
// -----------------------------------------------------------------------------

export * from './support-case-evidence-not-found.exception';
export * from './support-case-evidence-asset-invalid.exception';

// -----------------------------------------------------------------------------
// Support Case Resolution
// -----------------------------------------------------------------------------

export * from './support-case-resolution-already-exists.exception';
export * from './support-case-resolution-summary-empty.exception';
export * from './support-case-resolution-invalid-type.exception';
