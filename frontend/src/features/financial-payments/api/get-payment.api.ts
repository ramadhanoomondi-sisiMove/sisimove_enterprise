// =============================================================================
// sisiMove — Get Financial Payment API
// =============================================================================
//
// Authenticated HTTP operation for retrieving a FinancialPayment by its
// public identifier.
//
// Backend route:
//
//     GET /financial-payments/:paymentPublicId
//
// The backend response may include `c2bReference` for C2B payments.
// This API operation does not generate or modify that reference. It delegates
// response translation to mapFinancialPayment(), which maps the backend value
// into the frontend FinancialPayment model.
//
// -----------------------------------------------------------------------------
//
// Ownership & authorization:
//
// The backend controller protects this operation with:
//
//     JwtAuthGuard
//     PermissionsGuard
//
// The frontend supplies only the payment public identifier.
//
// It does not:
//
//     - supply an Identity ID;
//     - supply an account database ID;
//     - query persistence directly;
//     - perform ownership checks locally;
//     - infer payment ownership from client state.
//
// Authorization remains a backend responsibility.
//
// -----------------------------------------------------------------------------
//
// Architectural boundary:
//
// - HTTP transport belongs here.
// - Authentication is handled by authenticatedApiClient.
// - Payment ownership/authorization belongs to the backend.
// - Response translation belongs to mapFinancialPayment().
// - Payment lifecycle rules remain in the backend.
//
// =============================================================================

import { authenticatedApiClient } from '@/features/authentication';

import type { FinancialPayment } from '../models';
import {
  mapFinancialPayment,
  type FinancialPaymentApiResponse,
} from '../mappers';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_PAYMENTS_PATH = '/financial-payments';

// -----------------------------------------------------------------------------
// Get Payment
// -----------------------------------------------------------------------------

/**
 * Retrieves a FinancialPayment by its public identifier.
 *
 * @param paymentPublicId
 * API-safe public identifier of the payment.
 *
 * @returns
 * The mapped frontend FinancialPayment model.
 *
 * For C2B payments, the mapped model includes the backend-generated
 * PayBill reference when the API response contains one.
 */
export async function getPayment(
  paymentPublicId: string,
): Promise<FinancialPayment> {
  const response =
    await authenticatedApiClient.get<FinancialPaymentApiResponse>(
      `${FINANCIAL_PAYMENTS_PATH}/${encodeURIComponent(paymentPublicId)}`,
    );

  return mapFinancialPayment(response);
}
