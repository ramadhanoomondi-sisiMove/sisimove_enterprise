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
// └── FinancialDisbursementDestinationEntity (associated entity)
//
// Repository responsibilities:
//
// - Persist Financial Disbursement aggregates.
// - Rehydrate Financial Disbursement aggregates.
// - Resolve the associated Financial Disbursement Destination.
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
// FinancialDisbursementDestinationEntity is NOT an owned child entity of the
// FinancialDisbursementAggregate.
//
// It is an independently persisted Financial-domain entity associated with the
// source Financial Account.
//
// The repository must:
//
// - resolve the destination referenced by destinationId;
// - supply the destination when rehydrating the disbursement aggregate;
// - support destination resolution during disbursement creation.
//
// FinancialDisbursementEntity.attempts is the authoritative attempt
// collection and must be fully rehydrated as part of the aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { FinancialDisbursementAggregate } from '../aggregates/financial-disbursement.aggregate';

import type { FinancialDisbursementDestinationEntity } from '../entities/financial-disbursement-destination.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import type { FinancialDisbursementDestinationPublicId } from '../value-objects/financial-disbursement-destination-public-id.vo';

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
   * The selected FinancialDisbursementDestinationEntity is independently
   * persisted and must not be created by this operation.
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
   * FinancialDisbursementAttemptEntity remains a child entity and must not be
   * treated as an independent aggregate root.
   */
  save(aggregate: FinancialDisbursementAggregate): Promise<void>;

  // ===========================================================================
  // Find Destination by Public Identity
  // ===========================================================================

  /**
   * Finds a Financial Disbursement Destination by public identity.
   *
   * The destination is independently persisted and associated with a
   * Financial Account.
   *
   * This lookup does not transfer ownership of the destination to the
   * FinancialDisbursementAggregate.
   *
   * Returns null when the destination does not exist.
   */
  findDestinationByPublicId(
    publicId: FinancialDisbursementDestinationPublicId,
  ): Promise<FinancialDisbursementDestinationEntity | null>;

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
   * Returns null when the disbursement does not exist.
   */
  findByPublicId(
    publicId: FinancialDisbursementPublicId,
  ): Promise<FinancialDisbursementAggregate | null>;

  // ===========================================================================
  // Find by Internal Identity
  // ===========================================================================

  /**
   * Finds a Financial Disbursement by its internal entity identity.
   *
   * This method is intended for internal Financial-domain/infrastructure
   * operations.
   *
   * Returns null when the disbursement does not exist.
   */
  findById(id: string): Promise<FinancialDisbursementAggregate | null>;

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
   * Returns null when no disbursement references the transaction.
   */
  findByTransactionPublicId(
    transactionPublicId: FinancialReferencePublicId,
  ): Promise<FinancialDisbursementAggregate | null>;

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
}
