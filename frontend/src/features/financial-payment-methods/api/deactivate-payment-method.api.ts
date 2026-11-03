// =============================================================================
// sisiMove — Deactivate Financial Payment Method API
// =============================================================================
//
// Authenticated HTTP operation for deactivating an existing
// FinancialPaymentMethod.
//
// Backend route:
//
//     POST /financial-payment-methods/:paymentMethodPublicId/deactivate
//
// Backend authorization:
//
//     JwtAuthGuard
//     PermissionsGuard
//     financial-payment-method:deactivate
//
// -----------------------------------------------------------------------------
//
// Backend command:
//
//     DeactivateFinancialPaymentMethodCommand
//     ├── paymentMethodPublicId
//     ├── correlationId
//     ├── causationId?
//     └── deactivatedAt?
//
// The frontend transports the command values only.
//
// The backend remains responsible for:
// - aggregate loading;
// - deactivation rules;
// - default-payment-method rules;
// - persistence;
// - authorization;
// - ownership enforcement, where implemented by the application workflow.
//
// This operation does NOT delete the payment method. It requests the backend
// to transition the payment method into its inactive state.
//
// =============================================================================

import { authenticatedApiClient } from '@/features/authentication';

import type { FinancialPaymentMethod } from '../models';

import {
  mapFinancialPaymentMethod,
  type FinancialPaymentMethodApiResponse,
} from '../mappers';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_PAYMENT_METHODS_PATH = '/financial-payment-methods';

// -----------------------------------------------------------------------------
// Request
// -----------------------------------------------------------------------------

/**
 * Request data required to deactivate a payment method.
 *
 * paymentMethodPublicId belongs in the URL path and is therefore kept
 * outside this request object.
 */
export interface DeactivatePaymentMethodRequest {
  /**
   * Correlation identifier for tracing the operation.
   */
  correlationId: string;

  /**
   * Optional causation identifier.
   */
  causationId?: string;

  /**
   * Optional explicit deactivation timestamp.
   *
   * The backend converts this transport value into a Date.
   */
  deactivatedAt?: string;
}

// -----------------------------------------------------------------------------
// API Operation
// -----------------------------------------------------------------------------

/**
 * Requests deactivation of the specified payment method.
 *
 * @param paymentMethodPublicId
 * Public identifier of the payment method.
 *
 * @param request
 * Command transport values.
 *
 * @returns
 * The updated FinancialPaymentMethod.
 */
export async function deactivatePaymentMethod(
  paymentMethodPublicId: string,
  request: DeactivatePaymentMethodRequest,
): Promise<FinancialPaymentMethod> {
  const response =
    await authenticatedApiClient.post<FinancialPaymentMethodApiResponse>(
      `${FINANCIAL_PAYMENT_METHODS_PATH}/${encodeURIComponent(
        paymentMethodPublicId,
      )}/deactivate`,
      {
        correlationId: request.correlationId,

        ...(request.causationId !== undefined && {
          causationId: request.causationId,
        }),

        ...(request.deactivatedAt !== undefined && {
          deactivatedAt: request.deactivatedAt,
        }),
      },
    );

  return mapFinancialPaymentMethod(response);
}