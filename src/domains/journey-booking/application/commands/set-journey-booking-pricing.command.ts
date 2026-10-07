// src/domains/journey-booking/application/commands/set-journey-booking-pricing.command.ts

// -----------------------------------------------------------------------------
// Journey Booking Pricing — Set Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyBookingPublicId,
  JourneyBookingPricePerSeat,
  JourneyBookingSeats,
  JourneyBookingSubtotal,
  JourneyBookingDiscountAmount,
  JourneyBookingAdjustmentAmount,
  JourneyBookingTotalAmount,
  JourneyBookingCurrency,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Sets the historical pricing snapshot for an existing Journey Booking.
 *
 * The pricing snapshot preserves the fare information applicable to the
 * booking at the time the pricing is established.
 *
 * The command receives already validated domain value objects.
 *
 * Discount and adjustment are optional because the pricing entity defaults
 * both values to zero when they are not supplied.
 */
export class SetJourneyBookingPricingCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Journey Booking
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Booking receiving the pricing snapshot.
     */
    public readonly journeyBookingPublicId: JourneyBookingPublicId,

    // -------------------------------------------------------------------------
    // Required Pricing
    // -------------------------------------------------------------------------

    /**
     * Captured price per seat.
     */
    public readonly pricePerSeat: JourneyBookingPricePerSeat,

    /**
     * Number of seats included in the pricing snapshot.
     */
    public readonly seats: JourneyBookingSeats,

    /**
     * Captured subtotal.
     *
     * Expected to equal pricePerSeat × seats.
     */
    public readonly subtotal: JourneyBookingSubtotal,

    /**
     * Captured final total amount.
     *
     * Expected to equal:
     *
     * subtotal - discount + adjustment
     */
    public readonly totalAmount: JourneyBookingTotalAmount,

    /**
     * Currency in which the pricing is expressed.
     */
    public readonly currency: JourneyBookingCurrency,

    // -------------------------------------------------------------------------
    // Correlation
    // -------------------------------------------------------------------------

    /**
     * Correlation identifier for distributed tracing and workflow tracking.
     */
    public readonly correlationId: string,

    // -------------------------------------------------------------------------
    // Optional Pricing
    // -------------------------------------------------------------------------

    /**
     * Optional captured discount amount.
     *
     * Defaults to zero when omitted.
     */
    public readonly discountAmount?: JourneyBookingDiscountAmount,

    /**
     * Optional captured pricing adjustment.
     *
     * Defaults to zero when omitted.
     */
    public readonly adjustmentAmount?: JourneyBookingAdjustmentAmount,

    // -------------------------------------------------------------------------
    // Causation
    // -------------------------------------------------------------------------

    /**
     * Optional identifier of the command or event that caused this command.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
