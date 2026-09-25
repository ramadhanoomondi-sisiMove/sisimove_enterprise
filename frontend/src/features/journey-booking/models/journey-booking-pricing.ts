// -----------------------------------------------------------------------------
// Journey Booking Pricing Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the pricing snapshot captured when a Journey
// Booking was created.
//
// Pricing is booking-owned historical data. It must not be recalculated from
// the current Journey pricing configuration after the booking exists.
//
// The backend JourneyBooking aggregate remains authoritative for all monetary
// calculations and pricing invariants.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

/**
 * Pricing information captured for a Journey Booking.
 *
 * Monetary values are represented as integers in the API model, following the
 * SisiMove monetary convention of using the smallest currency unit (for
 * example, KES cents) rather than floating-point currency values.
 */
export interface JourneyBookingPricing {
  /**
   * Public identity of the pricing snapshot.
   */
  publicId: string;

  /**
   * Price charged per seat at booking time.
   */
  pricePerSeat: number;

  /**
   * Number of seats booked.
   */
  seats: number;

  /**
   * Seat price multiplied by booked seats.
   */
  subtotal: number;

  /**
   * Discount applied to the booking.
   *
   * Zero when no discount applies.
   */
  discountAmount: number;

  /**
   * Additional pricing adjustment.
   *
   * Positive values increase the amount.
   * Negative values decrease the amount.
   */
  adjustmentAmount: number;

  /**
   * Final amount payable for the booking.
   */
  totalAmount: number;

  /**
   * ISO 4217 currency code.
   *
   * SisiMove currently operates with KES, but the model intentionally
   * represents the API contract rather than hard-coding the currency here.
   */
  currency: string;

  /**
   * Pricing snapshot creation timestamp.
   */
  createdAt: string;

  /**
   * Pricing snapshot last modification timestamp.
   */
  updatedAt: string;
}