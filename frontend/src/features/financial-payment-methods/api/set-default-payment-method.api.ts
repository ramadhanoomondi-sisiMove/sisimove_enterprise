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
// The frontend transports the command's API-safe values only.
//
// The backend is responsible for:
// - loading the payment method;
// - verifying account ownership;
// - ensuring the payment method is active;
// - enforcing default-state rules;
// - ensuring only one active default per account;
// - persistence;
// - concurrency;
// - authorization.
//
// The frontend does not implement payment-method lifecycle rules.
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
 * paymentMethodPublicId belongs in the URL path and is deliberately kept
 * outside this request object.
 */
export interface SetDefaultPaymentMethodRequest {
  /**
   * Correlation identifier for tracing the operation.
   */
  correlationId: string;

  /**
   * Optional causation identifier.
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
 * Public identifier of the payment method.
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