// =============================================================================
// sisiMove — Get Financial Payment Method API
// =============================================================================
//
// Authenticated HTTP operation for retrieving a FinancialPaymentMethod by its
// public identifier.
//
// Backend route:
//
//     GET /financial-payment-methods/:paymentMethodPublicId
//
// Backend authorization:
//
//     JwtAuthGuard
//     PermissionsGuard
//     admin:read
//
// IMPORTANT:
// This is an administrative lookup, not the member-facing payment-method
// retrieval endpoint.
//
// Members should retrieve their own payment methods through:
//
//     GET /financial-payment-methods/me
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
// Get Financial Payment Method
// -----------------------------------------------------------------------------

/**
 * Retrieves a FinancialPaymentMethod by its public identifier.
 *
 * Administrative permission is required by the backend.
 *
 * @param paymentMethodPublicId
 * API-safe public identifier of the payment method.
 *
 * @returns
 * The mapped FinancialPaymentMethod, or null when not found.
 */
export async function getPaymentMethod(
  paymentMethodPublicId: string,
): Promise<FinancialPaymentMethod | null> {
  const response =
    await authenticatedApiClient.get<
      FinancialPaymentMethodApiResponse | null
    >(
      `${FINANCIAL_PAYMENT_METHODS_PATH}/${encodeURIComponent(
        paymentMethodPublicId,
      )}`,
    );

  if (response === null) {
    return null;
  }

  return mapFinancialPaymentMethod(response);
}