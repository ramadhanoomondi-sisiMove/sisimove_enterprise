// -----------------------------------------------------------------------------
// Support — Remove Support Case Participant Command
// -----------------------------------------------------------------------------
//
// Application command for removing a participant from a Support Case.
//
// Removal is represented as the participant leaving the case. The participant
// entity retains its historical record through its leftAt timestamp.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - carry the participant public identity;
// - optionally carry the participant leave timestamp;
// - carry correlation/causation metadata.
//
// Participant lifecycle behavior remains inside:
//
// - SupportCaseAggregate;
// - SupportCaseParticipantEntity.
//
// The command does not:
//
// - access persistence;
// - mutate entities directly;
// - enforce domain invariants;
// - create domain events.
//
// Those responsibilities belong to the application handler and domain layer.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';
import type { SupportCaseParticipantPublicId } from '../../domain/value-objects/support-case-participant-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class RemoveSupportCaseParticipantCommand implements Command {
  public constructor(
    /**
     * Public identity of the Support Case.
     */
    public readonly supportCasePublicId: SupportCasePublicId,

    /**
     * Public identity of the participant being removed.
     */
    public readonly participantPublicId: SupportCaseParticipantPublicId,

    /**
     * Correlation identity for tracing the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional timestamp at which the participant leaves the Support Case.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly leftAt?: Date,

    /**
     * Optional causation identity linking this command to the event or command
     * that caused it.
     */
    public readonly causationId?: string,
  ) {}
}

// =============================================================================
// Default Export
// =============================================================================

export default RemoveSupportCaseParticipantCommand;
