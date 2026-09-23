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
// Backend authorization:
//
//     JwtAuthGuard
//     PermissionsGuard
//     financial-payment-method:create
//
// -----------------------------------------------------------------------------
//
// Architectural boundary:
//
//     Frontend
//        │
//        │ accountPublicId + validated request
//        ▼
//     createPaymentMethod()
//        │
//        │ accountPublicId -> accountId
//        ▼
//     Backend AddFinancialPaymentMethodDto
//        │
//        ▼
//     AddFinancialPaymentMethodCommand
//
// The frontend supplies the Financial Account public identifier separately.
// The backend DTO calls this field `accountId`, but it contains the opaque
// public identifier rather than a database ID.
//
// This operation does NOT:
// - access persistence;
// - execute provider operations;
// - modify account balances;
// - create financial transactions;
// - determine ownership;
// - implement payment-method business rules.
//
// Those responsibilities remain on the backend.
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
        //
        // The backend DTO names this property `accountId`, while the value is
        // the API-safe Financial Account public identifier.
        //
        accountId: accountPublicId,

        // ---------------------------------------------------------------------
        // Payment Method
        // ---------------------------------------------------------------------

        type: request.type,
        provider: request.provider,

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
