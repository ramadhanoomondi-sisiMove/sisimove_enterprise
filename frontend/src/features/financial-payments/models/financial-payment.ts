// =============================================================================
// sisiMove — Financial Payment Model
// =============================================================================
//
// Frontend representation of a FinancialPayment.
//
// A FinancialPayment represents an external funding/payment operation against
// a Financial Account.
//
// This is a frontend domain/read model, not a Prisma model mirror.
//
// The model deliberately excludes persistence-only fields such as:
//
//     - database id;
//     - accountId;
//     - method database foreign keys.
//
// Public identifiers are used where an external reference is required.
//
// Monetary amounts are represented as integer minor units.
//
// Example:
//
//     125000 = KES 1,250.00
//
// =============================================================================

// -----------------------------------------------------------------------------
// Financial Payment Dependencies
// -----------------------------------------------------------------------------

import type { FinancialPaymentAttempt } from './financial-payment-attempt';
import type { FinancialPaymentStatus } from './financial-payment-status';

// =============================================================================
// FinancialPayment
// =============================================================================

export interface FinancialPayment {
  /**
   * Public identifier of the Financial Payment.
   *
   * This is the API-safe identifier.
   *
   * The database `id` is deliberately not represented here.
   */
  publicId: string;

  /**
   * Amount of the payment.
   *
   * Integer minor units.
   *
   * Example:
   *
   *     125000 = KES 1,250.00
   */
  amount: number;

  /**
   * ISO currency code for the payment.
   *
   * SisiMove currently operates payments in KES.
   */
  currency: string;

  /**
   * Current payment lifecycle status.
   *
   * Possible values:
   *
   *     PENDING
   *     PROCESSING
   *     SUCCEEDED
   *     FAILED
   *     CANCELLED
   *     EXPIRED
   */
  status: FinancialPaymentStatus;

  /**
   * Public identifier of the selected payment method, when one was used.
   *
   * This is optional because FinancialPayment.methodId is nullable and a
   * payment may be created before a method is associated.
   *
   * The frontend never receives or stores the database method ID.
   */
  methodPublicId?: string;

  /**
   * Payment attempts associated with this payment.
   *
   * Attempts represent individual provider execution attempts.
   *
   * They are retained as part of the payment read model so the UI can display
   * relevant processing history when the backend includes them.
   */
  attempts: readonly FinancialPaymentAttempt[];

  /**
   * Public identifier of the resulting FinancialTransaction, when the
   * payment has produced an accounting transaction.
   *
   * This remains optional because a newly created or unsuccessful payment
   * may not yet have a transaction.
   */
  transactionPublicId?: string;

  /**
   * Optional type of the business object that caused the payment.
   *
   * Examples may include a booking or another financial business operation.
   *
   * This remains an opaque reference because the Financial domain must not
   * create frontend relations to other bounded contexts.
   */
  referenceType?: string;

  /**
   * Optional public identifier of the business object that caused the
   * payment.
   */
  referencePublicId?: string;

  /**
   * ISO-8601 timestamp indicating when the payment was initiated.
   */
  initiatedAt: string;

  /**
   * ISO-8601 timestamp indicating when the payment successfully completed.
   *
   * Undefined when the payment has not completed successfully.
   */
  completedAt?: string;

  /**
   * ISO-8601 timestamp indicating when the payment failed.
   *
   * Undefined when the payment has not failed.
   */
  failedAt?: string;

  /**
   * ISO-8601 timestamp indicating when the payment was cancelled.
   *
   * Undefined when the payment has not been cancelled.
   */
  cancelledAt?: string;

  /**
   * ISO-8601 timestamp indicating when the payment record was created.
   */
  createdAt: string;

  /**
   * ISO-8601 timestamp indicating when the payment record was last updated.
   */
  updatedAt: string;
}

