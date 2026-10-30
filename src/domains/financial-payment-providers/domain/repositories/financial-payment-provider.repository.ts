// -----------------------------------------------------------------------------
// Financial Payment Provider Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Financial Payment Provider aggregate.
//
// Aggregate ownership:
//
// FinancialPaymentProviderAggregate
// ├── FinancialPaymentProviderEntity
// └── FinancialPaymentProviderCapabilityEntity[]
//
// Responsibilities:
//
// - Create and persist provider aggregates.
// - Retrieve complete provider aggregates.
// - Query providers by type, status, environment, and capability.
// - Support provider code and public-ID existence checks.
// - Support operational-provider discovery.
//
// The repository does NOT:
//
// - Depend on Prisma or ORM models.
// - Execute provider APIs.
// - Store raw credentials.
// - Perform payment processing.
// - Manage payment or disbursement lifecycles.
//
// Infrastructure implementations must preserve aggregate invariants and
// persist the provider and its owned capabilities atomically.
// -----------------------------------------------------------------------------

import type { FinancialPaymentProviderAggregate } from '../aggregates/financial-payment-provider.aggregate';

import type { FinancialPaymentProviderPublicId } from '../value-objects/financial-payment-provider-public-id.vo';
import type { FinancialPaymentProviderCode } from '../value-objects/financial-payment-provider-code.vo';
import type { FinancialPaymentProviderType } from '../value-objects/financial-payment-provider-type.vo';
import type { FinancialPaymentProviderStatus } from '../value-objects/financial-payment-provider-status.vo';
import type { FinancialPaymentProviderEnvironment } from '../value-objects/financial-payment-provider-environment.vo';
import type { FinancialPaymentProviderCapabilityType } from '../value-objects/financial-payment-provider-capability-type.vo';

// =============================================================================
// Repository
// =============================================================================

export interface FinancialPaymentProviderRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a new provider aggregate and all its owned capabilities.
   *
   * The operation must be atomic.
   */
  create(aggregate: FinancialPaymentProviderAggregate): Promise<void>;

  /**
   * Persists changes to an existing provider aggregate.
   *
   * The provider and its capabilities must be synchronized atomically.
   */
  save(aggregate: FinancialPaymentProviderAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Retrieval
  // ===========================================================================

  /**
   * Finds a complete provider aggregate by internal persistence identity.
   *
   * Rehydration must not emit domain events.
   */
  findById(id: string): Promise<FinancialPaymentProviderAggregate | null>;

  /**
   * Finds a complete provider aggregate by public identity.
   *
   * Includes its owned capabilities.
   */
  findByPublicId(
    publicId: FinancialPaymentProviderPublicId,
  ): Promise<FinancialPaymentProviderAggregate | null>;

  /**
   * Finds a provider by its business code.
   *
   * The code is a domain value object, not a persistence identifier.
   */
  findByCode(
    code: FinancialPaymentProviderCode,
  ): Promise<FinancialPaymentProviderAggregate | null>;

  /**
   * Retrieves all provider aggregates, newest first.
   *
   * Each result includes its owned capabilities.
   */
  findAll(): Promise<FinancialPaymentProviderAggregate[]>;

  // ===========================================================================
  // Provider Classification
  // ===========================================================================

  /**
   * Finds providers by provider type.
   */
  findByType(
    type: FinancialPaymentProviderType,
  ): Promise<FinancialPaymentProviderAggregate[]>;

  /**
   * Finds providers by integration status.
   */
  findByStatus(
    status: FinancialPaymentProviderStatus,
  ): Promise<FinancialPaymentProviderAggregate[]>;

  /**
   * Finds providers configured for the specified environment.
   */
  findByEnvironment(
    environment: FinancialPaymentProviderEnvironment,
  ): Promise<FinancialPaymentProviderAggregate[]>;

  // ===========================================================================
  // Capability Queries
  // ===========================================================================

  /**
   * Finds providers configured with the requested capability.
   *
   * Results may include providers that are not currently operational.
   * Callers must check operational readiness before processing.
   */
  findByCapability(
    capabilityType: FinancialPaymentProviderCapabilityType,
  ): Promise<FinancialPaymentProviderAggregate[]>;

  /**
   * Finds providers that can currently perform the requested capability.
   *
   * Results must satisfy all of the following:
   *
   * - provider is enabled;
   * - provider integration status is READY;
   * - capability is supported;
   * - capability is enabled.
   *
   * Infrastructure should apply these conditions in its query and preserve
   * the same rules as the domain aggregate.
   */
  findOperationalByCapability(
    capabilityType: FinancialPaymentProviderCapabilityType,
  ): Promise<FinancialPaymentProviderAggregate[]>;

  // ===========================================================================
  // Operational Discovery
  // ===========================================================================

  /**
   * Finds enabled providers with READY integration status.
   *
   * This does not guarantee that every provider supports every capability.
   */
  findOperational(): Promise<FinancialPaymentProviderAggregate[]>;

  /**
   * Finds providers whose integration is not READY.
   */
  findNotReady(): Promise<FinancialPaymentProviderAggregate[]>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Determines whether a provider exists by public identity.
   */
  existsByPublicId(
    publicId: FinancialPaymentProviderPublicId,
  ): Promise<boolean>;

  /**
   * Determines whether a provider exists by business code.
   */
  existsByCode(code: FinancialPaymentProviderCode): Promise<boolean>;

  // ===========================================================================
  // Metrics
  // ===========================================================================

  /**
   * Counts all persisted payment providers.
   */
  count(): Promise<number>;

  /**
   * Counts providers by integration status.
   */
  countByStatus(status: FinancialPaymentProviderStatus): Promise<number>;

  /**
   * Counts providers by provider type.
   */
  countByType(type: FinancialPaymentProviderType): Promise<number>;
}
