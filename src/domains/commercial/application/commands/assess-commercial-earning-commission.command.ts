// -----------------------------------------------------------------------------
// Commercial Domain — Earning Commission Commands
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { CommercialEarningCommissionPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Assess Commercial Earning Commission Command
// -----------------------------------------------------------------------------

/**
 * Marks an earning commission as assessed.
 *
 * Assessment is a lifecycle transition only. The earning commission's
 * financial snapshot — including base amount, commission amount, and net
 * amount — is already established when the commission is created and is not
 * recalculated by this command.
 *
 * The commission must be in a state that permits assessment according to
 * the CommercialEarningCommission domain rules.
 *
 * The command identifies the commission by its public identifier and carries
 * the assessment timestamp used by the domain lifecycle transition.
 *
 * Correlation and causation identifiers support distributed tracing and
 * domain-event lineage across the Commercial, Settlement, Financial, and
 * Accounting domains.
 */
export class AssessCommercialEarningCommissionCommand implements Command {
  constructor(
    /**
     * Public identifier of the earning commission to assess.
     */
    public readonly publicId: CommercialEarningCommissionPublicId,

    /**
     * Timestamp at which the earning commission is assessed.
     */
    public readonly assessedAt: Date,

    /**
     * Identifier used to correlate this command with the originating
     * business operation and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or event that caused this command.
     */
    public readonly causationId?: string,
  ) {}
}
