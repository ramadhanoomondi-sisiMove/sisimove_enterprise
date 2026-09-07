// -----------------------------------------------------------------------------
// Support — Command Exports
// -----------------------------------------------------------------------------
//
// Central export barrel for Support application commands.
//
// Exposes both:
// - explicit command class exports;
// - default command aliases.
//
// -----------------------------------------------------------------------------

// Support Case lifecycle
export { CreateSupportCaseCommand } from './create-support-case.command';
export { AssignSupportCaseCommand } from './assign-support-case.command';
export { UnassignSupportCaseCommand } from './unassign-support-case.command';
export { ChangeSupportCasePriorityCommand } from './change-support-case-priority.command';
export { ChangeSupportCaseCategoryCommand } from './change-support-case-category.command';
export { StartSupportCaseCommand } from './start-support-case.command';
export { WaitForMemberSupportCaseCommand } from './wait-for-member-support-case.command';
export { WaitForInternalActionSupportCaseCommand } from './wait-for-internal-action-support-case.command';
export { ResolveSupportCaseCommand } from './resolve-support-case.command';
export { CloseSupportCaseCommand } from './close-support-case.command';
export { CancelSupportCaseCommand } from './cancel-support-case.command';

// Support Case participants
export { AddSupportCaseParticipantCommand } from './add-support-case-participant.command';
export { RemoveSupportCaseParticipantCommand } from './remove-support-case-participant.command';

// Support Case messages
export { AddSupportCaseMessageCommand } from './add-support-case-message.command';
export { EditSupportCaseMessageCommand } from './edit-support-case-message.command';
export { DeleteSupportCaseMessageCommand } from './delete-support-case-message.command';

// Support Case notes
export { AddSupportCaseNoteCommand } from './add-support-case-note.command';

// Support Case evidence
export { AddSupportCaseEvidenceCommand } from './add-support-case-evidence.command';

// Support Case resolution
export { CreateSupportCaseResolutionCommand } from './create-support-case-resolution.command';

// -----------------------------------------------------------------------------
// Default command aliases
// -----------------------------------------------------------------------------

// Support Case lifecycle
export { default as CreateSupportCase } from './create-support-case.command';
export { default as AssignSupportCase } from './assign-support-case.command';
export { default as UnassignSupportCase } from './unassign-support-case.command';
export { default as ChangeSupportCasePriority } from './change-support-case-priority.command';
export { default as ChangeSupportCaseCategory } from './change-support-case-category.command';
export { default as StartSupportCase } from './start-support-case.command';
export { default as WaitForMemberSupportCase } from './wait-for-member-support-case.command';
export { default as WaitForInternalActionSupportCase } from './wait-for-internal-action-support-case.command';
export { default as ResolveSupportCase } from './resolve-support-case.command';
export { default as CloseSupportCase } from './close-support-case.command';
export { default as CancelSupportCase } from './cancel-support-case.command';

// Support Case participants
export { default as AddSupportCaseParticipant } from './add-support-case-participant.command';
export { default as RemoveSupportCaseParticipant } from './remove-support-case-participant.command';

// Support Case messages
export { default as AddSupportCaseMessage } from './add-support-case-message.command';
export { default as EditSupportCaseMessage } from './edit-support-case-message.command';
export { default as DeleteSupportCaseMessage } from './delete-support-case-message.command';

// Support Case notes
export { default as AddSupportCaseNote } from './add-support-case-note.command';

// Support Case evidence
export { default as AddSupportCaseEvidence } from './add-support-case-evidence.command';

// Support Case resolution
export { default as CreateSupportCaseResolution } from './create-support-case-resolution.command';
