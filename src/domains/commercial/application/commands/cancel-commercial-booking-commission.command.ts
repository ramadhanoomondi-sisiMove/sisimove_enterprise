// -----------------------------------------------------------------------------
// Commercial Booking Commission — Cancel Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for cancelling a Commercial Booking Commission aggregate.
 *
 * Cancellation represents the transition of a Commercial Booking Commission
 * into its CANCELLED lifecycle state.
 *
 * The command identifies the existing commission through its public
 * identifier and carries the timestamp at which the cancellation occurs.
 *
 * The commission assessment snapshot is intentionally not supplied by this
 * command. The following values remain immutable historical facts established
 * when the commission was created:
 *
 * - commission percentage;
 * - base amount;
 * - commission amount;
 * - currency;
 * - Commercial Commission Rule reference;
 * - Booking reference;
 * - Journey reference.
 *
 * The aggregate and entity are responsible for enforcing the intrinsic
 * lifecycle rules governing cancellation.
 *
 * Cancellation may be valid while the commission is PENDING or ASSESSED,
 * according to the current Commercial Booking Commission lifecycle.
 *
 * If the commission was previously assessed, its assessedAt timestamp remains
 * preserved by the domain entity so that the historical assessment fact is not
 * lost.
 *
 * The command does not directly modify:
 *
 * - Booking;
 * - Journey;
 * - Commercial Commission Rule;
 * - Wallet;
 * - Settlement;
 * - Accounting;
 * - Identity.
 *
 * Those concepts belong to other bounded contexts or independent aggregates.
 */
export class CancelCommercialBookingCommissionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Commercial Booking Commission to cancel.
     */
    public readonly publicId: CommercialBookingCommissionPublicId,

    /**
     * Timestamp at which the commission cancellation is performed.
     */
    public readonly cancelledAt: Date,

    /**
     * Correlation identifier used to trace the command and resulting domain
     * event through the application workflow.
     */
    public readonly correlationId: string,

    /**
     * Optional causation identifier identifying the command or event that
     * caused this command.
     */
    public readonly causationId?: string,
  ) {}
}
