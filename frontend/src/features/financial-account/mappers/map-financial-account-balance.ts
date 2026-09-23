// =============================================================================
// sisiMove — Map Financial Account Balance
// =============================================================================
//
// Maps the Financial Account Balance API response into the frontend
// FinancialAccountBalance model.
//
// This mapper performs structural translation only.
//
// Monetary values remain integer minor units. No currency conversion,
// formatting, rounding, or arithmetic is performed here.
//
// =============================================================================

import type { FinancialAccountBalance } from '../models';

// =============================================================================
// API Response Type
// =============================================================================

/**
 * Backend response shape for FinancialAccountBalance.
 *
 * Financial amounts remain integer minor units.
 */
export interface FinancialAccountBalanceApiResponse {
  readonly publicId: string;
  readonly availableAmount: number;
  readonly pendingAmount: number;
  readonly heldAmount: number;
  readonly currency: string;
  readonly version: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// =============================================================================
// Mapper
// =============================================================================

/**
 * Map a backend FinancialAccountBalance response into the frontend model.
 */
export function mapFinancialAccountBalance(
  response: FinancialAccountBalanceApiResponse,
): FinancialAccountBalance {
  return {
    publicId: response.publicId,
    availableAmount: response.availableAmount,
    pendingAmount: response.pendingAmount,
    heldAmount: response.heldAmount,
    currency: response.currency,
    version: response.version,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}
