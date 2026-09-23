// =============================================================================
// sisiMove — Set Default Financial Payment Method API
// =============================================================================
//
// Authenticated HTTP operation for making an existing FinancialPaymentMethod
// the member's default payment method.
//
// Backend route:
//
//     POST /financial-payment-methods/:paymentMethodPublicId/default
//
// Backend authorization:
//
//     JwtAuthGuard
//     PermissionsGuard
//     financial-payment-method:set-default
//
// -----------------------------------------------------------------------------
//
// Backend command:
//
//     SetDefaultFinancialPaymentMethodCommand
//     ├── paymentMethodPublicId
//     ├── correlationId
//     ├── causationId?
//     └── defaultedAt?
//
// The backend remains responsible for:
// - ownership validation;
// - aggregate loading;
// - default-state rules;
// - persistence;
// - concurrency;
// - authorization.
//
// The frontend only transports the command's API-safe values.
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
 * Request data required to make a payment method the default.
 *
 * `paymentMethodPublicId` is deliberately kept outside this request object
 * because it belongs in the URL path.
 */
export interface SetDefaultPaymentMethodRequest {
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
   * Optional explicit timestamp for when the payment method became default.
   *
   * The backend converts this transport value into a Date.
   */
  defaultedAt?: string;
}

// -----------------------------------------------------------------------------
// API Operation
// -----------------------------------------------------------------------------

/**
 * Sets the specified payment method as the default payment method.
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
export async function setDefaultPaymentMethod(
  paymentMethodPublicId: string,
  request: SetDefaultPaymentMethodRequest,
): Promise<FinancialPaymentMethod> {
  const response =
    await authenticatedApiClient.post<FinancialPaymentMethodApiResponse>(
      `${FINANCIAL_PAYMENT_METHODS_PATH}/${encodeURIComponent(
        paymentMethodPublicId,
      )}/default`,
      {
        correlationId: request.correlationId,

        ...(request.causationId !== undefined && {
          causationId: request.causationId,
        }),

        ...(request.defaultedAt !== undefined && {
          defaultedAt: request.defaultedAt,
        }),
      },
    );

  return mapFinancialPaymentMethod(response);
}

