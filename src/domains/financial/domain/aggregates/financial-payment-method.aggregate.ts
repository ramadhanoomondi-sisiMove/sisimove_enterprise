// -----------------------------------------------------------------------------
// Financial Payment Method Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate root for a Financial Payment Method.
//
// Responsibilities:
// - Own the Financial Payment Method entity.
// - Enforce payment-method aggregate invariants.
// - Coordinate payment-method lifecycle changes.
// - Emit Financial Payment Method domain events.
//
// This aggregate does NOT:
// - Execute external provider operations.
// - Communicate with payment providers.
// - Modify Financial Account balances.
// - Modify sibling Financial Payment Methods.
// - Move money.
// - Persist itself.
//
// Coordination of the Financial Account's single-default-method invariant
// belongs to the appropriate application/domain service boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodEntity } from '../entities/financial-payment-method.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodAddedEvent } from '../events/financial-payment-method-added.event';

import { FinancialPaymentMethodDefaultedEvent } from '../events/financial-payment-method-defaulted.event';

import { FinancialPaymentMethodDeactivatedEvent } from '../events/financial-payment-method-deactivated.event';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodException } from '../exceptions/financial-payment-method.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import type { FinancialPaymentMethodPublicId } from '../value-objects/financial-payment-method-public-id.vo';

import type { FinancialPaymentMethodType } from '../value-objects/financial-payment-method-type.vo';

import type { FinancialProvider } from '../value-objects/financial-provider.vo';

import type { FinancialProviderReference } from '../value-objects/financial-provider-reference.vo';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

interface FinancialPaymentMethodAggregateProps {
  paymentMethod: FinancialPaymentMethodEntity;
}

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

export class FinancialPaymentMethodAggregate extends AggregateRoot<FinancialPaymentMethodAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: FinancialPaymentMethodAggregateProps) {
    super(props);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a brand-new Financial Payment Method aggregate.
   *
   * The FinancialPaymentMethodEntity is expected to already contain the
   * complete initial state established by the entity factory.
   *
   * Creation does not automatically emit the Added event.
   *
   * The application boundary explicitly calls recordCreated() after the
   * aggregate has been successfully created.
   */
  public static create(
    paymentMethod: FinancialPaymentMethodEntity,
  ): FinancialPaymentMethodAggregate {
    return new FinancialPaymentMethodAggregate({
      paymentMethod,
    });
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a Financial Payment Method aggregate from persistence.
   *
   * Domain events are intentionally not emitted during rehydration.
   */
  public static rehydrate(
    paymentMethod: FinancialPaymentMethodEntity,
  ): FinancialPaymentMethodAggregate {
    return new FinancialPaymentMethodAggregate({
      paymentMethod,
    });
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the Financial Payment Method entity owned by this aggregate.
   *
   * Application services should prefer aggregate behavior methods over directly
   * mutating the returned entity.
   */
  public get paymentMethod(): FinancialPaymentMethodEntity {
    return this.props.paymentMethod;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal aggregate identity.
   *
   * Used by persistence and DomainEvent.metadata.aggregateId.
   */
  public override get id() {
    return this.paymentMethod.id;
  }

  /**
   * Public identity of the Financial Payment Method.
   */
  public override get publicId(): FinancialPaymentMethodPublicId {
    return this.paymentMethod.publicId;
  }

  // ===========================================================================
  // Account Reference
  // ===========================================================================

  /**
   * Public identity of the owning Financial Account.
   *
   * This is intentionally an opaque cross-aggregate reference.
   *
   * The Financial Account aggregate itself is never embedded inside this
   * aggregate.
   */
  public get accountId(): FinancialAccountPublicId {
    return this.paymentMethod.accountPublicId;
  }

  // ===========================================================================
  // Payment Method State
  // ===========================================================================

  /**
   * Payment method type.
   */
  public get type(): FinancialPaymentMethodType {
    return this.paymentMethod.type;
  }

  /**
   * External financial provider.
   */
  public get provider(): FinancialProvider {
    return this.paymentMethod.provider;
  }

  /**
   * Provider-issued reference.
   *
   * This is an opaque reference and must never contain raw credentials.
   */
  public get providerReference(): FinancialProviderReference | undefined {
    return this.paymentMethod.providerReference;
  }

  /**
   * Safe human-readable display name.
   */
  public get displayName(): string | undefined {
    return this.paymentMethod.displayName;
  }

  /**
   * Safe masked identifier suffix.
   */
  public get lastFour(): string | undefined {
    return this.paymentMethod.lastFour;
  }

  // ===========================================================================
  // Lifecycle State
  // ===========================================================================

  /**
   * Whether this payment method is the default method.
   */
  public get isDefault(): boolean {
    return this.paymentMethod.isDefault;
  }

  /**
   * Whether this payment method is active.
   */
  public get isActive(): boolean {
    return this.paymentMethod.isActive;
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Entity creation timestamp.
   */
  public get createdAt(): Date {
    return this.paymentMethod.createdAt;
  }

  /**
   * Entity last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.paymentMethod.updatedAt;
  }

  // ===========================================================================
  // Queries
  // ===========================================================================

  /**
   * Determines whether the payment method is active.
   */
  public isActiveMethod(): boolean {
    return this.paymentMethod.isActive;
  }

  /**
   * Determines whether the payment method is inactive.
   */
  public isInactiveMethod(): boolean {
    return !this.paymentMethod.isActive;
  }

  /**
   * Determines whether the payment method is the default method.
   */
  public isDefaultMethod(): boolean {
    return this.paymentMethod.isDefault;
  }

  /**
   * Determines whether the payment method can currently be used for a new
   * Financial Payment.
   */
  public canBeUsed(): boolean {
    return this.paymentMethod.canBeUsed();
  }

  /**
   * Determines whether the payment method is simultaneously active and
   * default.
   */
  public isActiveDefault(): boolean {
    return this.paymentMethod.isActiveDefault();
  }

  // ===========================================================================
  // Creation
  // ===========================================================================

  /**
   * Records creation of the Financial Payment Method.
   *
   * This emits FinancialPaymentMethodAddedEvent using the state already
   * established by the entity factory.
   *
   * No external provider operation is performed here.
   * No money is moved here.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.addDomainEvent(
      new FinancialPaymentMethodAddedEvent(
        this.id.value,
        this.publicId,
        this.accountId,
        this.type,
        this.provider,
        this.providerReference,
        this.displayName,
        this.lastFour,
        this.isDefault,
        this.isActive,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Default Lifecycle
  // ===========================================================================

  /**
   * Marks this payment method as the default payment method.
   *
   * IMPORTANT:
   *
   * This aggregate does not unset the default flag on another payment method.
   *
   * The Financial Account-level invariant:
   *
   *     one account -> at most one default payment method
   *
   * is a cross-aggregate concern and must be coordinated by the appropriate
   * application/domain service boundary.
   *
   * If this method is already the default method, the operation is idempotent
   * and no event is emitted.
   */
  public default(
    defaultedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    // -------------------------------------------------------------------------
    // Active-state invariant
    // -------------------------------------------------------------------------

    if (!this.paymentMethod.isActive) {
      throw new FinancialPaymentMethodException(
        'An inactive Financial Payment Method cannot become the default method',
      );
    }

    // -------------------------------------------------------------------------
    // Idempotency
    // -------------------------------------------------------------------------

    if (this.paymentMethod.isDefault) {
      return;
    }

    // -------------------------------------------------------------------------
    // State Mutation
    // -------------------------------------------------------------------------

    this.paymentMethod.markAsDefault();

    this.paymentMethod.setUpdatedAt(defaultedAt);

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new FinancialPaymentMethodDefaultedEvent(
        this.id.value,
        this.publicId,
        this.accountId,
        this.type,
        this.provider,
        defaultedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Clear Default
  // ===========================================================================

  /**
   * Removes the default designation from this Financial Payment Method.
   *
   * This operation exists at the aggregate boundary so application services
   * do not directly mutate the aggregate's entity.
   *
   * The Financial Payment Method aggregate does not coordinate sibling
   * payment methods. The application/domain coordination boundary is
   * responsible for determining which payment method should become default.
   *
   * This operation is intentionally idempotent.
   *
   * No domain event is emitted because clearing the default designation is an
   * internal coordination step performed while another payment method is
   * being designated as default.
   */
  public clearDefault(clearedAt: Date = new Date()): void {
    // -------------------------------------------------------------------------
    // Idempotency
    // -------------------------------------------------------------------------

    if (!this.paymentMethod.isDefault) {
      return;
    }

    // -------------------------------------------------------------------------
    // State Mutation
    // -------------------------------------------------------------------------

    this.paymentMethod.clearDefault();

    this.paymentMethod.setUpdatedAt(clearedAt);
  }

  // ===========================================================================
  // Deactivation
  // ===========================================================================

  /**
   * Deactivates the Financial Payment Method.
   *
   * The entity owns the state invariant that an inactive payment method
   * cannot remain the default method.
   *
   * The aggregate captures the previous default state before mutation so
   * consumers can understand whether the deactivated method had previously
   * been the default.
   *
   * If the payment method is already inactive, an exception is raised.
   */
  public deactivate(
    deactivatedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    // -------------------------------------------------------------------------
    // Lifecycle invariant
    // -------------------------------------------------------------------------

    if (!this.paymentMethod.isActive) {
      throw new FinancialPaymentMethodException(
        'Financial Payment Method is already inactive',
      );
    }

    // -------------------------------------------------------------------------
    // Capture pre-mutation state
    // -------------------------------------------------------------------------

    const wasDefault = this.paymentMethod.isDefault;

    // -------------------------------------------------------------------------
    // State Mutation
    // -------------------------------------------------------------------------

    this.paymentMethod.deactivate();

    this.paymentMethod.setUpdatedAt(deactivatedAt);

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new FinancialPaymentMethodDeactivatedEvent(
        this.id.value,
        this.publicId,
        this.accountId,
        this.type,
        this.provider,
        wasDefault,
        deactivatedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Event State Protection
  // ===========================================================================

  /**
   * The aggregate intentionally does not expose arbitrary event registration.
   *
   * Domain events can only be generated through meaningful aggregate
   * operations such as:
   *
   * - recordCreated()
   * - default()
   * - deactivate()
   *
   * clearDefault() intentionally does not emit a domain event because it is
   * an internal cross-aggregate coordination mutation.
   */
}
