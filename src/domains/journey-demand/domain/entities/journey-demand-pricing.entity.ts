// src/domains/journey-demand/domain/entities/journey-demand-pricing.entity.ts

// -----------------------------------------------------------------------------
// Journey Demand Pricing Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyDemandPricingId } from '../value-objects/journey-demand-pricing-id.vo';
import type { JourneyDemandPricingPublicId } from '../value-objects/journey-demand-pricing-public-id.vo';
import type { JourneyDemandPrice } from '../value-objects/journey-demand-price.vo';
import type { JourneyDemandCurrency } from '../value-objects/journey-demand-currency.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyDemandPricingProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: JourneyDemandPricingPublicId;

  // ---------------------------------------------------------------------------
  // Pricing Constraints
  // ---------------------------------------------------------------------------

  maximumPricePerSeat: JourneyDemandPrice | undefined;

  preferredPricePerSeat: JourneyDemandPrice | undefined;

  currency: JourneyDemandCurrency;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyDemandPricingEntity extends Entity<
  JourneyDemandPricingProps,
  JourneyDemandPricingPublicId
> {
  private constructor(
    props: JourneyDemandPricingProps,
    id?: UniqueEntityId,
    publicId?: JourneyDemandPricingPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId: JourneyDemandPricingPublicId;

    maximumPricePerSeat?: JourneyDemandPrice;

    preferredPricePerSeat?: JourneyDemandPrice;

    currency: JourneyDemandCurrency;

    createdAt?: Date;

    updatedAt?: Date;
  }): JourneyDemandPricingEntity {
    const now = new Date();

    JourneyDemandPricingEntity.validatePriceConstraints(
      props.preferredPricePerSeat,
      props.maximumPricePerSeat,
    );

    return new JourneyDemandPricingEntity(
      {
        publicId: props.publicId,

        maximumPricePerSeat: props.maximumPricePerSeat,

        preferredPricePerSeat: props.preferredPricePerSeat,

        currency: props.currency,

        createdAt: JourneyDemandPricingEntity.cloneDate(props.createdAt ?? now),

        updatedAt: JourneyDemandPricingEntity.cloneDate(props.updatedAt ?? now),
      },
      undefined,
      props.publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneyDemandPricingProps,
    id: JourneyDemandPricingId,
    publicId: JourneyDemandPricingPublicId,
  ): JourneyDemandPricingEntity {
    return new JourneyDemandPricingEntity(
      {
        ...props,

        createdAt: JourneyDemandPricingEntity.cloneDate(props.createdAt),

        updatedAt: JourneyDemandPricingEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  override get publicId(): JourneyDemandPricingPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Maximum Price
  // ---------------------------------------------------------------------------

  get maximumPricePerSeat(): JourneyDemandPrice | undefined {
    return this.props.maximumPricePerSeat;
  }

  setMaximumPricePerSeat(
    maximumPricePerSeat: JourneyDemandPrice | undefined,
  ): void {
    JourneyDemandPricingEntity.validatePriceConstraints(
      this.props.preferredPricePerSeat,
      maximumPricePerSeat,
    );

    this.props.maximumPricePerSeat = maximumPricePerSeat;

    this.touch();
  }

  clearMaximumPricePerSeat(): void {
    this.props.maximumPricePerSeat = undefined;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Preferred Price
  // ---------------------------------------------------------------------------

  get preferredPricePerSeat(): JourneyDemandPrice | undefined {
    return this.props.preferredPricePerSeat;
  }

  setPreferredPricePerSeat(
    preferredPricePerSeat: JourneyDemandPrice | undefined,
  ): void {
    JourneyDemandPricingEntity.validatePriceConstraints(
      preferredPricePerSeat,
      this.props.maximumPricePerSeat,
    );

    this.props.preferredPricePerSeat = preferredPricePerSeat;

    this.touch();
  }

  clearPreferredPricePerSeat(): void {
    this.props.preferredPricePerSeat = undefined;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Prices
  // ---------------------------------------------------------------------------

  setPrices(
    preferredPricePerSeat: JourneyDemandPrice | undefined,
    maximumPricePerSeat: JourneyDemandPrice | undefined,
  ): void {
    JourneyDemandPricingEntity.validatePriceConstraints(
      preferredPricePerSeat,
      maximumPricePerSeat,
    );

    this.props.preferredPricePerSeat = preferredPricePerSeat;

    this.props.maximumPricePerSeat = maximumPricePerSeat;

    this.touch();
  }

  clearPrices(): void {
    this.props.preferredPricePerSeat = undefined;

    this.props.maximumPricePerSeat = undefined;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Currency
  // ---------------------------------------------------------------------------

  get currency(): JourneyDemandCurrency {
    return this.props.currency;
  }

  setCurrency(currency: JourneyDemandCurrency): void {
    this.props.currency = currency;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  get createdAt(): Date {
    return JourneyDemandPricingEntity.cloneDate(this.props.createdAt);
  }

  get updatedAt(): Date {
    return JourneyDemandPricingEntity.cloneDate(this.props.updatedAt);
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneyDemandPricingEntity.cloneDate(updatedAt);
  }

  override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneyDemandPricingEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Pricing Queries
  // ---------------------------------------------------------------------------

  hasMaximumPrice(): boolean {
    return this.props.maximumPricePerSeat !== undefined;
  }

  hasPreferredPrice(): boolean {
    return this.props.preferredPricePerSeat !== undefined;
  }

  hasPriceConstraint(): boolean {
    return (
      this.props.maximumPricePerSeat !== undefined ||
      this.props.preferredPricePerSeat !== undefined
    );
  }

  hasMaximumPriceConstraint(): boolean {
    return this.props.maximumPricePerSeat !== undefined;
  }

  hasPreferredPriceConstraint(): boolean {
    return this.props.preferredPricePerSeat !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Price Matching
  // ---------------------------------------------------------------------------

  acceptsPrice(pricePerSeat: JourneyDemandPrice): boolean {
    if (this.props.maximumPricePerSeat === undefined) {
      return true;
    }

    return pricePerSeat.value <= this.props.maximumPricePerSeat.value;
  }

  isWithinMaximumPrice(pricePerSeat: JourneyDemandPrice): boolean {
    return this.acceptsPrice(pricePerSeat);
  }

  isPreferredPrice(pricePerSeat: JourneyDemandPrice): boolean {
    if (this.props.preferredPricePerSeat === undefined) {
      return false;
    }

    return pricePerSeat.value === this.props.preferredPricePerSeat.value;
  }

  isBelowPreferredPrice(pricePerSeat: JourneyDemandPrice): boolean {
    if (this.props.preferredPricePerSeat === undefined) {
      return false;
    }

    return pricePerSeat.value < this.props.preferredPricePerSeat.value;
  }

  isAbovePreferredPrice(pricePerSeat: JourneyDemandPrice): boolean {
    if (this.props.preferredPricePerSeat === undefined) {
      return false;
    }

    return pricePerSeat.value > this.props.preferredPricePerSeat.value;
  }

  // ---------------------------------------------------------------------------
  // Pricing State
  // ---------------------------------------------------------------------------

  isUnconstrained(): boolean {
    return (
      this.props.preferredPricePerSeat === undefined &&
      this.props.maximumPricePerSeat === undefined
    );
  }

  isPreferredPriceOnly(): boolean {
    return (
      this.props.preferredPricePerSeat !== undefined &&
      this.props.maximumPricePerSeat === undefined
    );
  }

  isMaximumPriceOnly(): boolean {
    return (
      this.props.preferredPricePerSeat === undefined &&
      this.props.maximumPricePerSeat !== undefined
    );
  }

  hasPreferredAndMaximumPrice(): boolean {
    return (
      this.props.preferredPricePerSeat !== undefined &&
      this.props.maximumPricePerSeat !== undefined
    );
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(
    other?: Entity<JourneyDemandPricingProps, JourneyDemandPricingPublicId>,
  ): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validatePriceConstraints(
    preferredPricePerSeat: JourneyDemandPrice | undefined,
    maximumPricePerSeat: JourneyDemandPrice | undefined,
  ): void {
    if (
      preferredPricePerSeat !== undefined &&
      maximumPricePerSeat !== undefined &&
      preferredPricePerSeat.value > maximumPricePerSeat.value
    ) {
      throw new Error(
        'Preferred price per seat cannot exceed maximum price per seat.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyDemandPricingProps };
