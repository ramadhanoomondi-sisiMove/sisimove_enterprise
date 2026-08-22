// -----------------------------------------------------------------------------
// Commercial Booking Commission — Assess Command
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
 * Command for assessing a Commercial Booking Commission aggregate.
 *
 * Assessment represents the transition of a pending Commercial Booking
 * Commission into its ASSESSED lifecycle state.
 *
 * The command identifies the existing commission through its public
 * identifier and carries the timestamp at which the assessment occurs.
 *
 * The commission percentage, base amount, commission amount, and currency are
 * intentionally not supplied by this command. They are immutable commercial
 * assessment snapshots established when the commission was created.
 *
 * The aggregate and entity are responsible for enforcing the intrinsic
 * lifecycle rules governing assessment.
 *
 * A commission can only be assessed while the aggregate is in a state that
 * permits assessment.
 *
 * The command does not modify:
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
export class AssessCommercialBookingCommissionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Commercial Booking Commission to assess.
     */
    public readonly publicId: CommercialBookingCommissionPublicId,

    /**
     * Timestamp at which the commission assessment is performed.
     */
    public readonly assessedAt: Date,

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
