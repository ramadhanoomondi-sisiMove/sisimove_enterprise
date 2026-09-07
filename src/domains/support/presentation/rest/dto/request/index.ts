// -----------------------------------------------------------------------------
// Support — Request DTOs Index
// -----------------------------------------------------------------------------
//
// Central barrel export for Support command/request transport DTOs.
//
// Registered DTOs:
//
// Support Case lifecycle:
// - CreateSupportCaseRequestDto
// - AssignSupportCaseRequestDto
// - UnassignSupportCaseRequestDto
// - ChangeSupportCasePriorityRequestDto
// - ChangeSupportCaseCategoryRequestDto
// - StartSupportCaseRequestDto
// - WaitForMemberSupportCaseRequestDto
// - WaitForInternalActionSupportCaseRequestDto
// - ResolveSupportCaseRequestDto
// - CloseSupportCaseRequestDto
// - CancelSupportCaseRequestDto
//
// Participants:
// - AddSupportCaseParticipantRequestDto
// - RemoveSupportCaseParticipantRequestDto
//
// Messages:
// - AddSupportCaseMessageRequestDto
// - EditSupportCaseMessageRequestDto
// - DeleteSupportCaseMessageRequestDto
//
// Notes and evidence:
// - AddSupportCaseNoteRequestDto
// - AddSupportCaseEvidenceRequestDto
//
// Resolution:
// - CreateSupportCaseResolutionRequestDto
//
// -----------------------------------------------------------------------------

export { default as CreateSupportCaseRequestDto } from './create-support-case.request.dto';

export { default as AssignSupportCaseRequestDto } from './assign-support-case.request.dto';

export { default as UnassignSupportCaseRequestDto } from './unassign-support-case.request.dto';

export { default as ChangeSupportCasePriorityRequestDto } from './change-support-case-priority.request.dto';

export { default as ChangeSupportCaseCategoryRequestDto } from './change-support-case-category.request.dto';

export { default as StartSupportCaseRequestDto } from './start-support-case.request.dto';

export { default as WaitForMemberSupportCaseRequestDto } from './wait-for-member-support-case.request.dto';

export { default as WaitForInternalActionSupportCaseRequestDto } from './wait-for-internal-action-support-case.request.dto';

export { default as ResolveSupportCaseRequestDto } from './resolve-support-case.request.dto';

export { default as CloseSupportCaseRequestDto } from './close-support-case.request.dto';

export { default as CancelSupportCaseRequestDto } from './cancel-support-case.request.dto';

// -----------------------------------------------------------------------------
// Participants
// -----------------------------------------------------------------------------

export { default as AddSupportCaseParticipantRequestDto } from './add-support-case-participant.request.dto';

export { default as RemoveSupportCaseParticipantRequestDto } from './remove-support-case-participant.request.dto';

// -----------------------------------------------------------------------------
// Messages
// -----------------------------------------------------------------------------

export { default as AddSupportCaseMessageRequestDto } from './add-support-case-message.request.dto';

export { default as EditSupportCaseMessageRequestDto } from './edit-support-case-message.request.dto';

export { default as DeleteSupportCaseMessageRequestDto } from './delete-support-case-message.request.dto';

// -----------------------------------------------------------------------------
// Notes and Evidence
// -----------------------------------------------------------------------------

export { default as AddSupportCaseNoteRequestDto } from './add-support-case-note.request.dto';

export { default as AddSupportCaseEvidenceRequestDto } from './add-support-case-evidence.request.dto';

// -----------------------------------------------------------------------------
// Resolution
// -----------------------------------------------------------------------------

export { default as CreateSupportCaseResolutionRequestDto } from './create-support-case-resolution.request.dto';
