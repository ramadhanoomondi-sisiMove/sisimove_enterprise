
// =============================================================================
// sisiMove — Create Financial Payment Hook
// =============================================================================
//
// React Query mutation hook for initiating a FinancialPayment.
//
// Responsibilities:
//
// - expose the create-payment operation to React components;
// - manage mutation loading/error/success state;
// - delegate HTTP communication to createPayment().
//
// Non-responsibilities:
//
// - payment business rules;
// - payment lifecycle transitions;
// - provider execution;
// - wallet balance mutation;
// - account ownership resolution.
//
// The authenticated FinancialAccount public ID is supplied by the caller after
// it has been resolved through the authenticated Financial Account boundary.
//
// =============================================================================

import { useMutation } from '@tanstack/react-query';

import { createPayment } from '../api';

import type {
  CreatePaymentRequest,
  FinancialPayment,
} from '../models';

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

export interface CreatePaymentVariables {
  /**
   * Public identifier of the authenticated member's FinancialAccount.
   *
   * This should come from the authenticated account query and must not be
   * collected as arbitrary member input.
   */
  accountPublicId: string;

  /**
   * Member-facing payment creation request.
   *
   * The request includes:
   *
   * - channel: STK_PUSH or C2B;
   * - amount: whole KES string;
   * - currency;
   * - correlationId;
   * - methodPublicId when using STK_PUSH.
   */
  request: CreatePaymentRequest;
}

// -----------------------------------------------------------------------------
// Mutation Key
// -----------------------------------------------------------------------------

export const CREATE_FINANCIAL_PAYMENT_MUTATION_KEY = [
  'financial-payments',
  'create',
] as const;

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useCreatePayment() {
  return useMutation<
    FinancialPayment,
    Error,
    CreatePaymentVariables
  >({
    mutationKey: CREATE_FINANCIAL_PAYMENT_MUTATION_KEY,

    mutationFn: ({
      accountPublicId,
      request,
    }): Promise<FinancialPayment> => {
      return createPayment(accountPublicId, request);
    },
  });
}
