
// =============================================================================
// sisiMove — Reconcile C2B Payment Hook
// =============================================================================
//
// React Query mutation hook for requesting reconciliation of an existing
// C2B FinancialPayment.
//
// Responsibilities:
//
// - expose the C2B reconciliation operation to React components;
// - manage mutation loading, error, and success state;
// - delegate HTTP communication to reconcileC2BPayment().
//
// Non-responsibilities:
//
// - creating FinancialPayments;
// - initiating STK Push;
// - treating customer confirmation as proof of payment;
// - verifying Safaricom callbacks;
// - transitioning payment lifecycle status;
// - mutating wallet balances;
// - generating or modifying C2B references.
//
// The payment-specific C2B reference must come from an existing
// FinancialPayment returned by the backend.
//
// The backend owns callback verification, payment matching, deduplication,
// reconciliation, and all payment lifecycle transitions.
//
// =============================================================================

import { useMutation } from '@tanstack/react-query';

import { reconcileC2BPayment } from '../api';

import type {
  ReconcileC2BPaymentRequest,
  ReconcileC2BPaymentResult,
} from '../models';

// -----------------------------------------------------------------------------
// Mutation Key
// -----------------------------------------------------------------------------

export const RECONCILE_C2B_PAYMENT_MUTATION_KEY = [
  'financial-payments',
  'reconcile-c2b',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useReconcileC2BPayment() {
  return useMutation<
    ReconcileC2BPaymentResult,
    Error,
    ReconcileC2BPaymentRequest
  >({
    mutationKey: RECONCILE_C2B_PAYMENT_MUTATION_KEY,

    mutationFn: (
      request: ReconcileC2BPaymentRequest,
    ): Promise<ReconcileC2BPaymentResult> => {
      return reconcileC2BPayment(request);
    },
  });
}
