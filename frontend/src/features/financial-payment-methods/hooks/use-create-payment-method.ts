// =============================================================================
// sisiMove — Use Create Financial Payment Method
// =============================================================================
//
// React Query mutation hook for creating a FinancialPaymentMethod.
//
// Responsibilities:
// - coordinate the create-payment-method mutation;
// - expose mutation state to React components;
// - delegate HTTP communication to createPaymentMethod().
//
// This hook does NOT:
// - perform HTTP requests directly;
// - validate raw form input;
// - determine account ownership;
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
 * The Financial Account public identifier is kept separate from the request
 * body because it identifies the resource against which the operation is
 * performed.
 */
export interface CreatePaymentMethodMutationVariables {
  /**
   * API-safe public identifier of the Financial Account.
   */
  accountPublicId: string;

  /**
   * Validated payment-method creation data.
   */
  request: CreatePaymentMethodFormValues;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Creates a FinancialPaymentMethod.
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

