// =============================================================================
// sisiMove — Financial Payment Query Hook
// =============================================================================
//
// React Query hook for retrieving a FinancialPayment by its public identifier.
//
// Responsibilities:
//
// - expose the payment read operation to React components;
// - manage loading, error, caching, and refetch state;
// - delegate HTTP communication and response mapping to getPayment().
//
// Non-responsibilities:
//
// - payment lifecycle transitions;
// - provider execution;
// - wallet balance mutation;
// - ownership or authorization decisions;
// - C2B PayBill reference generation or modification.
//
// Authorization remains enforced by the backend.
//
// The returned FinancialPayment model may include `c2bReference` for C2B
// payments. The backend owns that value; getPayment() maps it from the API
// response. This hook simply exposes the mapped payment data to components.
//
// =============================================================================

import { useQuery } from '@tanstack/react-query';

import { getPayment } from '../api';
import type { FinancialPayment } from '../models';

// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

export const FINANCIAL_PAYMENT_QUERY_KEY = (
  paymentPublicId: string,
) =>
  [
    'financial-payments',
    paymentPublicId,
  ] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useFinancialPayment(
  paymentPublicId: string | undefined,
) {
  return useQuery<FinancialPayment, Error>({
    queryKey:
      paymentPublicId !== undefined
        ? FINANCIAL_PAYMENT_QUERY_KEY(paymentPublicId)
        : ['financial-payments', 'undefined'],

    queryFn: async (): Promise<FinancialPayment> => {
      if (paymentPublicId === undefined) {
        throw new Error(
          'Payment public ID is required to retrieve a financial payment.',
        );
      }

      return getPayment(paymentPublicId);
    },

    enabled:
      paymentPublicId !== undefined &&
      paymentPublicId.trim().length > 0,
  });
}
