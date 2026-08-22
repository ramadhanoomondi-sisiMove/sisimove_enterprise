// -----------------------------------------------------------------------------
// Commercial Booking Commission — Create Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  CommercialBookingCommissionAmount,
  CommercialBookingCommissionBaseAmount,
  CommercialBookingCommissionBookingPublicId,
  CommercialBookingCommissionCurrency,
  CommercialBookingCommissionJourneyPublicId,
  CommercialBookingCommissionPercentage,
  CommercialCommissionRulePublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for creating a Commercial Booking Commission aggregate.
 *
 * A Commercial Booking Commission represents the platform commission assessed
 * against a Booking.
 *
 * The command carries domain-ready value objects rather than raw transport
 * values. DTO-to-domain conversion belongs to the presentation/application
 * boundary.
 *
 * The command captures the complete commercial assessment snapshot:
 *
 * - Commercial Commission Rule reference;
 * - Booking reference;
 * - Journey reference;
 * - commission percentage;
 * - assessment base amount;
 * - calculated commission amount;
 * - currency.
 *
 * These values become historical snapshots on the Commercial Booking
 * Commission entity and are not recalculated by the aggregate lifecycle.
 *
 * A newly created Commercial Booking Commission always begins in PENDING
 * state. Assessment and cancellation are handled by their respective
 * commands.
 *
 * The command does not own or modify:
 *
 * - Booking;
 * - Journey;
 * - Commercial Commission Rule;
 * - Wallet;
 * - Settlement;
 * - Accounting;
 * - Identity.
 *
 * Those concepts belong to other bounded contexts or independent aggregates
 * and are referenced through public identifiers.
 */
export class CreateCommercialBookingCommissionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Commercial Commission Rule used to produce this
     * commission assessment.
     *
     * The rule reference is retained as a historical reference to the policy
     * used when the assessment was produced.
     */
    public readonly commissionRulePublicId: CommercialCommissionRulePublicId,

    /**
     * Public identity of the Booking against which the commission is assessed.
     */
    public readonly bookingPublicId: CommercialBookingCommissionBookingPublicId,

    /**
     * Public identity of the Journey associated with the Booking.
     */
    public readonly journeyPublicId: CommercialBookingCommissionJourneyPublicId,

    /**
     * Commission percentage captured as part of the assessment snapshot.
     */
    public readonly percentage: CommercialBookingCommissionPercentage,

    /**
     * Monetary Booking amount against which the commission is assessed.
     */
    public readonly baseAmount: CommercialBookingCommissionBaseAmount,

    /**
     * Commission amount calculated from the applicable commercial rule and
     * captured as an immutable historical assessment snapshot.
     */
    public readonly commissionAmount: CommercialBookingCommissionAmount,

    /**
     * Currency in which the commission assessment is denominated.
     */
    public readonly currency: CommercialBookingCommissionCurrency,

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
