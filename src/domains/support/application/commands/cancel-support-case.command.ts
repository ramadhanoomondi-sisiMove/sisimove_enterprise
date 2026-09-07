// -----------------------------------------------------------------------------
// Support — Cancel Support Case Command
// -----------------------------------------------------------------------------
//
// Application command for cancelling a Support Case.
//
// The command expresses the intent to transition a Support Case into
// CANCELLED.
//
// Responsibilities:
//
// - carry the Support Case public identity;
// - optionally carry the cancellation timestamp;
// - carry correlation/causation metadata.
//
// This command does NOT:
//
// - load the SupportCaseAggregate;
// - mutate SupportCaseEntity;
// - validate cancellation rules;
// - access repositories;
// - access Prisma;
// - emit domain events.
//
// SupportCaseAggregate.markCancelled() owns the cancellation behavior.
//
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class CancelSupportCaseCommand implements Command {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,

    public readonly correlationId: string,

    public readonly cancelledAt: Date | undefined = undefined,

    public readonly causationId?: string,
  ) {}
}

export default CancelSupportCaseCommand;
