// -----------------------------------------------------------------------------
// Financial Payment Method Entity
// -----------------------------------------------------------------------------
//
// Represents a registered external funding instrument belonging to a
// Financial Account.
//
// Aggregate:
// - FinancialPaymentMethodAggregate
//
// Responsibilities:
// - Payment-method identity.
// - Owning Financial Account reference.
// - Payment-method type.
// - External provider identity.
// - Provider-issued reference.
// - Safe display metadata.
// - Default designation.
// - Active/inactive lifecycle.
// - Payment-method invariants.
//
// This entity does NOT:
// - Execute payments.
// - Execute provider API calls.
// - Communicate with external providers.
// - Move money.
// - Modify Financial Account balances.
// - Coordinate other payment methods.
// - Coordinate Financial Payments.
// - Store raw payment credentials.
//
// Those responsibilities belong to application, integration,
// infrastructure, and other financial aggregates.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodException } from '../exceptions/financial-payment-method.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodPublicId } from '../value-objects/financial-payment-method-public-id.vo';

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import type { FinancialPaymentMethodType } from '../value-objects/financial-payment-method-type.vo';

import type { FinancialProvider } from '../value-objects/financial-provider.vo';

import type { FinancialProviderReference } from '../value-objects/financial-provider-reference.vo';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface FinancialPaymentMethodProps {
  /**
   * Internal identity of the owning Financial Account.
   *
   * This is the persistence/domain reference used to associate the payment
   * method with its owning Financial Account aggregate.
   */
  accountId: UniqueEntityId;

  /**
   * Public identity of the owning Financial Account.
   *
   * This is intentionally stored as an opaque cross-aggregate reference and
   * is used when publishing domain events.
   */
  accountPublicId: FinancialAccountPublicId;

  /**
   * Type of external funding instrument.
   */
  type: FinancialPaymentMethodType;

  /**
   * External financial provider.
   */
  provider: FinancialProvider;

  /**
   * Provider-issued identifier for the registered funding instrument.
   *
   * Must never contain raw payment credentials.
   */
  providerReference: FinancialProviderReference | undefined;

  /**
   * Safe human-readable display label.
   */
  displayName: string | undefined;

  /**
   * Safe masked identifier suffix.
   */
  lastFour: string | undefined;

  /**
   * Whether this payment method is the preferred/default method.
   *
   * Uniqueness across payment methods belonging to the same account is
   * coordinated outside this aggregate.
   */
  isDefault: boolean;

  /**
   * Whether this payment method can currently be used.
   */
  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class FinancialPaymentMethodEntity extends Entity<
  FinancialPaymentMethodProps,
  FinancialPaymentMethodPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    props: FinancialPaymentMethodProps,
    id?: UniqueEntityId,
    publicId?: FinancialPaymentMethodPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    accountId: UniqueEntityId,
    accountPublicId: FinancialAccountPublicId,
    type: FinancialPaymentMethodType,
    provider: FinancialProvider,
    providerReference?: FinancialProviderReference,
    displayName?: string,
    lastFour?: string,
    isDefault = false,
  ): FinancialPaymentMethodEntity {
    const now = new Date();

    return new FinancialPaymentMethodEntity(
      {
        accountId,
        accountPublicId,
        type,
        provider,
        providerReference: providerReference ?? undefined,

        displayName:
          displayName !== undefined
            ? FinancialPaymentMethodEntity.normalizeOptionalText(displayName)
            : undefined,

        lastFour:
          lastFour !== undefined
            ? FinancialPaymentMethodEntity.normalizeLastFour(lastFour)
            : undefined,

        isDefault,
        isActive: true,

        createdAt: now,
        updatedAt: now,
      },
      new UniqueEntityId(),
      new FinancialPaymentMethodPublicId(),
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): FinancialPaymentMethodPublicId {
    return super.publicId;
  }

  // ---------------------------------------------------------------------------
  // Account Reference
  // ---------------------------------------------------------------------------

  /**
   * Internal identity of the owning Financial Account.
   */
  public get accountId(): UniqueEntityId {
    return this.props.accountId;
  }

  /**
   * Public identity of the owning Financial Account.
   *
   * Used for cross-bounded-context communication.
   */
  public get accountPublicId(): FinancialAccountPublicId {
    return this.props.accountPublicId;
  }

  // ---------------------------------------------------------------------------
  // Payment Method
  // ---------------------------------------------------------------------------

  public get type(): FinancialPaymentMethodType {
    return this.props.type;
  }

  public get provider(): FinancialProvider {
    return this.props.provider;
  }

  public get providerReference(): FinancialProviderReference | undefined {
    return this.props.providerReference;
  }

  public get displayName(): string | undefined {
    return this.props.displayName;
  }

  public get lastFour(): string | undefined {
    return this.props.lastFour;
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  public get isDefault(): boolean {
    return this.props.isDefault;
  }

  public get isActive(): boolean {
    return this.props.isActive;
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Provider Reference
  // ---------------------------------------------------------------------------

  public setProviderReference(
    providerReference: FinancialProviderReference,
  ): void {
    this.ensureActive();

    this.props.providerReference = providerReference;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Display Metadata
  // ---------------------------------------------------------------------------

  public setDisplayName(displayName?: string): void {
    this.ensureActive();

    this.props.displayName =
      displayName !== undefined
        ? FinancialPaymentMethodEntity.normalizeOptionalText(displayName)
        : undefined;

    this.touch();
  }

  public setLastFour(lastFour?: string): void {
    this.ensureActive();

    this.props.lastFour =
      lastFour !== undefined
        ? FinancialPaymentMethodEntity.normalizeLastFour(lastFour)
        : undefined;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Default State
  // ---------------------------------------------------------------------------

  /**
   * Marks this payment method as the default.
   *
   * This aggregate does not coordinate sibling payment methods.
   */
  public markAsDefault(): void {
    this.ensureActive();

    if (this.props.isDefault) {
      return;
    }

    this.props.isDefault = true;

    this.touch();
  }

  /**
   * Removes the default designation.
   */
  public clearDefault(): void {
    if (!this.props.isDefault) {
      return;
    }

    this.props.isDefault = false;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Activation
  // ---------------------------------------------------------------------------

  public activate(): void {
    if (this.props.isActive) {
      return;
    }

    this.props.isActive = true;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Deactivation
  // ---------------------------------------------------------------------------

  /**
   * Deactivates the payment method.
   *
   * An inactive payment method can never remain the default method.
   */
  public deactivate(): void {
    if (!this.props.isActive) {
      return;
    }

    this.props.isActive = false;
    this.props.isDefault = false;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Eligibility
  // ---------------------------------------------------------------------------

  public canBeUsed(): boolean {
    return this.props.isActive;
  }

  public isDefaultMethod(): boolean {
    return this.props.isDefault;
  }

  public isActiveDefault(): boolean {
    return this.props.isActive && this.props.isDefault;
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private ensureActive(): void {
    if (!this.props.isActive) {
      throw new FinancialPaymentMethodException(
        'Financial Payment Method is inactive',
      );
    }
  }

  private static normalizeOptionalText(value: string): string | undefined {
    const normalized = value.trim();

    return normalized.length > 0 ? normalized : undefined;
  }

  private static normalizeLastFour(value: string): string {
    const normalized = value.trim();

    if (!/^[A-Za-z0-9]{4}$/.test(normalized)) {
      throw new FinancialPaymentMethodException(
        'Financial Payment Method lastFour must contain exactly 4 alphanumeric characters',
      );
    }

    return normalized;
  }

  // ---------------------------------------------------------------------------
  // Persistence / Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Explicitly sets the updated timestamp.
   *
   * Primarily intended for persistence rehydration/mapping.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }
}
