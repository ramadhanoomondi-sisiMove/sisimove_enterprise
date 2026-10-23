
/**
 * sisiMove — Admin Booking Metrics
 *
 * Frontend model for booking metrics displayed in the global
 * admin bookings section.
 *
 * This model defines the expected frontend shape only.
 * The actual metrics must be derived from verified backend data.
 */
export interface AdminBookingMetrics {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  expiredBookings: number;
}

/**
 * Financial metrics are kept separate from booking counts.
 * Monetary values must not be combined across currencies.
 */
export interface AdminBookingFinancialMetrics {
  currency: string;
  totalBookingValue: number;
  totalCapturedAmount: number;
  totalRefundedAmount: number;
}
