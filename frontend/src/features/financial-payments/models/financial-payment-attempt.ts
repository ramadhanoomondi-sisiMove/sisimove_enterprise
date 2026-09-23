// =============================================================================
// sisiMove — Financial Payment Attempt Model
// =============================================================================
//
// Frontend representation of a FinancialPaymentAttempt.
//
// A FinancialPaymentAttempt represents one concrete attempt to execute a
// FinancialPayment through an external payment provider.
//
// A FinancialPayment may contain multiple attempts because an external
// provider operation can fail and be retried.
//
// This is a frontend domain/read model, not a Prisma model mirror.
//
// The model deliberately excludes persistence-only fields such as:
//
//     - database id;
//     - paymentId;
//
// The relationship back to FinancialPayment is represented by the containing
// FinancialPayment model rather than by exposing the database foreign key.
//
// Provider references are retained only where they are part of the API-safe
// response and useful for payment status/history display.
//
// Monetary amounts are represented as integer minor units.
//
// Example:
//
//     125000 = KES 1,250.00
//
// =============================================================================

import type { FinancialPaymentAttemptStatus } from './financial-payment-attempt-status';

// -----------------------------------------------------------------------------
// FinancialPaymentAttempt
// -----------------------------------------------------------------------------

export interface FinancialPaymentAttempt {
  /**
   * Public identifier of this payment attempt.
   *
   * The database `id` is deliberately not exposed to the frontend.
   */
  publicId: string;

  /**
   * Current lifecycle status of the payment attempt.
   *
   * The frontend displays this state but does not transition it directly.
   */
  status: FinancialPaymentAttemptStatus;

  /**
   * External payment provider used for this attempt.
   *
   * Example:
   *
   *     MPESA
   *
   * The exact provider value is defined by the backend/provider integration.
   */
  provider: string;

  /**
   * Provider-issued reference for this attempt, when available.
   *
   * This may be absent while an attempt is still pending or before the
   * external provider has assigned a reference.
   */
  providerReference?: string;

  /**
   * Amount processed by this attempt.
   *
   * Integer minor units.
   */
  amount: number;

  /**
   * ISO currency code for the attempt.
   *
   * SisiMove currently operates member wallet payments in KES.
   */
  currency: string;

  /**
   * Provider or application failure code, when the attempt fails.
   */
  failureCode?: string;

  /**
   * Human-readable failure information, when supplied by the backend.
   *
   * The frontend should display this carefully and must not assume that
   * provider failure messages are safe for every UI surface.
   */
  failureMessage?: string;

  /**
   * ISO-8601 timestamp indicating when provider processing started.
   */
  startedAt?: string;

  /**
   * ISO-8601 timestamp indicating when the attempt completed successfully.
   */
  completedAt?: string;

  /**
   * ISO-8601 timestamp indicating when the attempt failed.
   */
  failedAt?: string;

  /**
   * ISO-8601 timestamp indicating when the attempt record was created.
   */
  createdAt: string;

  /**
   * ISO-8601 timestamp indicating when the attempt record was last updated.
   */
  updatedAt: string;
}

