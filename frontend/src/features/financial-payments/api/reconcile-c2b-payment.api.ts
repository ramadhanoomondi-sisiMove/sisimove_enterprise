// =============================================================================
// sisiMove — Reconcile C2B Payment API
// =============================================================================
//
// Authenticated HTTP operation for checking whether an existing C2B
// FinancialPayment has a corresponding persisted M-PESA confirmation callback.
//
// Backend route:
//
//     POST /mpesa/c2b/reconcile
//
// Request contract:
//
//     {
//       reference: string;
//     }
//
// The reference is the payment-specific c2bReference returned by the backend
// when the FinancialPayment was created.
//
// This operation is a reconciliation trigger only. It is not proof of payment
// and does not create a FinancialPayment, initiate STK Push, or transition
// payment state in the frontend.
//
// The backend owns callback verification, payment matching, deduplication,
// reconciliation, and all payment lifecycle transitions.
//
// -----------------------------------------------------------------------------
//
// Architectural boundary:
//
// - HTTP transport belongs here.
// - Authentication is handled by authenticatedApiClient.
// - The payment reference is supplied from the existing FinancialPayment.
// - Reconciliation decisions and payment state transitions belong to backend.
// - This API returns the backend result without locally mutating payment state.
//
// =============================================================================

import { authenticatedApiClient } from '@/features/authentication';

import type {
  ReconcileC2BPaymentRequest,
  ReconcileC2BPaymentResult,
} from '../models';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const C2B_RECONCILIATION_PATH = '/mpesa/c2b/reconcile';

// -----------------------------------------------------------------------------
// Reconcile C2B Payment
// -----------------------------------------------------------------------------

/**
 * Requests reconciliation of an existing C2B FinancialPayment.
 *
 * @param request
 * Contains the payment-specific C2B reference returned by the backend.
 *
 * This must be the reference belonging to the existing payment. The frontend
 * must not generate, alter, or substitute this value.
 *
 * @returns
 * The backend reconciliation outcome. A result requiring reconciliation
 * means the payment has not been confirmed by a matching callback yet; the
 * frontend must continue displaying the payment's backend-provided status.
 */
export async function reconcileC2BPayment(
  request: ReconcileC2BPaymentRequest,
): Promise<ReconcileC2BPaymentResult> {
  return authenticatedApiClient.post<ReconcileC2BPaymentResult>(
    C2B_RECONCILIATION_PATH,
    {
      reference: request.reference,
    },
  );
}
