// -----------------------------------------------------------------------------
// Support — Unassign Support Case Command
// -----------------------------------------------------------------------------
//
// Application command for removing the assignment from a Support Case.
//
// The command expresses the intent to unassign a Support Case.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - load the SupportCaseAggregate;
// - mutate SupportCaseEntity;
// - validate assignment rules;
// - access repositories;
// - access Prisma;
// - emit domain events.
//
// SupportCaseAggregate.unassign() owns the unassignment behavior.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class UnassignSupportCaseCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,

    public readonly correlationId: string,

    public readonly causationId?: string,
  ) {}
}

export default UnassignSupportCaseCommand;
