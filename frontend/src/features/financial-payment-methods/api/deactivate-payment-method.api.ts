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
// - ownership validation;
// - aggregate loading;
// - deactivation rules;
// - default-payment-method rules;
// - persistence;
// - authorization.
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
 * `paymentMethodPublicId` is kept outside this object because it belongs in
 * the URL path.
 */
export interface DeactivatePaymentMethodRequest {
  /**
   * Correlation identifier for tracing the operation.
   */
  correlationId: string;

  /**
   * Optional causation identifier for tracing the operation that caused this
   * command.
   */
  causationId?: string;

  /**
   * Optional explicit timestamp for when the payment method was deactivated.
   *
   * The backend converts this transport value into a Date.
   */
  deactivatedAt?: string;
}

// -----------------------------------------------------------------------------
// API Operation
// -----------------------------------------------------------------------------

/**
 * Deactivates the specified payment method.
 *
 * @param paymentMethodPublicId
 * Opaque public identifier of the payment method.
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

