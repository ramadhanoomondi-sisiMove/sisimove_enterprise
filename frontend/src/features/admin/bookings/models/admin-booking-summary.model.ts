
/**
 * sisiMove — Admin Booking Summary
 *
 * Summary metrics displayed on the global admin bookings dashboard.
 *
 * This is a frontend presentation model, not a backend response contract.
 */
export interface AdminBookingSummary {
  /** Total bookings included in the summary scope. */
  totalBookings: number;

  /** Bookings awaiting confirmation. */
  pendingBookings: number;

  /** Confirmed bookings. */
  confirmedBookings: number;

  /** Cancelled bookings. */
  cancelledBookings: number;

  /** Completed bookings. */
  completedBookings: number;

  /** Expired bookings. */
  expiredBookings: number;
}

/**
 * Optional financial summary.
 *
 * Monetary values must use the currency supplied by the source data.
 * Do not combine amounts in different currencies.
 */
export interface AdminBookingFinancialSummary {
  currency: string;
  totalBookingValue: number;
  totalCapturedAmount: number;
  totalRefundedAmount: number;
}
