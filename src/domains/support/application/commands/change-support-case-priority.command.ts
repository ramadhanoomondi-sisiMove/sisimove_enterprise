// -----------------------------------------------------------------------------
// Support — Change Support Case Priority Command
// -----------------------------------------------------------------------------
//
// Application command for changing the priority of a Support Case.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - carry the new priority;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - load the SupportCaseAggregate;
// - mutate SupportCaseEntity;
// - validate priority transition rules;
// - access repositories;
// - access Prisma;
// - emit domain events.
//
// SupportCaseAggregate.changePriority() owns the priority change.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';

import type { SupportCasePriority } from '../../domain/value-objects/support-case-priority.vo';

// =============================================================================
// Command
// =============================================================================

export class ChangeSupportCasePriorityCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,

    public readonly priority: SupportCasePriority,

    public readonly correlationId: string,

    public readonly causationId?: string,
  ) {}
}

export default ChangeSupportCasePriorityCommand;
