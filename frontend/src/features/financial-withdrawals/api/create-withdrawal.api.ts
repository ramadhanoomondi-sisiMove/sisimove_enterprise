
// =============================================================================
// sisiMove — Create Financial Withdrawal API
// =============================================================================
//
// Transport function for creating a FinancialAccountWithdrawal.
//
// Backend endpoint:
//
//     POST /financial-account-withdrawals
//
// Important boundaries:
//
// - The caller supplies the financial account public ID separately.
// - Frontend accountPublicId maps to backend DTO accountId.
// - Request validation occurs before transport.
// - The backend remains authoritative for all financial invariants.
// - Monetary amounts remain integer minor-unit strings during transport.
// - Every new withdrawal intent receives a unique idempotency key.
// - Retries of the same withdrawal must reuse the original key.
// - Lifecycle operations are not exposed through this member-facing API.
//
// =============================================================================

import { authenticatedApiClient } from '@/features/authentication';

import type {
  CreateWithdrawalRequest,
  FinancialWithdrawal,
} from '../models';

import { createWithdrawalSchema } from '../schemas';

import {
  mapFinancialWithdrawal,
  type FinancialWithdrawalApiResponse,
} from '../mappers';

const FINANCIAL_WITHDRAWALS_PATH =
  '/financial-account-withdrawals';

/**
 * Creates a financial withdrawal.
 *
 * The idempotency key must be generated once for each new withdrawal
 * intent and reused if that same request is retried.
 */
export async function createWithdrawal(
  accountPublicId: string,
  request: CreateWithdrawalRequest,
  idempotencyKey: string,
): Promise<FinancialWithdrawal> {
  const validatedRequest = createWithdrawalSchema.parse(request);

  if (
    !idempotencyKey ||
    idempotencyKey.length > 128
  ) {
    throw new Error(
      'A valid withdrawal idempotency key is required.',
    );
  }

  const response =
    await authenticatedApiClient.post<FinancialWithdrawalApiResponse>(
      FINANCIAL_WITHDRAWALS_PATH,
      {
        accountId: accountPublicId,
        amount: validatedRequest.amount,
        currency: validatedRequest.currency,
        destinationType: validatedRequest.destinationType,
        destinationValue: validatedRequest.destinationValue,
        referenceType: validatedRequest.referenceType,
        referencePublicId: validatedRequest.referencePublicId,
        correlationId: validatedRequest.correlationId,
        causationId: validatedRequest.causationId,
      },
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      },
    );

  return mapFinancialWithdrawal(response);
}
