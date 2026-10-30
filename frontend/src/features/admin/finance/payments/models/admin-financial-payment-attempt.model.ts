import type {
  AdminFinancialPaymentAttemptStatus,
  AdminFinancialPaymentProvider,
} from './admin-financial-payment.enums';

/**
 * A payment attempt belongs to a financial payment.
 *
 * This model represents the API response, not the persistence entity.
 */
export interface AdminFinancialPaymentAttempt {
  publicId: string;

  status: AdminFinancialPaymentAttemptStatus;

  provider: AdminFinancialPaymentProvider;

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