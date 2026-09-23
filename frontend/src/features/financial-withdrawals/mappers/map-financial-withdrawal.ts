// =============================================================================
// sisiMove — Financial Withdrawal Mapper
// =============================================================================
//
// Maps the backend FinancialAccountWithdrawal response into the frontend
// FinancialWithdrawal model.
//
// Important boundaries:
//
// - The mapper is the API-to-frontend contract boundary.
// - Backend persistence IDs such as `id` and `accountId` are not exposed.
// - Nullable backend fields are converted to omitted optional frontend
//   properties.
// - Monetary `amount` remains an integer minor-unit number.
// - Destination data is mapped exactly as returned by the backend.
//   Any privacy-safe masking required for presentation belongs in the
//   frontend view-model mapping layer or must already be enforced by the
//   backend response contract.
// - No domain logic or financial calculations belong here.
//
// =============================================================================

import type { FinancialWithdrawal } from '../models';
import type {
  FinancialWithdrawalStatus,
  WithdrawalDestinationType,
} from '../models';

/**
 * Backend response contract consumed by this mapper.
 *
 * This is intentionally an explicit transport type rather than a Prisma type.
 */
export interface FinancialWithdrawalApiResponse {
  readonly publicId: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: FinancialWithdrawalStatus;
  readonly destinationType: WithdrawalDestinationType;
  readonly destinationValue: string;
  readonly referenceType?: string | null;
  readonly referencePublicId?: string | null;
  readonly disbursementPublicId?: string | null;
  readonly transactionPublicId?: string | null;
  readonly requestedAt: string;
  readonly completedAt?: string | null;
  readonly failedAt?: string | null;
  readonly cancelledAt?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Maps a backend financial withdrawal response to the frontend model.
 */
export function mapFinancialWithdrawal(
  response: FinancialWithdrawalApiResponse,
): FinancialWithdrawal {
  return {
    publicId: response.publicId,
    amount: response.amount,
    currency: response.currency,
    status: response.status,
    destinationType: response.destinationType,
    destinationValue: response.destinationValue,

    ...(response.referenceType != null && {
      referenceType: response.referenceType,
    }),

    ...(response.referencePublicId != null && {
      referencePublicId: response.referencePublicId,
    }),

    ...(response.disbursementPublicId != null && {
      disbursementPublicId: response.disbursementPublicId,
    }),

    ...(response.transactionPublicId != null && {
      transactionPublicId: response.transactionPublicId,
    }),

    requestedAt: response.requestedAt,

    ...(response.completedAt != null && {
      completedAt: response.completedAt,
    }),

    ...(response.failedAt != null && {
      failedAt: response.failedAt,
    }),

    ...(response.cancelledAt != null && {
      cancelledAt: response.cancelledAt,
    }),

    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

