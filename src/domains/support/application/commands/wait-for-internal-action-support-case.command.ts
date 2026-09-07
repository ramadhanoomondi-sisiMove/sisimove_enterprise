// -----------------------------------------------------------------------------
// Support — Wait For Internal Action Support Case Command
// -----------------------------------------------------------------------------
//
// Application command for placing a Support Case into
// WAITING_FOR_INTERNAL_ACTION.
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
// The SupportCaseAggregate owns the lifecycle transition into
// WAITING_FOR_INTERNAL_ACTION.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class WaitForInternalActionSupportCaseCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,

    public readonly correlationId: string,

    public readonly causationId?: string,
  ) {}
}

export default WaitForInternalActionSupportCaseCommand;
