import type { AdminFinancialPaymentAttempt } from '../models/admin-financial-payment-attempt.model';
import type { AdminFinancialPaymentAttemptStatus } from '../models/admin-financial-payment.enums';

/**
 * API response contract for a financial payment attempt.
 *
 * Keep this aligned with FinancialPaymentResponseMapper on the backend.
 */
export interface AdminFinancialPaymentAttemptResponse {
  publicId: string;
  status: AdminFinancialPaymentAttemptStatus;
  provider: string;
  providerReference?: string | null;
  amount: number;
  currency: string;
  failureCode?: string | null;
  failureMessage?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  cancelledAt?: string | null;
  expiredAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Maps a payment attempt API response to the frontend model.
 *
 * This is intentionally a direct mapping:
 * - IDs remain public identifiers.
 * - Optional nullable values are preserved.
 * - Timestamps remain in the API's string representation.
 * - No provider or payment aggregate is fetched.
 */
export function mapAdminFinancialPaymentAttempt(
  response: AdminFinancialPaymentAttemptResponse,
): AdminFinancialPaymentAttempt {
  return {
    publicId: response.publicId,
    status: response.status,
    provider: response.provider,
    providerReference: response.providerReference,
    amount: response.amount,
    currency: response.currency,
    failureCode: response.failureCode,
    failureMessage: response.failureMessage,
    startedAt: response.startedAt,
    completedAt: response.completedAt,
    failedAt: response.failedAt,
    cancelledAt: response.cancelledAt,
    expiredAt: response.expiredAt,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

/**
 * Maps a collection of payment attempt responses.
 */
export function mapAdminFinancialPaymentAttempts(
  responses: readonly AdminFinancialPaymentAttemptResponse[],
): AdminFinancialPaymentAttempt[] {
  return responses.map(mapAdminFinancialPaymentAttempt);
}