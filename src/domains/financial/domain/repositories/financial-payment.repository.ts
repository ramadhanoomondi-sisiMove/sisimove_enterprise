// src/domains/financial/domain/repositories/financial-payment.repository.ts

// -----------------------------------------------------------------------------
// Financial Payment Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Financial Payment aggregate.
//
// Aggregate ownership:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// Repository boundary:
//
// - FinancialPaymentAggregate is the unit of persistence.
// - FinancialPaymentAttemptEntity is persisted as part of its parent aggregate.
// - Cross-aggregate references remain opaque public identities.
// - Repository implementations may optimize persistence and queries internally,
//   but must preserve aggregate invariants.
//
// Responsibilities:
//
// - Create Financial Payment aggregates.
// - Persist existing Financial Payment aggregates.
// - Retrieve complete Financial Payment aggregates.
// - Support payment-processing queries.
// - Support originating-business-reference queries.
// - Support Financial Account-scoped payment queries.
// - Support Financial Payment Method queries.
// - Support Financial Transaction reference queries.
// - Support existence checks.
//
// This interface belongs entirely to the Financial domain.
//
// It does NOT:
//
// - Depend on Prisma.
// - Depend on ORM/database models.
// - Execute provider APIs.
// - Communicate with external payment providers.
// - Modify Financial Account balances.
// - Create or post Financial Transactions.
// - Perform settlement.
// - Perform accounting.
// - Persist Financial Payment Attempt entities independently.
//
// Infrastructure implementations are responsible for translating this contract
// into persistence operations.
//
// IMPORTANT:
//
// Cross-aggregate references are represented by dedicated public identity
// value objects:
//
// - FinancialAccountPublicId
// - FinancialPaymentMethodPublicId
// - FinancialTransactionPublicId
//
// The repository contract must not expose persistence IDs.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialPaymentAggregate } from '../aggregates/financial-payment.aggregate';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialPaymentPublicId } from '../value-objects/financial-payment-public-id.vo';

import type { FinancialPaymentMethodPublicId } from '../value-objects/financial-payment-method-public-id.vo';

import type { FinancialPaymentStatus } from '../value-objects/financial-payment-status.vo';

import type { FinancialReferenceType } from '../value-objects/financial-reference-type.vo';

import type { FinancialReferencePublicId } from '../value-objects/financial-reference-public-id.vo';

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import type { FinancialTransactionPublicId } from '../value-objects/financial-transaction-public-id.vo';

// =============================================================================
// Repository
// =============================================================================

export interface FinancialPaymentRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a brand-new Financial Payment aggregate.
   *
   * The complete aggregate is the unit of persistence:
   *
   * FinancialPaymentAggregate
   * ├── FinancialPaymentEntity
   * └── FinancialPaymentAttemptEntity[]
   *
   * The infrastructure implementation must persist the parent payment and
   * all owned attempts atomically.
   */
  create(aggregate: FinancialPaymentAggregate): Promise<void>;

  /**
   * Persists the current state of an existing Financial Payment aggregate.
   *
   * Owned Financial Payment Attempts are synchronized within the same
   * persistence transaction.
   *
   * The aggregate identity determines which persisted aggregate is updated.
   */
  save(aggregate: FinancialPaymentAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Retrieval
  // ===========================================================================

  /**
   * Finds a complete Financial Payment aggregate by its internal persistence
   * identity.
   *
   * This method is primarily an infrastructure/application concern and should
   * only be used where the internal identity is intentionally available.
   *
   * Rehydration must include:
   *
   * - FinancialPaymentEntity
   * - FinancialPaymentAttemptEntity[]
   *
   * No domain events should be emitted during rehydration.
   */
  findById(id: string): Promise<FinancialPaymentAggregate | null>;

  /**
   * Finds a complete Financial Payment aggregate by public identifier.
   *
   * Rehydration must include:
   *
   * - FinancialPaymentEntity
   * - FinancialPaymentAttemptEntity[]
   *
   * No domain events should be emitted during rehydration.
   */
  findByPublicId(
    publicId: FinancialPaymentPublicId,
  ): Promise<FinancialPaymentAggregate | null>;

  // ===========================================================================
  // Financial Account
  // ===========================================================================

  /**
   * Finds all Financial Payments associated with a Financial Account.
   *
   * The account identifier is an opaque cross-aggregate public identity.
   *
   * The infrastructure implementation resolves the public identity to its
   * internal persistence identity when querying Prisma.
   */
  findByAccountId(
    accountId: FinancialAccountPublicId,
  ): Promise<FinancialPaymentAggregate[]>;

  // ===========================================================================
  // Financial Payment Method
  // ===========================================================================

  /**
   * Finds all Financial Payments associated with a Financial Payment Method.
   *
   * The payment method is represented only by its public identity.
   *
   * The infrastructure implementation resolves the public identity to the
   * internal persistence identity when querying Prisma.
   */
  findByPaymentMethod(
    methodId: FinancialPaymentMethodPublicId,
  ): Promise<FinancialPaymentAggregate[]>;

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  /**
   * Finds a Financial Payment by its originating business reference.
   *
   * The reference is an atomic pair:
   *
   * - referenceType
   * - referencePublicId
   *
   * Both values belong to the domain and remain independent of persistence
   * identifiers.
   *
   * Returns null when no payment exists for the reference.
   */
  findByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<FinancialPaymentAggregate | null>;

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  /**
   * Finds Financial Payments by lifecycle status.
   *
   * This query returns complete aggregates because payment lifecycle
   * processing operates on the Financial Payment aggregate boundary.
   */
  findByStatus(
    status: FinancialPaymentStatus,
  ): Promise<FinancialPaymentAggregate[]>;

  /**
   * Finds Financial Payments currently waiting for execution.
   *
   * Equivalent to querying payments in PENDING state.
   */
  findPending(): Promise<FinancialPaymentAggregate[]>;

  /**
   * Finds Financial Payments currently being processed.
   *
   * Equivalent to querying payments in PROCESSING state.
   */
  findProcessing(): Promise<FinancialPaymentAggregate[]>;

  // ===========================================================================
  // Financial Transaction Reference
  // ===========================================================================

  /**
   * Finds the Financial Payment associated with a Financial Transaction.
   *
   * The Financial Transaction belongs to another aggregate.
   *
   * Only its opaque public identity is stored by the Financial Payment
   * aggregate.
   *
   * The persistence implementation must not treat the transaction public
   * identity as a Prisma unique key unless the database schema explicitly
   * guarantees uniqueness.
   */
  findByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<FinancialPaymentAggregate | null>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Determines whether a Financial Payment exists by public identifier.
   *
   * This is intentionally an existence-only query and does not require
   * aggregate rehydration.
   */
  existsByPublicId(publicId: FinancialPaymentPublicId): Promise<boolean>;

  /**
   * Determines whether a Financial Payment exists for an originating
   * business reference.
   *
   * This is useful for idempotency and business-reference uniqueness checks.
   */
  existsByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<boolean>;

  /**
   * Determines whether a Financial Payment exists for a Financial Transaction.
   *
   * The transaction is identified through its opaque public identity.
   *
   * Because transactionPublicId is not currently a Prisma @unique field,
   * infrastructure should use a non-unique lookup such as findFirst().
   */
  existsByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<boolean>;
}
