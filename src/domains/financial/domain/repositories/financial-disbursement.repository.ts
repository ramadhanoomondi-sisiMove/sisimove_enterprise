// -----------------------------------------------------------------------------
// Financial Disbursement Repository
// -----------------------------------------------------------------------------
//
// Domain repository contract for the Financial Disbursement aggregate.
//
// Aggregate boundary:
//
// FinancialDisbursementAggregate
// └── FinancialDisbursementEntity
//     └── FinancialDisbursementAttemptEntity[]
//
// Destination:
//
// FinancialAccountWithdrawalDestination
//
// The destination is an immutable snapshot stored directly on the
// FinancialDisbursementEntity.
//
// It is NOT resolved through a configured FinancialDisbursementDestination
// record.
//
// Repository responsibilities:
//
// - Persist Financial Disbursement aggregates.
// - Rehydrate Financial Disbursement aggregates.
// - Retrieve disbursements by internal/public identity.
// - Retrieve disbursements by originating Financial Account Withdrawal.
// - Retrieve disbursements by source Financial Account.
// - Retrieve disbursements by originating business reference.
// - Retrieve disbursements by lifecycle status.
// - Retrieve disbursements associated with a Financial Transaction.
// - Locate a disbursement using provider callback correlation identifiers.
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
// FinancialDisbursementEntity.destination is an immutable destination
// snapshot supplied by the originating workflow.
//
// It does not reference a configured FinancialDisbursementDestinationEntity.
//
// FinancialDisbursementEntity.attempts is the authoritative attempt
// collection and must be fully rehydrated as part of the aggregate.
//
// withdrawalPublicId is an opaque public identity reference to the originating
// Financial Account Withdrawal.
//
// It is not a Prisma relation or internal persistence identifier.
//
// When supplied, withdrawalPublicId must be unique across disbursements.
// This allows the application to recover an existing disbursement when an
// event is delivered again.
//
// Provider callback correlation identifiers are internal persistence
// identifiers. They must not be exposed through REST response DTOs.
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

import type { FinancialProvider } from '../value-objects/financial-provider.vo';

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
   * The destination snapshot is persisted as part of the disbursement entity.
   *
   * When withdrawalPublicId is supplied, it must also be persisted and
   * protected by its unique database constraint.
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
  // Find by Public Identity
  // ===========================================================================

  /**
   * Finds a Financial Disbursement by its public identity.
   *
   * The returned aggregate must be fully rehydrated, including:
   *
   * - FinancialDisbursementEntity;
   * - immutable destination snapshot;
   * - all FinancialDisbursementAttemptEntity children.
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
  // Find by Originating Financial Account Withdrawal
  // ===========================================================================

  /**
   * Finds the Financial Disbursement created for an originating
   * Financial Account Withdrawal.
   *
   * withdrawalPublicId is an opaque public identity reference.
   *
   * The repository must use the unique withdrawalPublicId field persisted
   * on FinancialDisbursementEntity.
   *
   * This lookup supports idempotent event handling and recovery when
   * disbursement creation succeeds but linking the disbursement back to
   * the withdrawal fails.
   *
   * The returned aggregate must be fully rehydrated, including all attempts
   * and the immutable destination snapshot.
   *
   * Returns null when no disbursement exists for the supplied withdrawal.
   */
  findByWithdrawalPublicId(
    withdrawalPublicId: string,
  ): Promise<FinancialDisbursementAggregate | null>;

  // ===========================================================================
  // Find by Provider Originator Conversation ID
  // ===========================================================================

  /**
   * Finds the parent disbursement aggregate containing an attempt with the
   * supplied provider-scoped OriginatorConversationID.
   *
   * The provider must be included in the lookup so identifiers from different
   * providers cannot collide.
   *
   * The returned aggregate must be fully rehydrated, including all attempts
   * and the immutable destination snapshot.
   *
   * Returns null when no matching attempt exists.
   */
  findByProviderOriginatorConversationId(
    provider: FinancialProvider,
    originatorConversationId: string,
  ): Promise<FinancialDisbursementAggregate | null>;

  // ===========================================================================
  // Find by Provider Conversation ID
  // ===========================================================================

  /**
   * Finds the parent disbursement aggregate containing an attempt with the
   * supplied provider-scoped ConversationID.
   *
   * The returned aggregate must be fully rehydrated, including all attempts
   * and the immutable destination snapshot.
   *
   * Returns null when no matching attempt exists.
   */
  findByProviderConversationId(
    provider: FinancialProvider,
    conversationId: string,
  ): Promise<FinancialDisbursementAggregate | null>;

  // ===========================================================================
  // Find by Provider Transaction ID
  // ===========================================================================

  /**
   * Finds the parent disbursement aggregate containing an attempt with the
   * supplied provider-scoped TransactionID.
   *
   * This identifier is generally supplied in the provider's final result
   * callback. It must be treated as an opaque provider identifier.
   *
   * The returned aggregate must be fully rehydrated, including all attempts
   * and the immutable destination snapshot.
   *
   * Returns null when no matching attempt exists.
   */
  findByProviderTransactionId(
    provider: FinancialProvider,
    transactionId: string,
  ): Promise<FinancialDisbursementAggregate | null>;

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

// -----------------------------------------------------------------------------
// End of Repository Contract
// -----------------------------------------------------------------------------
