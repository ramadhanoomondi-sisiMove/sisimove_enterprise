// =============================================================================
// sisiMove — Get Default Financial Payment Method API
// =============================================================================
//
// Authenticated HTTP operation for retrieving the default Financial Payment
// Method belonging to the currently authenticated member.
//
// Backend route:
//
//     GET /financial-payment-methods/me
//
// Backend authorization:
//
//     JwtAuthGuard
//     PermissionsGuard
//
// Ownership:
//
// - The backend resolves the authenticated Identity.
// - The backend resolves the Identity's Financial Account.
// - Only payment methods belonging to that account are returned.
// - The frontend does not supply an account identifier.
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

const MY_FINANCIAL_PAYMENT_METHODS_PATH =
  '/financial-payment-methods/me';

// -----------------------------------------------------------------------------
// Get Default Payment Method
// -----------------------------------------------------------------------------

/**
 * Retrieves the active default payment method belonging to the
 * authenticated member.
 *
 * @returns
 * The mapped default FinancialPaymentMethod, or null when the member
 * has no active default payment method.
 */
export async function getDefaultPaymentMethod(): Promise<
  FinancialPaymentMethod | null
> {
  const response = await authenticatedApiClient.get<
    FinancialPaymentMethodApiResponse[]
  >(MY_FINANCIAL_PAYMENT_METHODS_PATH);

  const defaultMethod = response
    .map(mapFinancialPaymentMethod)
    .find((method) => method.isDefault && method.isActive);

  return defaultMethod ?? null;
}