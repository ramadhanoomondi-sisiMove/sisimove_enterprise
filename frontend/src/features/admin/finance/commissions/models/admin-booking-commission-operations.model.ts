// -----------------------------------------------------------------------------
// Admin Booking Commission — Operations Model
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Create
// -----------------------------------------------------------------------------

/**
 * Payload for creating a booking commission.
 */
export interface AdminCreateBookingCommissionModel {
  readonly commissionRulePublicId: string;

  readonly bookingPublicId: string;

  readonly journeyPublicId: string;

  readonly percentage: string;

  readonly baseAmount: number;

  readonly commissionAmount: number;

  readonly currency: string;

  readonly correlationId?: string;

  readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Assess
// -----------------------------------------------------------------------------

/**
 * Payload for assessing a booking commission.
 */
export interface AdminAssessBookingCommissionModel {
  readonly assessedAt: string;

  readonly correlationId?: string;

  readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Cancel
// -----------------------------------------------------------------------------

/**
 * Payload for cancelling a booking commission.
 */
export interface AdminCancelBookingCommissionModel {
  readonly cancelledAt: string;

  readonly correlationId?: string;

  readonly causationId?: string;
}