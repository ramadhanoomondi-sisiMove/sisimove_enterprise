// -----------------------------------------------------------------------------
// Admin Earning Commission — Operations Model
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Create
// -----------------------------------------------------------------------------

/**
 * Payload for creating an earning commission.
 *
 * netAmount is supplied explicitly and remains a separate financial value.
 * It must not be recalculated by the frontend.
 */
export interface AdminCreateEarningCommissionModel {
  readonly commissionRulePublicId: string;

  readonly journeyPublicId: string;

  readonly settlementPublicId: string;

  readonly providerPublicId: string;

  readonly percentage: string;

  readonly baseAmount: number;

  readonly commissionAmount: number;

  readonly netAmount: number;

  readonly currency: string;

  readonly correlationId?: string;

  readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Assess
// -----------------------------------------------------------------------------

/**
 * Payload for assessing an earning commission.
 */
export interface AdminAssessEarningCommissionModel {
  readonly assessedAt: string;

  readonly correlationId?: string;

  readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Cancel
// -----------------------------------------------------------------------------

/**
 * Payload for cancelling an earning commission.
 */
export interface AdminCancelEarningCommissionModel {
  readonly cancelledAt: string;

  readonly correlationId?: string;

  readonly causationId?: string;
}