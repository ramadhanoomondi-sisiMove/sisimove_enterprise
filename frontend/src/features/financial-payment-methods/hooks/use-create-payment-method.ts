// =============================================================================
// sisiMove — Use Create Financial Payment Method
// =============================================================================
//
// React Query mutation hook for creating a FinancialPaymentMethod.
//
// Current supported payment method:
// - MOBILE_MONEY / MPESA
//
// Responsibilities:
// - coordinate the create-payment-method mutation;
// - expose mutation state to React components;
// - delegate HTTP communication to createPaymentMethod().
//
// This hook does NOT:
// - perform HTTP requests directly;
// - validate raw form input;
// - implement payment-method business rules;
// - modify the Financial Account directly.
//
// Validation belongs to:
//
//     schemas/create-payment-method.schema.ts
//
// HTTP communication belongs to:
//
//     api/create-payment-method.api.ts
//
// Backend authorization, ownership, and domain rules remain server-side.
//
// =============================================================================

import { useMutation } from '@tanstack/react-query';

import { createPaymentMethod } from '../api';

import type { FinancialPaymentMethod } from '../models';

import type { CreatePaymentMethodFormValues } from '../schemas';

// -----------------------------------------------------------------------------
// Mutation Variables
// -----------------------------------------------------------------------------

/**
 * Variables required to create a FinancialPaymentMethod.
 *
 * The Financial Account public identifier is supplied separately from the
 * payment-method request body.
 *
 * This matches the current backend AddFinancialPaymentMethodDto contract,
 * which still requires accountId.
 */
export interface CreatePaymentMethodMutationVariables {
  /**
   * API-safe public identifier of the Financial Account.
   *
   * This is not a database identifier.
   */
  accountPublicId: string;

  /**
   * Validated M-PESA payment-method creation data.
   */
  request: CreatePaymentMethodFormValues;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Creates an M-PESA FinancialPaymentMethod.
 *
 * @returns
 * React Query mutation for creating a payment method.
 */
export function useCreatePaymentMethod() {
  return useMutation<
    FinancialPaymentMethod,
    Error,
    CreatePaymentMethodMutationVariables
  >({
    mutationKey: ['financial-payment-methods', 'create'],

    mutationFn: ({ accountPublicId, request }) =>
      createPaymentMethod(accountPublicId, request),
  });
}