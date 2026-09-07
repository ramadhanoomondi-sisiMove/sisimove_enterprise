// -----------------------------------------------------------------------------
// Support — Add Support Case Participant Command
// -----------------------------------------------------------------------------
//
// Application command for adding a participant to a Support Case.
//
// The command expresses the intent to add a member as a participant.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - carry the member public identity;
// - carry the participant role;
// - carry correlation/causation metadata.
//
// Domain invariants and participant lifecycle behavior remain inside:
//
// - SupportCaseAggregate;
// - SupportCaseParticipantEntity.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';
import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';
import type { SupportCaseParticipantRole } from '../../domain/value-objects/support-case-participant-role.vo';

export class AddSupportCaseParticipantCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,
    public readonly memberPublicId: string,
    public readonly role: SupportCaseParticipantRole,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}

export default AddSupportCaseParticipantCommand;
