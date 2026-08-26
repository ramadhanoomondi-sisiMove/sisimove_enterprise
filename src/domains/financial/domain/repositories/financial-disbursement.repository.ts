// -----------------------------------------------------------------------------
// Financial Disbursement Repository
// -----------------------------------------------------------------------------
//
// Domain repository contract for the Financial Disbursement aggregate.
//
// Aggregate boundary:
//
// FinancialDisbursementAggregate
// ├── FinancialDisbursementEntity
// │   └── FinancialDisbursementAttemptEntity[]
// └── FinancialDisbursementDestinationEntity
//
// Repository responsibilities:
//
// - Persist Financial Disbursement aggregates.
// - Rehydrate Financial Disbursement aggregates.
// - Retrieve disbursements by internal/public identity.
// - Retrieve disbursements by source Financial Account.
// - Retrieve disbursements by originating business reference.
// - Retrieve disbursements by lifecycle status.
// - Retrieve disbursements associated with a Financial Transaction.
// - Determine whether a disbursement exists.
//
// The repository owns persistence concerns only.
//
// It does NOT:
//
// - Execute provider APIs.
// - Communicate with external providers.
// - Move money.
// - Modify Financial Account balances.
// - Create or post Financial Transactions.
// - Decide provider routing.
// - Decide retry policy.
// - Perform business orchestration.
//
// Infrastructure implementations belong outside the domain layer.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// FinancialDisbursementDestinationEntity is not owned by the
// FinancialDisbursementAggregate's persistence graph.
//
// The repository must load the destination referenced by destinationId and
// supply it when rehydrating the aggregate.
//
// FinancialDisbursementEntity.attempts is the authoritative attempt
// collection and must be fully rehydrated as part of the aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { FinancialDisbursementAggregate } from '../aggregates/financial-disbursement.aggregate';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import type { FinancialDisbursementPublicId } from '../value-objects/financial-disbursement-public-id.vo';

import type { FinancialDisbursementStatus } from '../value-objects/financial-disbursement-status.vo';

import type { FinancialReferenceType } from '../value-objects/financial-reference-type.vo';

import type { FinancialReferencePublicId } from '../value-objects/financial-reference-public-id.vo';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

export interface FinancialDisbursementRepository {
  // ===========================================================================
  // Create
  // ===========================================================================

  /**
   * Persists a newly created Financial Disbursement aggregate.
   *
   * The aggregate must already satisfy all domain invariants.
   *
   * The repository must persist:
   *
   * - FinancialDisbursementEntity;
   * - all currently attached FinancialDisbursementAttemptEntity children.
   *
   * The selected FinancialDisbursementDestinationEntity is an independently
   * persisted entity and is not created by this operation.
   */
  create(aggregate: FinancialDisbursementAggregate): Promise<void>;

  // ===========================================================================
  // Save
  // ===========================================================================

  /**
   * Persists changes to an existing Financial Disbursement aggregate.
   *
   * Persistence must include the complete attempt collection owned by the
   * FinancialDisbursementEntity.
   *
   * The repository must preserve aggregate consistency and must not treat
   * FinancialDisbursementAttemptEntity as an independent aggregate root.
   */
  save(aggregate: FinancialDisbursementAggregate): Promise<void>;

  // ===========================================================================
  // Find by Public Identity
  // ===========================================================================

  /**
   * Finds a Financial Disbursement by its public identity.
   *
   * The returned aggregate must be fully rehydrated, including:
   *
   * - FinancialDisbursementEntity;
   * - all FinancialDisbursementAttemptEntity children;
   * - referenced FinancialDisbursementDestinationEntity.
   *
   * Returns undefined when the disbursement does not exist.
   */
  findByPublicId(
    publicId: FinancialDisbursementPublicId,
  ): Promise<FinancialDisbursementAggregate | undefined>;

  // ===========================================================================
  // Find by Internal Identity
  // ===========================================================================

  /**
   * Finds a Financial Disbursement by its internal entity identity.
   *
   * This method is intended for internal Financial-domain/infrastructure
   * operations.
   *
   * Returns undefined when the disbursement does not exist.
   */
  findById(id: string): Promise<FinancialDisbursementAggregate | undefined>;

  // ===========================================================================
  // Find by Source Financial Account
  // ===========================================================================

  /**
   * Finds Financial Disbursements belonging to a source Financial Account.
   *
   * Results must contain fully rehydrated aggregates.
   *
   * The repository must not expose persistence models directly.
   */
  findBySourceAccountPublicId(
    sourceAccountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialDisbursementAggregate[]>;

  // ===========================================================================
  // Find by Business Reference
  // ===========================================================================

  /**
   * Finds Financial Disbursements associated with an originating business
   * reference.
   *
   * Financial treats the reference as opaque.
   *
   * No persistence relationship with the referenced bounded context is
   * established by this repository.
   */
  findByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<FinancialDisbursementAggregate[]>;

  // ===========================================================================
  // Find by Transaction
  // ===========================================================================

  /**
   * Finds the Financial Disbursement associated with a Financial Transaction.
   *
   * A Financial Disbursement may reference at most one Financial Transaction.
   *
   * Returns undefined when no disbursement references the transaction.
   */
  findByTransactionPublicId(
    transactionPublicId: FinancialReferencePublicId,
  ): Promise<FinancialDisbursementAggregate | undefined>;

  // ===========================================================================
  // Find by Status
  // ===========================================================================

  /**
   * Finds Financial Disbursements by lifecycle status.
   *
   * Results must contain fully rehydrated aggregates.
   */
  findByStatus(
    status: FinancialDisbursementStatus,
  ): Promise<FinancialDisbursementAggregate[]>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Determines whether a Financial Disbursement exists by public identity.
   *
   * This is intended for lightweight existence checks and should not
   * rehydrate the aggregate unnecessarily.
   */
  existsByPublicId(publicId: FinancialDisbursementPublicId): Promise<boolean>;

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Physical deletion of Financial Disbursements is intentionally unsupported.
   *
   * Financial Disbursements are financial lifecycle records and must remain
   * auditable.
   *
   * Lifecycle removal is represented through domain state transitions such as
   * cancellation or failure.
   */
  delete(aggregate: FinancialDisbursementAggregate): Promise<void>;
}
