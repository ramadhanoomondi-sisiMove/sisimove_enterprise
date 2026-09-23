// =============================================================================
// sisiMove — Get Default Financial Payment Method API
// =============================================================================
//
// Authenticated HTTP operation for retrieving the default Financial Payment
// Method belonging to a Financial Account.
//
// Backend route:
//
//     GET /financial-payment-methods/accounts/:accountPublicId/default
//
// Backend authorization:
//
//     JwtAuthGuard
//     PermissionsGuard
//     financial-payment-method:read
//
// -----------------------------------------------------------------------------
//
// Architectural boundary:
//
// - HTTP communication belongs here.
// - Authentication is handled by authenticatedApiClient.
// - Authorization remains a backend responsibility.
// - Response translation belongs to mapFinancialPaymentMethod().
// - Payment-method ownership remains enforced by the backend.
//
// The frontend supplies the API-safe Financial Account public identifier.
//
// It does not:
//
//     - expose database account IDs;
//     - access persistence;
//     - determine which method is default;
//     - implement payment-method business rules;
//     - modify payment-method state.
//
// A member may have no default payment method. Therefore the backend `null`
// response is represented as `null` rather than inventing an empty model.
//
// =============================================================================

import { authenticatedApiClient } from '@/features/authentication';

import type { FinancialPaymentMethod } from '../models';

import {
  mapFinancialPaymentMethod,
  type FinancialPaymentMethodApiResponse,
} from '../mappers';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_PAYMENT_METHODS_PATH = '/financial-payment-methods';

// -----------------------------------------------------------------------------
// Get Default Payment Method
// -----------------------------------------------------------------------------

/**
 * Retrieves the default payment method belonging to a financial account.
 *
 * @param accountPublicId
 * API-safe public identifier of the financial account.
 *
 * @returns
 * The mapped default FinancialPaymentMethod, or `null` when the account has
 * no default payment method.
 */
export async function getDefaultPaymentMethod(
  accountPublicId: string,
): Promise<FinancialPaymentMethod | null> {
  const response =
    await authenticatedApiClient.get<FinancialPaymentMethodApiResponse | null>(
      `${FINANCIAL_PAYMENT_METHODS_PATH}/accounts/${encodeURIComponent(
        accountPublicId,
      )}/default`,
    );

  if (response === null) {
    return null;
  }

  return mapFinancialPaymentMethod(response);
}

