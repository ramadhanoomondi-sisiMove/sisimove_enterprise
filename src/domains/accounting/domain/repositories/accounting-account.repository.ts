// -----------------------------------------------------------------------------
// Accounting — Account Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Accounting Account aggregate.
//
// Aggregate ownership:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// Accounting Account is an independent aggregate responsible for the
// lifecycle, classification, and hierarchy reference of exactly one
// accounting account.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist Accounting Account aggregates.
// - Retrieve Accounting Account aggregates.
// - Support Accounting Account public-identity lookup.
// - Support Accounting Account internal-identity lookup.
// - Support account-code lookup.
// - Support account-name lookup.
// - Support account-type queries.
// - Support account-status queries.
// - Support active/inactive/closed queries.
// - Support usable-account queries.
// - Support posting-eligibility queries.
// - Support parent-account hierarchy queries.
// - Support root-account queries.
// - Support child-account queries.
// - Support entity-level persistence lookups.
// - Support audit queries.
// - Support existence checks.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
//
// - Depend on Prisma.
// - Depend on ORM models.
// - Calculate account balances.
// - Create journal entries.
// - Create journal lines.
// - Post journals.
// - Reverse journals.
// - Validate journal balancing.
// - Load or validate another Accounting Account aggregate.
// - Validate parent-account existence.
// - Perform authorization checks.
// - Perform application orchestration.
// - Communicate with external systems.
// - Record domain events.
// - Publish domain events.
//
// Cross-aggregate validation and orchestration belong to the application/domain
// workflow.
//
// Persistence belongs to infrastructure.
//
// Authorization belongs to the application/presentation boundary.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundaries:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// -----------------------------------------------------------------------------
//
// Cross-aggregate references:
//
// - parentAccountId
//
// The parent account reference is opaque to this repository contract.
//
// The repository may query accounts by parentAccountId, but it must not load
// or validate the parent Accounting Account as part of another aggregate.
//
// -----------------------------------------------------------------------------
//
// Account hierarchy:
//
// An Accounting Account may optionally reference one parent Accounting Account.
//
// The repository may:
//
// - find accounts by parent account;
// - find root accounts;
// - find child accounts;
// - determine whether an account has children.
//
// The repository must not construct an in-memory aggregate hierarchy.
//
// -----------------------------------------------------------------------------
//
// Posting:
//
// `canReceivePostings()` is an aggregate/entity capability.
//
// Repository queries such as `findPostingEligible()` may use persisted account
// lifecycle state to locate accounts that are currently eligible for posting.
//
// The repository does not create or post journal entries.
//
// -----------------------------------------------------------------------------
//
// Persistence uniqueness:
//
// The persistence model should normally enforce:
//
//     UNIQUE(publicId)
//     UNIQUE(code)
//
// Additional persistence constraints should protect the intended
// Accounting Account invariants.
//
// -----------------------------------------------------------------------------
//
// Domain events:
//
// Domain-event recording and publication are not repository responsibilities.
//
// The application/infrastructure event boundary is responsible for dispatching
// events after successful persistence according to the transaction strategy.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { AccountingAccountAggregate } from '../aggregates/accounting-account.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { AccountingAccountEntity } from '../entities/accounting-account.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AccountingAccountCode } from '../value-objects/accounting-account-code.vo';

import type { AccountingAccountName } from '../value-objects/accounting-account-name.vo';

import type { AccountingAccountType } from '../value-objects/accounting-account-type.vo';

import type { AccountingAccountStatus } from '../value-objects/accounting-account-status.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

export interface AccountingAccountRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists an Accounting Account aggregate.
   */
  save(aggregate: AccountingAccountAggregate): Promise<void>;

  /**
   * Removes an Accounting Account aggregate.
   */
  delete(aggregate: AccountingAccountAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds an Accounting Account aggregate by its public identifier.
   */
  findByPublicId(
    publicId: AccountingAccountEntity['publicId'],
  ): Promise<AccountingAccountAggregate | null>;

  /**
   * Finds an Accounting Account aggregate by its internal identifier.
   */
  findById(id: UniqueEntityId): Promise<AccountingAccountAggregate | null>;

  /**
   * Finds an Accounting Account aggregate by its account code.
   *
   * Account code is expected to be unique at the persistence boundary.
   */
  findByCode(
    code: AccountingAccountCode,
  ): Promise<AccountingAccountAggregate | null>;

  /**
   * Finds an Accounting Account aggregate by its account name.
   *
   * Account names are not necessarily unique unless the persistence model
   * explicitly enforces such a constraint.
   */
  findByName(
    name: AccountingAccountName,
  ): Promise<AccountingAccountAggregate | null>;

  /**
   * Finds all Accounting Account aggregates of the supplied type.
   */
  findByType(
    type: AccountingAccountType,
  ): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds all Accounting Account aggregates with the supplied lifecycle
   * status.
   */
  findByStatus(
    status: AccountingAccountStatus,
  ): Promise<AccountingAccountAggregate[]>;

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds an Accounting Account entity by its public identifier.
   */
  findEntityByPublicId(
    publicId: AccountingAccountEntity['publicId'],
  ): Promise<AccountingAccountEntity | null>;

  /**
   * Finds an Accounting Account entity by its internal identifier.
   */
  findEntityById(id: UniqueEntityId): Promise<AccountingAccountEntity | null>;

  /**
   * Finds an Accounting Account entity by its account code.
   */
  findEntityByCode(
    code: AccountingAccountCode,
  ): Promise<AccountingAccountEntity | null>;

  /**
   * Finds an Accounting Account entity by its account name.
   */
  findEntityByName(
    name: AccountingAccountName,
  ): Promise<AccountingAccountEntity | null>;

  // ===========================================================================
  // Status Queries
  // ===========================================================================

  /**
   * Finds all active Accounting Accounts.
   */
  findActive(): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds all inactive Accounting Accounts.
   */
  findInactive(): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds all closed Accounting Accounts.
   */
  findClosed(): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds all Accounting Accounts that are currently usable.
   *
   * Usability follows the persisted Accounting Account lifecycle state.
   */
  findUsable(): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds all Accounting Accounts that can currently receive postings.
   *
   * This query is limited to the persisted account state and does not
   * validate any journal, period, or cross-aggregate condition.
   */
  findPostingEligible(): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds all Accounting Accounts that cannot currently receive postings.
   */
  findPostingIneligible(): Promise<AccountingAccountAggregate[]>;

  // ===========================================================================
  // Hierarchy Queries
  // ===========================================================================

  /**
   * Finds all Accounting Accounts whose parent is the supplied account.
   *
   * The supplied parent identifier is treated as an opaque aggregate
   * reference.
   */
  findByParentAccountId(
    parentAccountId: UniqueEntityId,
  ): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds all Accounting Account entities whose parent is the supplied
   * account.
   */
  findEntitiesByParentAccountId(
    parentAccountId: UniqueEntityId,
  ): Promise<AccountingAccountEntity[]>;

  /**
   * Finds all Accounting Accounts that do not have a parent account.
   */
  findRootAccounts(): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds all Accounting Accounts that have a parent account.
   */
  findChildAccounts(): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds all Accounting Accounts belonging directly to the supplied parent
   * account and having the supplied lifecycle status.
   */
  findByParentAccountIdAndStatus(
    parentAccountId: UniqueEntityId,
    status: AccountingAccountStatus,
  ): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds all Accounting Accounts belonging directly to the supplied parent
   * account and having the supplied account type.
   */
  findByParentAccountIdAndType(
    parentAccountId: UniqueEntityId,
    type: AccountingAccountType,
  ): Promise<AccountingAccountAggregate[]>;

  // ===========================================================================
  // Hierarchy Existence
  // ===========================================================================

  /**
   * Returns true if at least one Accounting Account has the supplied account
   * as its parent.
   */
  existsByParentAccountId(parentAccountId: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if the supplied Accounting Account has no child accounts.
   *
   * This is useful when application workflows need to determine whether an
   * account can safely participate in hierarchy changes.
   */
  hasNoChildren(accountId: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if the supplied Accounting Account has at least one child.
   */
  hasChildren(accountId: UniqueEntityId): Promise<boolean>;

  // ===========================================================================
  // Audit Queries
  // ===========================================================================

  /**
   * Finds all Accounting Accounts created after the supplied timestamp.
   */
  findCreatedAfter(createdAfter: Date): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds all Accounting Accounts created before the supplied timestamp.
   */
  findCreatedBefore(createdBefore: Date): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds all Accounting Accounts updated after the supplied timestamp.
   */
  findUpdatedAfter(updatedAfter: Date): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds all Accounting Accounts updated before the supplied timestamp.
   */
  findUpdatedBefore(updatedBefore: Date): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds Accounting Accounts ordered by creation time.
   *
   * Implementations should define and document the ordering direction.
   */
  findAllOrderedByCreatedAt(): Promise<AccountingAccountAggregate[]>;

  /**
   * Finds Accounting Accounts ordered by account code.
   */
  findAllOrderedByCode(): Promise<AccountingAccountAggregate[]>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Returns true if an Accounting Account exists with the supplied public
   * identifier.
   */
  existsByPublicId(
    publicId: AccountingAccountEntity['publicId'],
  ): Promise<boolean>;

  /**
   * Returns true if an Accounting Account exists with the supplied internal
   * identifier.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if an Accounting Account exists with the supplied account
   * code.
   */
  existsByCode(code: AccountingAccountCode): Promise<boolean>;

  /**
   * Returns true if an Accounting Account exists with the supplied account
   * name.
   */
  existsByName(name: AccountingAccountName): Promise<boolean>;

  /**
   * Returns true if at least one Accounting Account exists with the supplied
   * account type.
   */
  existsByType(type: AccountingAccountType): Promise<boolean>;

  /**
   * Returns true if at least one Accounting Account exists with the supplied
   * lifecycle status.
   */
  existsByStatus(status: AccountingAccountStatus): Promise<boolean>;

  /**
   * Returns true if at least one active Accounting Account exists.
   */
  existsActive(): Promise<boolean>;

  /**
   * Returns true if at least one inactive Accounting Account exists.
   */
  existsInactive(): Promise<boolean>;

  /**
   * Returns true if at least one closed Accounting Account exists.
   */
  existsClosed(): Promise<boolean>;

  /**
   * Returns true if at least one usable Accounting Account exists.
   */
  existsUsable(): Promise<boolean>;

  /**
   * Returns true if at least one Accounting Account can currently receive
   * postings.
   */
  existsPostingEligible(): Promise<boolean>;

  /**
   * Returns true if at least one root Accounting Account exists.
   */
  existsRootAccount(): Promise<boolean>;

  /**
   * Returns true if at least one child Accounting Account exists.
   */
  existsChildAccount(): Promise<boolean>;

  /**
   * Returns true if at least one child Accounting Account exists for the
   * supplied parent account.
   */
  existsByParentAccountId(parentAccountId: UniqueEntityId): Promise<boolean>;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingAccountRepository;
