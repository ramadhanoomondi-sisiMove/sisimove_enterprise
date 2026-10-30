import type {
  AdminFinancialPaymentReferenceType,
  AdminFinancialPaymentStatus,
} from './admin-financial-payment.enums';

import type { AdminFinancialPaymentAttempt } from './admin-financial-payment-attempt.model';

/**
 * Financial payment API response model.
 *
 * References to other aggregates remain public identifiers.
 * Do not embed account, payment-method, or transaction aggregates here.
 */
export interface AdminFinancialPayment {
  publicId: string;

  accountId: string;

  amount: number;

  currency: string;

  status: AdminFinancialPaymentStatus;

  methodId?: string | null;

  transactionPublicId?: string | null;

  referenceType?: AdminFinancialPaymentReferenceType | null;

  referencePublicId?: string | null;

  initiatedAt: string;

  completedAt?: string | null;

  failedAt?: string | null;

  cancelledAt?: string | null;

  createdAt: string;

  updatedAt: string;

  attempts: AdminFinancialPaymentAttempt[];
}

/**
 * Short payment identity for lists, links, and compact references.
 */
export type AdminFinancialPaymentReference = Pick<
  AdminFinancialPayment,
  'publicId' | 'amount' | 'currency' | 'status' | 'createdAt'
>;