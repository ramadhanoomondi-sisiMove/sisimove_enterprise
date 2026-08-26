// -----------------------------------------------------------------------------
// Financial Disbursement Attempt Entity
// -----------------------------------------------------------------------------
//
// Represents one concrete execution attempt of a Financial Disbursement
// against an external financial provider.
//
// Aggregate ownership:
//
// FinancialDisbursementAggregate
// └── FinancialDisbursementEntity
//     └── FinancialDisbursementAttemptEntity[]
//
// FinancialDisbursementEntity is the aggregate root.
// FinancialDisbursementAttemptEntity is a child entity and must never be
// treated as an independent aggregate root.
//
// -----------------------------------------------------------------------------
//
// Domain meaning
// -----------------------------------------------------------------------------
//
// A FinancialDisbursementAttempt represents ONE concrete execution attempt.
//
// If execution fails and the application workflow decides that another
// execution should be attempted, a NEW FinancialDisbursementAttemptEntity is
// created and attached to the same FinancialDisbursementEntity.
//
// Therefore:
//
// Attempt #1 -> FAILED
// Attempt #2 -> PROCESSING
// Attempt #3 -> SUCCEEDED
//
// The attempts collectively form the execution history of the disbursement.
//
// The attempt itself does NOT decide whether another attempt may be created.
// That decision belongs to the FinancialDisbursementEntity and the
// application/integration workflow.
//
// -----------------------------------------------------------------------------
//
// Responsibilities
// -----------------------------------------------------------------------------
//
// - Maintain attempt identity.
// - Maintain owning Financial Disbursement identity.
// - Maintain provider identity.
// - Maintain provider execution reference.
// - Maintain attempted amount.
// - Maintain attempt lifecycle.
// - Maintain safe failure diagnostics.
// - Maintain execution timestamps.
// - Enforce attempt-local lifecycle invariants.
// - Preserve the historical state of the concrete execution attempt.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT
// -----------------------------------------------------------------------------
//
// - Execute provider APIs.
// - Communicate with external providers.
// - Store provider credentials or secrets.
// - Select providers.
// - Route provider requests.
// - Select destinations.
// - Decide whether another attempt may be created.
// - Decide whether the parent disbursement may be retried.
// - Complete the parent disbursement.
// - Fail the parent disbursement.
// - Cancel the parent disbursement.
// - Post Financial Transactions.
// - Modify Financial Account balances.
// - Create ledger entries.
// - Persist itself.
//
// -----------------------------------------------------------------------------
//
// Architectural boundaries
// -----------------------------------------------------------------------------
//
// Provider communication:
//
//   Integration / Application boundary
//
// Disbursement lifecycle:
//
//   FinancialDisbursementEntity
//
// Attempt lifecycle:
//
//   FinancialDisbursementAttemptEntity
//
// Financial Account balance:
//
//   FinancialAccount aggregate
//
// Financial Transaction:
//
//   FinancialTransaction aggregate
//
// Persistence:
//
//   Repository / Infrastructure
//
// -----------------------------------------------------------------------------
//
// Important invariant
// -----------------------------------------------------------------------------
//
// An attempt is historical once it reaches a terminal state.
//
// Therefore:
//
// PENDING
//   -> PROCESSING
//   -> SUCCEEDED
//
// PENDING
//   -> PROCESSING
//   -> FAILED
//
// PENDING
//   -> CANCELLED
//
// PROCESSING
//   -> CANCELLED
//
// A terminal attempt cannot be reopened.
//
// A failed attempt is never reset into PENDING.
//
// A new execution attempt is represented by a new child entity.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { FinancialDisbursementAttemptPublicId } from '../value-objects/financial-disbursement-attempt-public-id.vo';

import { FinancialDisbursementAttemptStatus } from '../value-objects/financial-disbursement-attempt-status.vo';

import type { Money } from '../value-objects/money.vo';

import type { FinancialProvider } from '../value-objects/financial-provider.vo';

import type { FinancialProviderReference } from '../value-objects/financial-provider-reference.vo';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface FinancialDisbursementAttemptProps {
  // ---------------------------------------------------------------------------
  // Ownership
  // ---------------------------------------------------------------------------

  /**
   * Internal identity of the owning Financial Disbursement aggregate.
   *
   * This is intentionally an internal UniqueEntityId.
   *
   * The FinancialDisbursementEntity uses this identity to verify aggregate
   * ownership when attaching the attempt.
   */
  disbursementId: UniqueEntityId;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current lifecycle state of this execution attempt.
   *
   * New attempts always begin in PENDING state.
   */
  status: FinancialDisbursementAttemptStatus;

  // ---------------------------------------------------------------------------
  // Provider
  // ---------------------------------------------------------------------------

  /**
   * Financial provider used for this concrete execution attempt.
   *
   * The provider is immutable for the lifetime of the attempt.
   *
   * A retry using another provider is represented by a new attempt.
   */
  provider: FinancialProvider;

  /**
   * Safe provider-issued reference for this concrete execution.
   *
   * The reference may be unavailable before provider execution begins or
   * before the provider accepts the request.
   *
   * This value must never contain:
   *
   * - credentials;
   * - authentication tokens;
   * - PINs;
   * - secrets;
   * - signatures;
   * - private keys;
   * - raw provider response payloads.
   */
  providerReference: FinancialProviderReference | undefined;

  // ---------------------------------------------------------------------------
  // Monetary Value
  // ---------------------------------------------------------------------------

  /**
   * Amount submitted for this execution attempt.
   *
   * Money keeps amount and currency inseparable.
   *
   * The parent FinancialDisbursementEntity is responsible for ensuring that
   * this amount exactly matches the parent disbursement amount.
   */
  amount: Money;

  // ---------------------------------------------------------------------------
  // Failure Diagnostics
  // ---------------------------------------------------------------------------

  /**
   * Safe diagnostic failure classification.
   *
   * This is not intended to contain raw provider payloads.
   */
  failureCode: string | undefined;

  /**
   * Safe human-readable failure description.
   *
   * This must not contain secrets or sensitive provider response data.
   */
  failureMessage: string | undefined;

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which execution started.
   */
  startedAt: Date | undefined;

  /**
   * Timestamp at which execution successfully completed.
   */
  completedAt: Date | undefined;

  /**
   * Timestamp at which execution failed.
   */
  failedAt: Date | undefined;

  /**
   * Timestamp at which the attempt was cancelled.
   *
   * Cancellation is an internal attempt lifecycle state. It does not imply
   * that an external provider-side cancellation occurred.
   */
  cancelledAt: Date | undefined;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class FinancialDisbursementAttemptEntity extends Entity<
  FinancialDisbursementAttemptProps,
  FinancialDisbursementAttemptPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    props: FinancialDisbursementAttemptProps,
    id?: UniqueEntityId,
    publicId?: FinancialDisbursementAttemptPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Financial Disbursement Attempt.
   *
   * New attempts always begin in PENDING state.
   *
   * Aggregate-level validation remains the responsibility of the parent
   * FinancialDisbursementEntity.
   *
   * The parent aggregate validates, among other things:
   *
   * - ownership;
   * - amount consistency;
   * - currency consistency through Money;
   * - whether another attempt is permitted;
   * - whether the disbursement is terminal.
   */
  public static create(
    disbursementId: UniqueEntityId,
    provider: FinancialProvider,
    amount: Money,
    providerReference?: FinancialProviderReference,
  ): FinancialDisbursementAttemptEntity {
    // -------------------------------------------------------------------------
    // Amount invariant
    // -------------------------------------------------------------------------

    if (!amount.isPositive()) {
      throw new Error(
        'Financial Disbursement Attempt amount must be greater than zero',
      );
    }

    // -------------------------------------------------------------------------
    // Timestamp
    // -------------------------------------------------------------------------

    const now = new Date();

    // -------------------------------------------------------------------------
    // Entity
    // -------------------------------------------------------------------------

    return new FinancialDisbursementAttemptEntity(
      {
        // Ownership
        disbursementId,

        // Lifecycle
        status: FinancialDisbursementAttemptStatus.pending(),

        // Provider
        provider,
        providerReference: providerReference ?? undefined,

        // Monetary Value
        amount,

        // Failure Diagnostics
        failureCode: undefined,
        failureMessage: undefined,

        // Lifecycle Timestamps
        startedAt: undefined,
        completedAt: undefined,
        failedAt: undefined,
        cancelledAt: undefined,

        // Audit
        createdAt: now,
        updatedAt: now,
      },

      new UniqueEntityId(),

      new FinancialDisbursementAttemptPublicId(),
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of this Financial Disbursement Attempt.
   */
  public override get publicId(): FinancialDisbursementAttemptPublicId {
    return super.publicId;
  }

  /**
   * Internal identity of the owning Financial Disbursement aggregate.
   */
  public get disbursementId(): UniqueEntityId {
    return this.props.disbursementId;
  }

  // ---------------------------------------------------------------------------
  // Getters
  // ---------------------------------------------------------------------------

  public get status(): FinancialDisbursementAttemptStatus {
    return this.props.status;
  }

  public get provider(): FinancialProvider {
    return this.props.provider;
  }

  public get providerReference(): FinancialProviderReference | undefined {
    return this.props.providerReference;
  }

  public get amount(): Money {
    return this.props.amount;
  }

  public get failureCode(): string | undefined {
    return this.props.failureCode;
  }

  public get failureMessage(): string | undefined {
    return this.props.failureMessage;
  }

  public get startedAt(): Date | undefined {
    return this.props.startedAt;
  }

  public get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  public get failedAt(): Date | undefined {
    return this.props.failedAt;
  }

  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Starts execution of this attempt.
   *
   * Only a PENDING attempt may begin processing.
   *
   * Provider communication itself remains outside the entity.
   */
  public start(startedAt: Date = new Date()): void {
    if (!this.props.status.canProcess()) {
      throw new Error(
        `Cannot process Financial Disbursement Attempt from status: ` +
          `${this.props.status.value}`,
      );
    }

    this.ensureValidTimestamp(startedAt, 'startedAt');

    this.props.status = FinancialDisbursementAttemptStatus.processing();

    this.props.startedAt = startedAt;

    this.props.completedAt = undefined;
    this.props.failedAt = undefined;
    this.props.cancelledAt = undefined;

    this.clearFailureInformation();

    this.touch(startedAt);
  }

  /**
   * Marks this execution attempt as successfully completed.
   *
   * Only a PROCESSING attempt may succeed.
   */
  public succeed(completedAt: Date = new Date()): void {
    if (!this.props.status.canSucceed()) {
      throw new Error(
        `Cannot succeed Financial Disbursement Attempt from status: ` +
          `${this.props.status.value}`,
      );
    }

    this.ensureValidTimestamp(completedAt, 'completedAt');

    this.ensureStartedBefore(completedAt);

    this.props.status = FinancialDisbursementAttemptStatus.succeeded();

    this.props.completedAt = completedAt;

    this.props.failedAt = undefined;
    this.props.cancelledAt = undefined;

    this.clearFailureInformation();

    this.touch(completedAt);
  }

  /**
   * Marks this execution attempt as failed.
   *
   * Only a PROCESSING attempt may fail.
   *
   * Failure information becomes part of the historical execution record.
   *
   * A failed attempt must never be reopened. A new attempt must be created
   * if the application workflow decides to retry.
   */
  public fail(
    failureCode?: string,
    failureMessage?: string,
    failedAt: Date = new Date(),
  ): void {
    if (!this.props.status.canFail()) {
      throw new Error(
        `Cannot fail Financial Disbursement Attempt from status: ` +
          `${this.props.status.value}`,
      );
    }

    this.ensureValidTimestamp(failedAt, 'failedAt');

    this.ensureStartedBefore(failedAt);

    this.props.status = FinancialDisbursementAttemptStatus.failed();

    this.props.failureCode = this.normalizeFailureCode(failureCode);

    this.props.failureMessage = this.normalizeFailureMessage(failureMessage);

    this.props.failedAt = failedAt;

    this.props.completedAt = undefined;
    this.props.cancelledAt = undefined;

    this.touch(failedAt);
  }

  /**
   * Cancels this execution attempt.
   *
   * Cancellation records the internal Financial Disbursement Attempt
   * lifecycle only.
   *
   * It does not claim that the external provider cancelled an already
   * submitted request.
   */
  public cancel(cancelledAt: Date = new Date()): void {
    if (!this.props.status.canCancel()) {
      throw new Error(
        `Cannot cancel Financial Disbursement Attempt from status: ` +
          `${this.props.status.value}`,
      );
    }

    this.ensureValidTimestamp(cancelledAt, 'cancelledAt');

    if (this.props.startedAt !== undefined) {
      this.ensureStartedBefore(cancelledAt);
    }

    this.props.status = FinancialDisbursementAttemptStatus.cancelled();

    this.props.cancelledAt = cancelledAt;

    this.props.completedAt = undefined;
    this.props.failedAt = undefined;

    this.clearFailureInformation();

    this.touch(cancelledAt);
  }

  // ---------------------------------------------------------------------------
  // Provider Reference
  // ---------------------------------------------------------------------------

  /**
   * Records the provider-issued execution reference.
   *
   * The reference may be assigned by the application/integration boundary
   * after the provider accepts or identifies the execution.
   *
   * The reference is immutable once assigned.
   *
   * Re-applying the same reference is treated as idempotent.
   */
  public setProviderReference(
    providerReference: FinancialProviderReference,
  ): void {
    if (this.isTerminal()) {
      throw new Error(
        'Cannot set a provider reference on a terminal Financial Disbursement Attempt',
      );
    }

    if (this.props.providerReference !== undefined) {
      if (this.props.providerReference.equals(providerReference)) {
        return;
      }

      throw new Error(
        'Financial Disbursement Attempt already has a provider reference',
      );
    }

    this.props.providerReference = providerReference;

    this.touch();
  }

  /**
   * Returns whether a provider execution reference exists.
   */
  public hasProviderReference(): boolean {
    return this.props.providerReference !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Failure Information
  // ---------------------------------------------------------------------------

  /**
   * Returns whether failure diagnostics have been recorded.
   */
  public hasFailure(): boolean {
    return (
      this.props.failureCode !== undefined ||
      this.props.failureMessage !== undefined
    );
  }

  /**
   * Clears failure information internally.
   *
   * Failure information is cleared only as part of a valid transition from
   * PENDING to PROCESSING or PROCESSING to SUCCEEDED.
   *
   * Failed terminal attempts never expose a public operation that clears
   * their historical failure information.
   */
  private clearFailureInformation(): void {
    this.props.failureCode = undefined;
    this.props.failureMessage = undefined;
  }

  // ---------------------------------------------------------------------------
  // Failure Normalization
  // ---------------------------------------------------------------------------

  /**
   * Normalizes a provider/application failure code.
   *
   * Empty values are not persisted.
   */
  private normalizeFailureCode(failureCode?: string): string | undefined {
    const normalized = failureCode?.trim();

    return normalized || undefined;
  }

  /**
   * Normalizes a provider/application failure message.
   *
   * Empty values are not persisted.
   */
  private normalizeFailureMessage(failureMessage?: string): string | undefined {
    const normalized = failureMessage?.trim();

    return normalized || undefined;
  }

  // ---------------------------------------------------------------------------
  // Timestamp Validation
  // ---------------------------------------------------------------------------

  /**
   * Ensures that a supplied lifecycle timestamp is a valid Date.
   */
  private ensureValidTimestamp(timestamp: Date, fieldName: string): void {
    if (Number.isNaN(timestamp.getTime())) {
      throw new Error(
        `Financial Disbursement Attempt ${fieldName} must be a valid Date`,
      );
    }
  }

  /**
   * Ensures that execution completion/failure/cancellation does not occur
   * before execution started.
   */
  private ensureStartedBefore(timestamp: Date): void {
    if (
      this.props.startedAt !== undefined &&
      timestamp.getTime() < this.props.startedAt.getTime()
    ) {
      throw new Error(
        'Financial Disbursement Attempt lifecycle timestamp cannot occur before startedAt',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Queries
  // ---------------------------------------------------------------------------

  /**
   * Returns whether this attempt is pending.
   */
  public isPending(): boolean {
    return this.props.status.isPending();
  }

  /**
   * Returns whether this attempt is processing.
   */
  public isProcessing(): boolean {
    return this.props.status.isProcessing();
  }

  /**
   * Returns whether this attempt succeeded.
   */
  public isSucceeded(): boolean {
    return this.props.status.isSucceeded();
  }

  /**
   * Returns whether this attempt failed.
   */
  public isFailed(): boolean {
    return this.props.status.isFailed();
  }

  /**
   * Returns whether this attempt was cancelled.
   */
  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  /**
   * Returns whether this attempt is terminal.
   */
  public isTerminal(): boolean {
    return this.props.status.isTerminal();
  }

  /**
   * Returns whether this attempt completed successfully.
   */
  public isSuccessful(): boolean {
    return this.isSucceeded();
  }

  /**
   * Returns whether this attempt can begin execution.
   *
   * This is an attempt-local lifecycle query.
   *
   * It does NOT mean that the parent disbursement is eligible for execution.
   */
  public canProcess(): boolean {
    return this.isPending();
  }

  /**
   * Returns whether this attempt has finished execution.
   */
  public hasFinished(): boolean {
    return this.isTerminal();
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  /**
   * Returns the current lifecycle status value.
   */
  public get statusValue(): string {
    return this.props.status.value;
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Explicitly sets the updated timestamp.
   *
   * Primarily intended for persistence reconstitution/mapping.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }
}
