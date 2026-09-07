// -----------------------------------------------------------------------------
// Support — Close Support Case Command
// -----------------------------------------------------------------------------
//
// Application command for closing a Support Case.
//
// The command expresses the intent to transition a resolved Support Case into
// CLOSED.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - optionally carry the closure timestamp;
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
// SupportCaseAggregate.markClosed() owns the closing behavior.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class CloseSupportCaseCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,

    public readonly correlationId: string,

    public readonly closedAt: Date | undefined = undefined,

    public readonly causationId?: string,
  ) {}
}

export default CloseSupportCaseCommand;
