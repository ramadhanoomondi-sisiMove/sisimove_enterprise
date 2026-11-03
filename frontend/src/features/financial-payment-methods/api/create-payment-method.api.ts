
// =============================================================================
// sisiMove — Create Financial Payment Method API
// =============================================================================
//
// Authenticated HTTP operation for adding a FinancialPaymentMethod to a
// Financial Account.
//
// Backend route:
//
//     POST /financial-payment-methods
//
// =============================================================================

import { authenticatedApiClient } from '@/features/authentication';

import type { FinancialPaymentMethod } from '../models';

import type { CreatePaymentMethodFormValues } from '../schemas';

import {
  mapFinancialPaymentMethod,
  type FinancialPaymentMethodApiResponse,
} from '../mappers';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_PAYMENT_METHODS_PATH = '/financial-payment-methods';

// -----------------------------------------------------------------------------
// Create Payment Method
// -----------------------------------------------------------------------------

/**
 * Creates a FinancialPaymentMethod for the specified financial account.
 *
 * @param accountPublicId
 * Opaque public identifier of the financial account.
 *
 * @param request
 * Validated member-facing payment-method creation data.
 *
 * @returns
 * The newly created and mapped FinancialPaymentMethod.
 */
export async function createPaymentMethod(
  accountPublicId: string,
  request: CreatePaymentMethodFormValues,
): Promise<FinancialPaymentMethod> {
  const response =
    await authenticatedApiClient.post<FinancialPaymentMethodApiResponse>(
      FINANCIAL_PAYMENT_METHODS_PATH,
      {
        // ---------------------------------------------------------------------
        // Financial Account
        // ---------------------------------------------------------------------

        accountId: accountPublicId,

        // ---------------------------------------------------------------------
        // Payment Method
        // ---------------------------------------------------------------------

        type: request.type,
        provider: request.provider,
        phoneNumber: request.phoneNumber,

        // ---------------------------------------------------------------------
        // Correlation
        // ---------------------------------------------------------------------

        correlationId: request.correlationId,

        // ---------------------------------------------------------------------
        // Optional Provider Reference
        // ---------------------------------------------------------------------

        ...(request.providerReference !== undefined && {
          providerReference: request.providerReference,
        }),

        // ---------------------------------------------------------------------
        // Optional Display Metadata
        // ---------------------------------------------------------------------

        ...(request.displayName !== undefined && {
          displayName: request.displayName,
        }),

        ...(request.lastFour !== undefined && {
          lastFour: request.lastFour,
        }),

        // ---------------------------------------------------------------------
        // Default
        // ---------------------------------------------------------------------

        isDefault: request.isDefault,

        // ---------------------------------------------------------------------
        // Optional Causation
        // ---------------------------------------------------------------------

        ...(request.causationId !== undefined && {
          causationId: request.causationId,
        }),
      },
    );

  return mapFinancialPaymentMethod(response);
}
