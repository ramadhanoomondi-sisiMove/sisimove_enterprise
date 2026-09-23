// =============================================================================
// sisiMove — Create Financial Payment API
// =============================================================================
//
// Authenticated HTTP operation for creating a FinancialPayment.
//
// Backend route:
//
//     POST /financial-payments
//
// Backend transport contract:
//
//     {
//       accountId: string;
//       amount: string;
//       currency: string;
//       correlationId: string;
//       methodId?: string;
//       referenceType?: string;
//       referencePublicId?: string;
//       causationId?: string;
//     }
//
// Frontend request model:
//
//     CreatePaymentRequest
//
// The frontend model deliberately uses:
//
//     methodPublicId
//
// while the backend DTO uses:
//
//     methodId
//
// The API adapter performs that transport mapping.
//
// -----------------------------------------------------------------------------
//
// Ownership:
//
// The FinancialPayment backend requires accountId because a payment belongs
// to a FinancialAccount.
//
// The authenticated member-facing flow must first resolve the current
// member's FinancialAccount through the authenticated Financial Account
// boundary:
//
//     GET /financial-accounts/me
//
// The resolved account public ID is then supplied to this API adapter.
//
// The payment request itself does not contain account ownership data.
//
// -----------------------------------------------------------------------------
//
// Architectural boundary:
//
// - HTTP transport belongs here.
// - Transport field mapping belongs here.
// - Authentication is handled by authenticatedApiClient.
// - Account ownership is resolved by the authenticated account boundary.
// - Payment business rules remain in the backend application/domain layers.
// - Payment provider execution remains outside this API adapter.
// - Financial transaction creation remains a separate backend concern.
//
// This function must remain a thin HTTP boundary.
//
// =============================================================================

import { authenticatedApiClient } from '@/features/authentication';

import type { CreatePaymentRequest, FinancialPayment } from '../models';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_PAYMENTS_PATH = '/financial-payments';

// -----------------------------------------------------------------------------
// Create Payment
// -----------------------------------------------------------------------------

/**
 * Creates a FinancialPayment for the authenticated member's financial
 * account.
 *
 * @param accountPublicId
 * Public identifier of the authenticated member's FinancialAccount.
 *
 * This value should come from the authenticated Financial Account boundary,
 * not from arbitrary user input.
 *
 * @param request
 * Member-facing payment creation request.
 *
 * @returns
 * The newly created FinancialPayment API representation.
 */
export async function createPayment(
  accountPublicId: string,
  request: CreatePaymentRequest,
): Promise<FinancialPayment> {
  return authenticatedApiClient.post<FinancialPayment>(
    FINANCIAL_PAYMENTS_PATH,
    {
      // -----------------------------------------------------------------------
      // Financial Account
      // -----------------------------------------------------------------------
      //
      // The backend CreateFinancialPaymentDto requires `accountId`.
      //
      // This is the public account identifier resolved from the authenticated
      // member's own financial account.
      //
      accountId: accountPublicId,

      // -----------------------------------------------------------------------
      // Payment Amount
      // -----------------------------------------------------------------------
      //
      // Monetary amounts remain strings at the HTTP boundary.
      //
      // Example:
      //
      //     "125000" = KES 1,250.00
      //
      amount: request.amount,

      // -----------------------------------------------------------------------
      // Currency
      // -----------------------------------------------------------------------

      currency: request.currency,

      // -----------------------------------------------------------------------
      // Correlation
      // -----------------------------------------------------------------------

      correlationId: request.correlationId,

      // -----------------------------------------------------------------------
      // Payment Method
      // -----------------------------------------------------------------------
      //
      // Frontend:
      //
      //     methodPublicId
      //
      // Backend DTO:
      //
      //     methodId
      //
      // The value itself remains the API-safe public identifier.
      //
      ...(request.methodPublicId !== undefined
        ? {
            methodId: request.methodPublicId,
          }
        : {}),

      // -----------------------------------------------------------------------
      // Business Reference
      // -----------------------------------------------------------------------

      ...(request.referenceType !== undefined
        ? {
            referenceType: request.referenceType,
          }
        : {}),

      ...(request.referencePublicId !== undefined
        ? {
            referencePublicId: request.referencePublicId,
          }
        : {}),

      // -----------------------------------------------------------------------
      // Causation
      // -----------------------------------------------------------------------

      ...(request.causationId !== undefined
        ? {
            causationId: request.causationId,
          }
        : {}),
    },
  );
}
