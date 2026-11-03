// =============================================================================
// sisiMove — Get My Financial Payment Methods API
// =============================================================================
//
// Authenticated HTTP operation for retrieving all FinancialPaymentMethods
// belonging to the currently authenticated member.
//
// Backend route:
//
//     GET /financial-payment-methods/me
//
// Ownership resolution:
//
//     Authenticated Identity
//             │
//             ▼
//     Financial Account
//             │
//             ▼
//     Financial Payment Methods
//
// The backend resolves ownership from the authenticated identity.
//
// The frontend does NOT supply:
// - account database ID;
// - account public ID;
// - identity public ID.
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
// API Operation
// -----------------------------------------------------------------------------

/**
 * Retrieves all payment methods belonging to the authenticated member.
 *
 * @returns
 * Mapped payment methods. An empty array is returned when the member has
 * no registered payment methods.
 */
export async function getMyPaymentMethods(): Promise<
  FinancialPaymentMethod[]
> {
  const response = await authenticatedApiClient.get<
    FinancialPaymentMethodApiResponse[]
  >(MY_FINANCIAL_PAYMENT_METHODS_PATH);

  return response.map(mapFinancialPaymentMethod);
}