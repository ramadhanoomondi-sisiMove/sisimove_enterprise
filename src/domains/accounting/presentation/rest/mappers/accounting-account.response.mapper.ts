// -----------------------------------------------------------------------------
// Accounting — Account Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the AccountingAccountAggregate / AccountingAccountEntity domain model
// into an application-facing AccountingAccountResponse.
//
// Aggregate:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// Mapping principles:
//
// - Expose Accounting Account-safe state.
// - Serialize value objects into primitives.
// - Expose the Accounting Account public identity.
// - Expose Accounting Account code.
// - Expose Accounting Account name.
// - Expose Accounting Account classification.
// - Expose Accounting Account lifecycle status.
// - Expose whether the account is operationally usable.
// - Expose whether the account can receive postings.
// - Expose whether the account can be modified.
// - Expose whether the account is a root account.
// - Expose whether the account has a parent account.
// - Expose lifecycle capability predicates.
// - Expose lifecycle/audit timestamps.
// - Do not expose internal persistence identifiers.
// - Do not expose internal parentAccountId.
// - Do not expose domain entities.
// - Do not expose value objects directly.
// - Do not access Prisma.
// - Do not access persistence models.
// - Do not resolve the parent Accounting Account.
// - Do not resolve another aggregate.
// - Do not evaluate authorization.
// - Do not perform business validation.
// - Do not mutate the aggregate.
// - Do not emit domain events.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map AccountingAccountAggregate -> AccountingAccountResponse.
// - Map AccountingAccountEntity -> AccountingAccountResponse.
// - Provide one canonical Accounting Account mapping implementation.
// - Convert Accounting Account value objects into primitive response values.
// - Expose safe lifecycle predicates.
// - Return defensive Date instances.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - Mutate the Accounting Account aggregate.
// - Persist the Accounting Account.
// - Access Prisma.
// - Access repositories.
// - Resolve parent accounts.
// - Resolve other aggregates.
// - Perform authorization.
// - Perform business validation.
// - Emit domain events.
// - Change Accounting Account lifecycle state.
//
// -----------------------------------------------------------------------------
//
// Identity:
//
// publicId is the externally safe Accounting Account identifier.
//
// The internal entity identity (`id`) is intentionally excluded.
//
// -----------------------------------------------------------------------------
//
// Account Hierarchy:
//
// parentAccountId is an internal UniqueEntityId.
//
// It is intentionally NOT exposed by this response mapper.
//
// The response exposes only safe structural information:
//
// - hasParentAccount;
// - isRootAccount.
//
// If a public parent-account reference is required later, the domain model
// should expose an explicit AccountingAccountPublicId rather than leaking the
// internal UniqueEntityId.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
// The mapper exposes:
//
// - status;
// - isActive;
// - isInactive;
// - isClosed;
// - isUsable;
// - canReceivePostings;
// - canBeModified;
// - canBeActivated;
// - canBeInactivated;
// - canBeClosed.
//
// These are read-only projections of the entity's existing domain predicates.
// The mapper does not calculate or alter lifecycle state.
//
// -----------------------------------------------------------------------------
//
// Dates:
//
// Date values are returned as defensive copies so callers cannot mutate the
// domain entity's Date instances through the response object.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { AccountingAccountAggregate } from '../../../domain/aggregates/accounting-account.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { AccountingAccountEntity } from '../../../domain/entities/accounting-account.entity';

// =============================================================================
// Response
// =============================================================================

export interface AccountingAccountResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Accounting Account aggregate.
   *
   * This is the externally safe Accounting Account identifier.
   */
  publicId: string;

  // ---------------------------------------------------------------------------
  // Account
  // ---------------------------------------------------------------------------

  /**
   * Unique accounting account code.
   */
  code: string;

  /**
   * Human-readable accounting account name.
   */
  name: string;

  /**
   * Accounting account classification.
   *
   * Examples:
   *
   * - ASSET
   * - LIABILITY
   * - EQUITY
   * - REVENUE
   * - EXPENSE
   */
  type: string;

  // ---------------------------------------------------------------------------
  // Hierarchy
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether this account has a parent Accounting Account.
   *
   * The internal parent account identity is intentionally not exposed.
   */
  hasParentAccount: boolean;

  /**
   * Indicates whether this account is a root account.
   *
   * A root account has no parent account.
   */
  isRootAccount: boolean;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current Accounting Account lifecycle status.
   */
  status: string;

  /**
   * Indicates whether the Accounting Account is active.
   */
  isActive: boolean;

  /**
   * Indicates whether the Accounting Account is inactive.
   */
  isInactive: boolean;

  /**
   * Indicates whether the Accounting Account is closed.
   */
  isClosed: boolean;

  /**
   * Indicates whether the Accounting Account is operationally usable.
   *
   * Only ACTIVE accounts are operationally usable.
   */
  isUsable: boolean;

  /**
   * Indicates whether the Accounting Account can receive new journal postings.
   */
  canReceivePostings: boolean;

  /**
   * Indicates whether the Accounting Account can currently be modified.
   */
  canBeModified: boolean;

  /**
   * Indicates whether the Accounting Account can be activated.
   */
  canBeActivated: boolean;

  /**
   * Indicates whether the Accounting Account can be inactivated.
   */
  canBeInactivated: boolean;

  /**
   * Indicates whether the Accounting Account can be closed.
   */
  canBeClosed: boolean;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Accounting Account was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the Accounting Account was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class AccountingAccountResponseMapper {
  // ===========================================================================
  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps an AccountingAccountAggregate into an
   * AccountingAccountResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(
    aggregate: AccountingAccountAggregate,
  ): AccountingAccountResponse {
    if (aggregate === undefined) {
      throw new Error('Accounting Account aggregate is required.');
    }

    return this.mapAccount(aggregate.account);
  }

  // ===========================================================================
  // Entity -> Response
  // ===========================================================================

  /**
   * Maps an AccountingAccountEntity directly into an
   * AccountingAccountResponse.
   *
   * Useful for application/read workflows where the aggregate wrapper is not
   * required by the caller.
   */
  public static fromEntity(
    account: AccountingAccountEntity,
  ): AccountingAccountResponse {
    if (account === undefined) {
      throw new Error('Accounting Account entity is required.');
    }

    return this.mapAccount(account);
  }

  // ===========================================================================
  // Internal Account Mapping
  // ===========================================================================

  /**
   * Maps the AccountingAccountEntity portion of the Accounting Account
   * aggregate.
   *
   * This is the single canonical implementation used by both:
   *
   * - toResponse();
   * - fromEntity();
   *
   * Keeping the mapping centralized prevents aggregate and entity response
   * paths from drifting apart.
   */
  private static mapAccount(
    account: AccountingAccountEntity,
  ): AccountingAccountResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: account.publicId.value,

      // -----------------------------------------------------------------------
      // Account
      // -----------------------------------------------------------------------

      code: account.code.value,

      name: account.name.value,

      type: account.type.value,

      // -----------------------------------------------------------------------
      // Hierarchy
      // -----------------------------------------------------------------------

      hasParentAccount: account.hasParentAccount(),

      isRootAccount: !account.hasParentAccount(),

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: account.status.value,

      isActive: account.isActive(),

      isInactive: account.isInactive(),

      isClosed: account.isClosed(),

      isUsable: account.isUsable(),

      canReceivePostings: account.canReceivePostings(),

      canBeModified: account.canBeModified(),

      canBeActivated: account.canBeActivated(),

      canBeInactivated: account.canBeInactivated(),

      canBeClosed: account.canBeClosed(),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(account.createdAt.getTime()),

      updatedAt: new Date(account.updatedAt.getTime()),
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingAccountResponseMapper;
