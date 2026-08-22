// -----------------------------------------------------------------------------
// Commercial Domain — Earning Commission Commands
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { CommercialEarningCommissionPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Cancel Commercial Earning Commission Command
// -----------------------------------------------------------------------------

/**
 * Cancels an earning commission.
 *
 * Cancellation is a lifecycle transition only. The command does not modify
 * the historical financial snapshot of the commission. Existing base amount,
 * commission amount, net amount, currency, percentage, and commission rule
 * reference remain preserved for auditability.
 *
 * The commission must be in a state that permits cancellation according to
 * the CommercialEarningCommission domain rules.
 *
 * The command identifies the commission by its public identifier and carries
 * the cancellation timestamp used by the domain lifecycle transition.
 *
 * Correlation and causation identifiers support distributed tracing and
 * domain-event lineage across the Commercial, Settlement, Financial, and
 * Accounting domains.
 */
export class CancelCommercialEarningCommissionCommand implements Command {
  constructor(
    /**
     * Public identifier of the earning commission to cancel.
     */
    public readonly publicId: CommercialEarningCommissionPublicId,

    /**
     * Timestamp at which the earning commission is cancelled.
     */
    public readonly cancelledAt: Date,

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
