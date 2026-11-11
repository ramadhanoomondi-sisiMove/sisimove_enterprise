// -----------------------------------------------------------------------------
// Financial Account Withdrawal Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Financial Account Withdrawal aggregate.
//
// Persistence model:
//
// FinancialAccountWithdrawal
// ├── FinancialAccount
// ├── destinationType
// ├── destinationValue
// ├── disbursementPublicId
// └── transactionPublicId
//
// The withdrawal destination is an immutable snapshot.
//
// It is NOT a relation to FinancialDisbursementDestination.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalAggregate } from '../aggregates/financial-account-withdrawal.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalEntity } from '../entities/financial-account-withdrawal.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalPublicId } from '../value-objects/financial-account-withdrawal-public-id.vo';

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import type { FinancialReferenceType } from '../value-objects/financial-reference-type.vo';

import type { FinancialReferencePublicId } from '../value-objects/financial-reference-public-id.vo';

import type { FinancialAccountWithdrawalStatus } from '../value-objects/financial-account-withdrawal-status.vo';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

export interface FinancialAccountWithdrawalRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Financial Account Withdrawal aggregate.
   */
  save(aggregate: FinancialAccountWithdrawalAggregate): Promise<void>;

  /**
   * Persists a withdrawal's transition from PENDING to PROCESSING only when
   * the persisted record is still PENDING.
   *
   * This is a conditional persistence operation used to prevent two concurrent
   * processing commands from both winning the same lifecycle transition.
   *
   * Returns true when this call changed and persisted the record.
   * Returns false when the record was no longer PENDING.
   *
   * The aggregate must already have performed and validated its domain
   * transition before this method is called.
   *
   * The operation participates in the ambient UnitOfWork and does not create
   * its own transaction.
   */
  saveIfPending(
    aggregate: FinancialAccountWithdrawalAggregate,
  ): Promise<boolean>;

  /**
   * Conditionally links a Financial Disbursement to a withdrawal.
   *
   * The withdrawal must still be in PROCESSING status.
   *
   * The operation must not overwrite an existing link to a different
   * Financial Disbursement.
   *
   * If the withdrawal is already linked to the supplied disbursement,
   * the operation is considered successful and returns true.
   *
   * Returns false when:
   * - The withdrawal does not exist.
   * - The withdrawal is no longer PROCESSING.
   * - The withdrawal is already linked to a different disbursement.
   *
   * This operation updates only the disbursement link and its update
   * timestamp. It must not overwrite other withdrawal lifecycle fields.
   *
   * The operation participates in the ambient UnitOfWork and does not create
   * its own transaction.
   */
  linkDisbursementIfProcessing(
    withdrawalPublicId: FinancialAccountWithdrawalPublicId,
    disbursementPublicId: string,
  ): Promise<boolean>;

  /**
   * Physical deletion is normally unsupported for financial records.
   */
  delete(aggregate: FinancialAccountWithdrawalAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds all Financial Account Withdrawal aggregates across the platform.
   *
   * Intended for platform-wide administrative queries and withdrawal
   * oversight across all Financial Accounts.
   */
  findAll(): Promise<FinancialAccountWithdrawalAggregate[]>;

  /**
   * Finds a Financial Account Withdrawal aggregate by public identifier.
   */
  findByPublicId(
    publicId: FinancialAccountWithdrawalPublicId,
  ): Promise<FinancialAccountWithdrawalAggregate | null>;

  /**
   * Finds a Financial Account Withdrawal using the owning account and
   * its idempotency key.
   *
   * Idempotency keys are unique within an account, not globally.
   *
   * Returns null when no withdrawal exists for the supplied combination.
   */
  findByAccountPublicIdAndIdempotencyKey(
    accountPublicId: FinancialAccountPublicId,
    idempotencyKey: string,
  ): Promise<FinancialAccountWithdrawalAggregate | null>;

  /**
   * Finds all Financial Account Withdrawals belonging to a Financial Account.
   */
  findByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountWithdrawalAggregate[]>;

  /**
   * Finds all withdrawals for an account in the supplied lifecycle status.
   */
  findByAccountPublicIdAndStatus(
    accountPublicId: FinancialAccountPublicId,
    status: FinancialAccountWithdrawalStatus,
  ): Promise<FinancialAccountWithdrawalAggregate[]>;

  /**
   * Finds all withdrawals in the supplied lifecycle status.
   */
  findByStatus(
    status: FinancialAccountWithdrawalStatus,
  ): Promise<FinancialAccountWithdrawalAggregate[]>;

  /**
   * Finds a withdrawal by its opaque Financial Disbursement public ID.
   */
  findByDisbursementPublicId(
    disbursementPublicId: string,
  ): Promise<FinancialAccountWithdrawalAggregate | null>;

  /**
   * Finds withdrawals associated with a business reference.
   */
  findByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<FinancialAccountWithdrawalAggregate[]>;

  /**
   * Finds all pending withdrawals belonging to an account.
   */
  findPendingByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountWithdrawalAggregate[]>;

  /**
   * Finds all processing withdrawals belonging to an account.
   */
  findProcessingByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountWithdrawalAggregate[]>;

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds a Financial Account Withdrawal entity by public identifier.
   */
  findEntityByPublicId(
    publicId: FinancialAccountWithdrawalPublicId,
  ): Promise<FinancialAccountWithdrawalEntity | null>;

  /**
   * Finds a Financial Account Withdrawal entity by opaque Financial
   * Disbursement public ID.
   */
  findEntityByDisbursementPublicId(
    disbursementPublicId: string,
  ): Promise<FinancialAccountWithdrawalEntity | null>;

  /**
   * Finds all withdrawal entities belonging to a Financial Account.
   */
  findEntitiesByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountWithdrawalEntity[]>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Returns true when a withdrawal exists for the supplied public ID.
   */
  existsByPublicId(
    publicId: FinancialAccountWithdrawalPublicId,
  ): Promise<boolean>;

  /**
   * Returns true when a withdrawal is associated with the supplied
   * Financial Disbursement public ID.
   */
  existsByDisbursementPublicId(disbursementPublicId: string): Promise<boolean>;

  /**
   * Returns true when the supplied account has at least one withdrawal.
   */
  existsByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<boolean>;
}
