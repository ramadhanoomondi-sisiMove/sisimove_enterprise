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
   * Physical deletion is normally unsupported for financial records.
   */
  delete(aggregate: FinancialAccountWithdrawalAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds a Financial Account Withdrawal aggregate by public identifier.
   */
  findByPublicId(
    publicId: FinancialAccountWithdrawalPublicId,
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
