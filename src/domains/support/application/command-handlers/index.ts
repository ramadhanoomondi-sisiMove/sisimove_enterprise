// -----------------------------------------------------------------------------
// Support — Command Handlers Index
// -----------------------------------------------------------------------------
//
// Central barrel export for all Support command handlers.
//
// Registered command handlers:
//
// Support Case lifecycle:
// - CreateSupportCaseHandler
// - AssignSupportCaseHandler
// - UnassignSupportCaseHandler
// - ChangeSupportCasePriorityHandler
// - ChangeSupportCaseCategoryHandler
// - StartSupportCaseHandler
// - WaitForMemberSupportCaseHandler
// - WaitForInternalActionSupportCaseHandler
// - ResolveSupportCaseHandler
// - CloseSupportCaseHandler
// - CancelSupportCaseHandler
//
// Support Case participants:
// - AddSupportCaseParticipantHandler
// - RemoveSupportCaseParticipantHandler
//
// Support Case messages:
// - AddSupportCaseMessageHandler
// - EditSupportCaseMessageHandler
// - DeleteSupportCaseMessageHandler
//
// Support Case notes:
// - AddSupportCaseNoteHandler
//
// Support Case evidence:
// - AddSupportCaseEvidenceHandler
//
// Support Case resolution:
// - CreateSupportCaseResolutionHandler
//
// This barrel is intentionally limited to command handlers.
// Commands themselves are exported from the commands barrel.
//
// -----------------------------------------------------------------------------

export { CreateSupportCaseHandler } from './create-support-case.handler';
export { AssignSupportCaseHandler } from './assign-support-case.handler';
export { UnassignSupportCaseHandler } from './unassign-support-case.handler';
export { ChangeSupportCasePriorityHandler } from './change-support-case-priority.handler';
export { ChangeSupportCaseCategoryHandler } from './change-support-case-category.handler';
export { StartSupportCaseHandler } from './start-support-case.handler';
export { WaitForMemberSupportCaseHandler } from './wait-for-member-support-case.handler';
export { WaitForInternalActionSupportCaseHandler } from './wait-for-internal-action-support-case.handler';
export { ResolveSupportCaseHandler } from './resolve-support-case.handler';
export { CloseSupportCaseHandler } from './close-support-case.handler';
export { CancelSupportCaseHandler } from './cancel-support-case.handler';

export { AddSupportCaseParticipantHandler } from './add-support-case-participant.handler';
export { RemoveSupportCaseParticipantHandler } from './remove-support-case-participant.handler';

export { AddSupportCaseMessageHandler } from './add-support-case-message.handler';
export { EditSupportCaseMessageHandler } from './edit-support-case-message.handler';
export { DeleteSupportCaseMessageHandler } from './delete-support-case-message.handler';

export { AddSupportCaseNoteHandler } from './add-support-case-note.handler';

export { AddSupportCaseEvidenceHandler } from './add-support-case-evidence.handler';

export { CreateSupportCaseResolutionHandler } from './create-support-case-resolution.handler';
