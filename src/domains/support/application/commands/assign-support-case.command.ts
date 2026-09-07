// -----------------------------------------------------------------------------
// Support — Assign Support Case Command
// -----------------------------------------------------------------------------
//
// Application command for assigning a Support Case.
//
// The command expresses the intent to assign a Support Case to a member or
// support agent.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - carry the assignee public identity;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - load the SupportCaseAggregate;
// - mutate SupportCaseEntity;
// - validate assignment rules;
// - access repositories;
// - access Prisma;
// - resolve the assignee through Identity;
// - emit domain events.
//
// SupportCaseAggregate.assignTo() owns the assignment behavior.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';

import type { SupportCaseAssignedToPublicId } from '../../domain/value-objects/support-case-assigned-to-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class AssignSupportCaseCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,

    public readonly assignedToPublicId: SupportCaseAssignedToPublicId,

    public readonly correlationId: string,

    public readonly causationId?: string,
  ) {}
}

export default AssignSupportCaseCommand;
