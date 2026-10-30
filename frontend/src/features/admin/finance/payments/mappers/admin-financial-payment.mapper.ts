import type { AdminFinancialPayment } from '../models/admin-financial-payment.model';
import type { AdminFinancialPaymentStatus } from '../models/admin-financial-payment.enums';

import {
  mapAdminFinancialPaymentAttempts,
  type AdminFinancialPaymentAttemptResponse,
} from './admin-financial-payment-attempt.mapper';

/**
 * API response contract returned by the backend financial payment mapper.
 *
 * The backend response exposes related aggregates through identifiers only.
 */
export interface AdminFinancialPaymentResponse {
  publicId: string;
  accountId: string;
  amount: number;
  currency: string;
  status: AdminFinancialPaymentStatus;
  methodId?: string | null;
  transactionPublicId?: string | null;
  referenceType?: string | null;
  referencePublicId?: string | null;
  initiatedAt: string;
  completedAt?: string | null;
  failedAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  attempts: AdminFinancialPaymentAttemptResponse[];
}

/**
 * Maps a financial payment API response to the frontend model.
 *
 * Aggregate boundary:
 * - Payment attempts are mapped as payment-owned child data.
 * - Account, method, transaction, and business references remain IDs.
 * - No domain entities or nested external aggregates are exposed.
 */
export function mapAdminFinancialPayment(
  response: AdminFinancialPaymentResponse,
): AdminFinancialPayment {
  return {
    publicId: response.publicId,
    accountId: response.accountId,
    amount: response.amount,
    currency: response.currency,
    status: response.status,
    methodId: response.methodId,
    transactionPublicId: response.transactionPublicId,
    referenceType: response.referenceType,
    referencePublicId: response.referencePublicId,
    initiatedAt: response.initiatedAt,
    completedAt: response.completedAt,
    failedAt: response.failedAt,
    cancelledAt: response.cancelledAt,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    attempts: mapAdminFinancialPaymentAttempts(response.attempts),
  };
}

/**
 * Maps a collection of payment API responses.
 *
 * Useful for a directory endpoint when one is available.
 */
export function mapAdminFinancialPayments(
  responses: readonly AdminFinancialPaymentResponse[],
): AdminFinancialPayment[] {
  return responses.map(mapAdminFinancialPayment);
}