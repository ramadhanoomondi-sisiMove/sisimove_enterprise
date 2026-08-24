// -----------------------------------------------------------------------------
// Financial Payment Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the complete Financial Payment aggregate into an application/API-safe
// response representation.
//
// Aggregate:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// Mapping responsibilities:
//
// - Translate FinancialPaymentAggregate into a response DTO.
// - Translate the owned FinancialPaymentAttemptEntity[].
// - Convert domain value objects into response-safe primitives.
// - Preserve payment lifecycle timestamps.
// - Preserve payment-method and transaction references.
// - Preserve originating business references.
// - Expose safe provider references.
// - Expose safe failure information.
//
// This mapper does NOT:
//
// - Execute provider operations.
// - Load Financial Payment Methods.
// - Load Financial Transactions.
// - Load Financial Accounts.
// - Resolve cross-aggregate references.
// - Expose internal entity IDs.
// - Expose raw payment credentials.
// - Mutate the aggregate.
// - Persist anything.
//
// Cross-aggregate references remain opaque public identities.
//
// exactOptionalPropertyTypes:
// Optional response properties are omitted when their domain value is
// undefined. They are never explicitly assigned undefined.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialPaymentAggregate } from '../../../domain/aggregates/financial-payment.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { FinancialPaymentAttemptEntity } from '../../../domain/entities/financial-payment-attempt.entity';

// -----------------------------------------------------------------------------
// Response
// -----------------------------------------------------------------------------

export interface FinancialPaymentAttemptResponse {
  /**
   * Public identity of the payment attempt.
   */
  publicId: string;

  /**
   * Attempt lifecycle status.
   */
  status: string;

  /**
   * External provider used for this attempt.
   */
  provider: string;

  /**
   * Safe provider-issued reference.
   *
   * Raw provider credentials must never be exposed.
   */
  providerReference?: string;

  /**
   * Attempted monetary amount.
   */
  amount: number;

  /**
   * Attempt currency as an ISO 4217 code.
   */
  currency: string;

  /**
   * Safe provider/domain failure code.
   */
  failureCode?: string;

  /**
   * Safe provider/domain failure message.
   */
  failureMessage?: string;

  /**
   * Attempt processing timestamp.
   */
  startedAt?: string;

  /**
   * Successful completion timestamp.
   */
  completedAt?: string;

  /**
   * Failure timestamp.
   */
  failedAt?: string;

  /**
   * Cancellation timestamp.
   */
  cancelledAt?: string;

  /**
   * Expiration timestamp.
   */
  expiredAt?: string;

  /**
   * Entity creation timestamp.
   */
  createdAt: string;

  /**
   * Entity last-update timestamp.
   */
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Response
// -----------------------------------------------------------------------------

export interface FinancialPaymentResponse {
  /**
   * Public identity of the Financial Payment.
   */
  publicId: string;

  /**
   * Public identity of the owning Financial Account.
   */
  accountId: string;

  /**
   * Payment amount.
   */
  amount: number;

  /**
   * Payment currency as an ISO 4217 code.
   */
  currency: string;

  /**
   * Current payment lifecycle status.
   */
  status: string;

  /**
   * Selected Financial Payment Method public identity.
   */
  methodId?: string;

  /**
   * Resulting Financial Transaction public identity.
   */
  transactionPublicId?: string;

  /**
   * Originating business reference type.
   */
  referenceType?: string;

  /**
   * Originating business reference public identity.
   */
  referencePublicId?: string;

  /**
   * Payment initiation timestamp.
   */
  initiatedAt: string;

  /**
   * Payment completion timestamp.
   */
  completedAt?: string;

  /**
   * Payment failure timestamp.
   */
  failedAt?: string;

  /**
   * Payment cancellation timestamp.
   */
  cancelledAt?: string;

  /**
   * Payment creation timestamp.
   */
  createdAt: string;

  /**
   * Payment last-update timestamp.
   */
  updatedAt: string;

  /**
   * Provider execution attempts owned by this payment.
   */
  attempts: FinancialPaymentAttemptResponse[];
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class FinancialPaymentResponseMapper {
  // ===========================================================================
  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps a complete Financial Payment aggregate to a response.
   *
   * The aggregate is never mutated.
   *
   * Child payment attempts are mapped as part of the aggregate response
   * because they are structurally owned by the Financial Payment aggregate.
   *
   * Optional properties are conditionally added so this mapper remains
   * compatible with exactOptionalPropertyTypes: true.
   */
  public static toResponse(
    aggregate: FinancialPaymentAggregate,
  ): FinancialPaymentResponse {
    const response: FinancialPaymentResponse = {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: aggregate.publicId.value,

      // -----------------------------------------------------------------------
      // Account
      // -----------------------------------------------------------------------

      accountId: aggregate.accountId.value,

      // -----------------------------------------------------------------------
      // Payment
      // -----------------------------------------------------------------------

      amount: aggregate.amount.amount,

      currency: aggregate.amount.currency.value,

      status: aggregate.status.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      initiatedAt: aggregate.initiatedAt.toISOString(),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: aggregate.createdAt.toISOString(),

      updatedAt: aggregate.updatedAt.toISOString(),

      // -----------------------------------------------------------------------
      // Attempts
      // -----------------------------------------------------------------------

      attempts: aggregate.attempts.map((attempt) =>
        this.toAttemptResponse(attempt),
      ),
    };

    // -------------------------------------------------------------------------
    // Payment Method
    // -------------------------------------------------------------------------

    if (aggregate.methodId !== undefined) {
      response.methodId = aggregate.methodId.value;
    }

    // -------------------------------------------------------------------------
    // Financial Transaction
    // -------------------------------------------------------------------------

    if (aggregate.transactionPublicId !== undefined) {
      response.transactionPublicId = aggregate.transactionPublicId;
    }

    // -------------------------------------------------------------------------
    // Business Reference
    // -------------------------------------------------------------------------

    if (aggregate.referenceType !== undefined) {
      response.referenceType = aggregate.referenceType.value;
    }

    if (aggregate.referencePublicId !== undefined) {
      response.referencePublicId = aggregate.referencePublicId.value;
    }

    // -------------------------------------------------------------------------
    // Lifecycle Timestamps
    // -------------------------------------------------------------------------

    if (aggregate.completedAt !== undefined) {
      response.completedAt = aggregate.completedAt.toISOString();
    }

    if (aggregate.failedAt !== undefined) {
      response.failedAt = aggregate.failedAt.toISOString();
    }

    if (aggregate.cancelledAt !== undefined) {
      response.cancelledAt = aggregate.cancelledAt.toISOString();
    }

    return response;
  }

  // ===========================================================================
  // Attempt -> Response
  // ===========================================================================

  /**
   * Maps an owned Financial Payment Attempt entity to a response.
   *
   * The attempt's internal paymentId is deliberately not exposed because it is
   * an internal aggregate-ownership reference.
   *
   * Optional properties are conditionally added so no property is explicitly
   * assigned undefined under exactOptionalPropertyTypes: true.
   */
  private static toAttemptResponse(
    attempt: FinancialPaymentAttemptEntity,
  ): FinancialPaymentAttemptResponse {
    const response: FinancialPaymentAttemptResponse = {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: attempt.publicId.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: attempt.status.value,

      // -----------------------------------------------------------------------
      // Provider
      // -----------------------------------------------------------------------

      provider: attempt.provider.value,

      // -----------------------------------------------------------------------
      // Amount
      // -----------------------------------------------------------------------

      amount: attempt.amount.amount,

      currency: attempt.amount.currency.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: attempt.createdAt.toISOString(),

      updatedAt: attempt.updatedAt.toISOString(),
    };

    // -------------------------------------------------------------------------
    // Provider Reference
    // -------------------------------------------------------------------------

    if (attempt.providerReference !== undefined) {
      response.providerReference = attempt.providerReference.value;
    }

    // -------------------------------------------------------------------------
    // Failure
    // -------------------------------------------------------------------------

    if (attempt.failureCode !== undefined) {
      response.failureCode = attempt.failureCode;
    }

    if (attempt.failureMessage !== undefined) {
      response.failureMessage = attempt.failureMessage;
    }

    // -------------------------------------------------------------------------
    // Lifecycle Timestamps
    // -------------------------------------------------------------------------

    if (attempt.startedAt !== undefined) {
      response.startedAt = attempt.startedAt.toISOString();
    }

    if (attempt.completedAt !== undefined) {
      response.completedAt = attempt.completedAt.toISOString();
    }

    if (attempt.failedAt !== undefined) {
      response.failedAt = attempt.failedAt.toISOString();
    }

    if (attempt.cancelledAt !== undefined) {
      response.cancelledAt = attempt.cancelledAt.toISOString();
    }

    if (attempt.expiredAt !== undefined) {
      response.expiredAt = attempt.expiredAt.toISOString();
    }

    return response;
  }
}
