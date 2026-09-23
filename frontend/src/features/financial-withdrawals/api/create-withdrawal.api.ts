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
// - The caller supplies the member's financial account public ID separately.
// - The request body maps frontend `accountPublicId` to the backend DTO's
//   `accountId` field because the existing backend contract uses that name.
// - The request is validated against the frontend schema before posting.
// - Frontend validation provides immediate feedback and protects the API
//   boundary from obviously malformed input.
// - The backend remains authoritative for authorization, account ownership,
//   balance availability, withdrawal limits, destination validation, and all
//   financial invariants.
// - Lifecycle operations such as process, complete, fail, and cancel are not
//   exposed through this member-facing API.
// - Monetary amounts remain integer minor-unit strings during transport.
//
// =============================================================================

import { authenticatedApiClient } from '@/features/authentication';

import type {
  CreateWithdrawalRequest,
  FinancialWithdrawal,
} from '../models';

import {
  createWithdrawalSchema,
} from '../schemas';

import {
  mapFinancialWithdrawal,
  type FinancialWithdrawalApiResponse,
} from '../mappers';

const FINANCIAL_WITHDRAWALS_PATH = '/financial-account-withdrawals';

/**
 * Creates a financial withdrawal for the specified financial account.
 *
 * The request is validated locally before the HTTP request is made.
 *
 * Backend validation remains authoritative.
 *
 * @param accountPublicId Public identifier of the member's financial account.
 * @param request Withdrawal creation request.
 */
export async function createWithdrawal(
  accountPublicId: string,
  request: CreateWithdrawalRequest,
): Promise<FinancialWithdrawal> {
  const validatedRequest = createWithdrawalSchema.parse(request);

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
    );

  return mapFinancialWithdrawal(response);
}

