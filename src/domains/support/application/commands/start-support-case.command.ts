// -----------------------------------------------------------------------------
// Support — Start Support Case Command
// -----------------------------------------------------------------------------
//
// Application command for starting an existing Support Case.
//
// The command expresses the intent to transition a Support Case from OPEN
// into IN_PROGRESS.
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
// - validate lifecycle rules;
// - access repositories;
// - access Prisma;
// - emit domain events.
//
// SupportCaseAggregate.open() owns the lifecycle transition.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class StartSupportCaseCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,

    public readonly correlationId: string,

    public readonly causationId?: string,
  ) {}
}

export default StartSupportCaseCommand;
