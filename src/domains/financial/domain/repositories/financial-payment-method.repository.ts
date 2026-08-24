// src/domains/financial/domain/repositories/financial-payment-method.repository.ts

// -----------------------------------------------------------------------------
// Financial Payment Method Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Financial Payment Method aggregate.
//
// Aggregate ownership:
//
// FinancialPaymentMethodAggregate
// └── FinancialPaymentMethodEntity
//
// Responsibilities:
// - Persist Financial Payment Method aggregates.
// - Retrieve Financial Payment Method aggregates.
// - Support payment-method identity lookup.
// - Support Financial Account ownership lookup.
// - Support provider lookup.
// - Support provider-reference lookup.
// - Support default-payment-method lookup.
// - Support active/inactive availability queries.
// - Support existence checks.
//
// This interface belongs entirely to the Financial domain.
//
// It does NOT:
// - Depend on Prisma.
// - Depend on ORM models.
// - Depend on provider SDKs.
// - Execute provider APIs.
// - Execute Financial Payments.
// - Modify Financial Account balances.
// - Move money.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodAggregate } from '../aggregates/financial-payment-method.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodEntity } from '../entities/financial-payment-method.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import type { FinancialPaymentMethodPublicId } from '../value-objects/financial-payment-method-public-id.vo';

import type { FinancialPaymentMethodType } from '../value-objects/financial-payment-method-type.vo';

import type { FinancialProvider } from '../value-objects/financial-provider.vo';

import type { FinancialProviderReference } from '../value-objects/financial-provider-reference.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

export interface FinancialPaymentMethodRepository {
  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------

  /**
   * Persists a Financial Payment Method aggregate.
   *
   * The repository implementation is responsible for translating the
   * aggregate into its persistence representation.
   */
  save(aggregate: FinancialPaymentMethodAggregate): Promise<void>;

  /**
   * Removes a Financial Payment Method aggregate.
   */
  delete(aggregate: FinancialPaymentMethodAggregate): Promise<void>;

  // ---------------------------------------------------------------------------
  // Aggregate Queries
  // ---------------------------------------------------------------------------

  /**
   * Finds a Financial Payment Method aggregate by its public identifier.
   */
  findByPublicId(
    publicId: FinancialPaymentMethodPublicId,
  ): Promise<FinancialPaymentMethodAggregate | null>;

  /**
   * Finds all Financial Payment Method aggregates belonging to a
   * Financial Account.
   *
   * Uses the Financial Account public identifier because the owning
   * Financial Account is a separate aggregate.
   */
  findByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialPaymentMethodAggregate[]>;

  /**
   * Finds all active Financial Payment Method aggregates belonging to
   * a Financial Account.
   */
  findActiveByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialPaymentMethodAggregate[]>;

  /**
   * Finds the default Financial Payment Method belonging to a
   * Financial Account.
   *
   * Returns null when the account has no default payment method.
   *
   * The application/domain coordination boundary is responsible for
   * enforcing that an account has at most one default payment method.
   */
  findDefaultByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialPaymentMethodAggregate | null>;

  /**
   * Finds all Financial Payment Method aggregates using a specific
   * external financial provider.
   */
  findByProvider(
    provider: FinancialProvider,
  ): Promise<FinancialPaymentMethodAggregate[]>;

  /**
   * Finds all payment methods belonging to an account and using a
   * specific external financial provider.
   */
  findByAccountPublicIdAndProvider(
    accountPublicId: FinancialAccountPublicId,
    provider: FinancialProvider,
  ): Promise<FinancialPaymentMethodAggregate[]>;

  /**
   * Finds a Financial Payment Method by the external provider reference.
   *
   * The provider is included because provider references are opaque and
   * their uniqueness is normally scoped to the provider.
   */
  findByProviderAndProviderReference(
    provider: FinancialProvider,
    providerReference: FinancialProviderReference,
  ): Promise<FinancialPaymentMethodAggregate | null>;

  /**
   * Finds a Financial Payment Method by account, provider, and provider
   * reference.
   *
   * This provides the strongest ownership-scoped lookup for an external
   * funding instrument.
   */
  findByAccountPublicIdAndProviderAndProviderReference(
    accountPublicId: FinancialAccountPublicId,
    provider: FinancialProvider,
    providerReference: FinancialProviderReference,
  ): Promise<FinancialPaymentMethodAggregate | null>;

  // ---------------------------------------------------------------------------
  // Entity Queries
  // ---------------------------------------------------------------------------

  /**
   * Finds a Financial Payment Method entity by its public identifier.
   *
   * This returns the aggregate root entity without wrapping it in the
   * aggregate.
   */
  findEntityByPublicId(
    publicId: FinancialPaymentMethodPublicId,
  ): Promise<FinancialPaymentMethodEntity | null>;

  /**
   * Finds a Financial Payment Method entity by its internal identifier.
   *
   * Intended primarily for persistence-oriented and infrastructure
   * operations.
   */
  findEntityById(
    id: UniqueEntityId,
  ): Promise<FinancialPaymentMethodEntity | null>;

  /**
   * Finds a Financial Payment Method entity by its owning Financial
   * Account internal identifier.
   *
   * Intended primarily for infrastructure and persistence operations.
   */
  findEntityByAccountId(
    accountId: UniqueEntityId,
  ): Promise<FinancialPaymentMethodEntity[]>;

  // ---------------------------------------------------------------------------
  // Type Queries
  // ---------------------------------------------------------------------------

  /**
   * Finds payment methods belonging to an account by payment-method type.
   */
  findByAccountPublicIdAndType(
    accountPublicId: FinancialAccountPublicId,
    type: FinancialPaymentMethodType,
  ): Promise<FinancialPaymentMethodAggregate[]>;

  /**
   * Finds active payment methods belonging to an account by
   * payment-method type.
   */
  findActiveByAccountPublicIdAndType(
    accountPublicId: FinancialAccountPublicId,
    type: FinancialPaymentMethodType,
  ): Promise<FinancialPaymentMethodAggregate[]>;

  // ---------------------------------------------------------------------------
  // Availability Queries
  // ---------------------------------------------------------------------------

  /**
   * Finds all active Financial Payment Method aggregates.
   *
   * This query is useful for operational and administrative workflows.
   */
  findActive(): Promise<FinancialPaymentMethodAggregate[]>;

  /**
   * Finds all inactive Financial Payment Method aggregates.
   *
   * This query is useful for operational and administrative workflows.
   */
  findInactive(): Promise<FinancialPaymentMethodAggregate[]>;

  // ---------------------------------------------------------------------------
  // Existence
  // ---------------------------------------------------------------------------

  /**
   * Returns true if a Financial Payment Method exists for the supplied
   * public identifier.
   */
  existsByPublicId(publicId: FinancialPaymentMethodPublicId): Promise<boolean>;

  /**
   * Returns true if a Financial Payment Method exists for the supplied
   * internal identifier.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if an active Financial Payment Method exists for the
   * supplied Financial Account.
   */
  existsActiveByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if a default Financial Payment Method exists for the
   * supplied Financial Account.
   */
  existsDefaultByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if a Financial Payment Method exists for the supplied
   * provider and provider reference.
   */
  existsByProviderAndProviderReference(
    provider: FinancialProvider,
    providerReference: FinancialProviderReference,
  ): Promise<boolean>;
}
