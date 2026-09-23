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
// - Payment-method lifecycle rules remain in the backend.
//
// The frontend supplies only the API-safe public identifier.
//
// It does not:
//
//     - expose the database `id`;
//     - provide account database IDs;
//     - perform persistence access;
//     - implement payment-method business rules;
//     - determine whether the method belongs to the current member.
//
// Ownership and authorization are enforced by the backend.
//
// The backend controller returns `null` when no payment method is found.
// The frontend therefore preserves that nullable contract.
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
// Get Payment Method
// -----------------------------------------------------------------------------

/**
 * Retrieves a FinancialPaymentMethod by its public identifier.
 *
 * @param paymentMethodPublicId
 * API-safe public identifier of the payment method.
 *
 * @returns
 * The mapped frontend FinancialPaymentMethod, or `null` when the backend
 * reports that the payment method does not exist.
 */
export async function getPaymentMethod(
  paymentMethodPublicId: string,
): Promise<FinancialPaymentMethod | null> {
  const response =
    await authenticatedApiClient.get<FinancialPaymentMethodApiResponse | null>(
      `${FINANCIAL_PAYMENT_METHODS_PATH}/${encodeURIComponent(
        paymentMethodPublicId,
      )}`,
    );

  if (response === null) {
    return null;
  }

  return mapFinancialPaymentMethod(response);
}

