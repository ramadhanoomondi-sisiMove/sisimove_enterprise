// -----------------------------------------------------------------------------
// Journey Booking Pricing Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyBookingPricingPublicId } from '../value-objects/journey-booking-pricing-public-id.vo';

import type { JourneyBookingPricePerSeat } from '../value-objects/journey-booking-price-per-seat.vo';

import type { JourneyBookingSeats } from '../value-objects/journey-booking-seats.vo';

import type { JourneyBookingSubtotal } from '../value-objects/journey-booking-subtotal.vo';

import { JourneyBookingDiscountAmount } from '../value-objects/journey-booking-discount-amount.vo';

import { JourneyBookingAdjustmentAmount } from '../value-objects/journey-booking-adjustment-amount.vo';

import type { JourneyBookingTotalAmount } from '../value-objects/journey-booking-total-amount.vo';

import type { JourneyBookingCurrency } from '../value-objects/journey-booking-currency.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyBookingPricingProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: JourneyBookingPricingPublicId;

  // ---------------------------------------------------------------------------
  // Pricing Snapshot
  // ---------------------------------------------------------------------------

  pricePerSeat: JourneyBookingPricePerSeat;

  seats: JourneyBookingSeats;

  subtotal: JourneyBookingSubtotal;

  discountAmount: JourneyBookingDiscountAmount;

  adjustmentAmount: JourneyBookingAdjustmentAmount;

  totalAmount: JourneyBookingTotalAmount;

  currency: JourneyBookingCurrency;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

/**
 * Represents the pricing snapshot belonging to a Journey Booking.
 *
 * Pricing is captured at booking time and remains independent from subsequent
 * changes to the Journey or its current fare configuration.
 *
 * The JourneyBooking aggregate owns this entity.
 */
export class JourneyBookingPricingEntity extends Entity<
  JourneyBookingPricingProps,
  JourneyBookingPricingPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: JourneyBookingPricingProps,
    id?: UniqueEntityId,
    publicId?: JourneyBookingPricingPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: JourneyBookingPricingPublicId;

    pricePerSeat: JourneyBookingPricePerSeat;

    seats: JourneyBookingSeats;

    subtotal: JourneyBookingSubtotal;

    discountAmount?: JourneyBookingDiscountAmount | undefined;

    adjustmentAmount?: JourneyBookingAdjustmentAmount | undefined;

    totalAmount: JourneyBookingTotalAmount;

    currency: JourneyBookingCurrency;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): JourneyBookingPricingEntity {
    const now = new Date();

    const discountAmount =
      props.discountAmount ?? new JourneyBookingDiscountAmount(0);

    const adjustmentAmount =
      props.adjustmentAmount ?? new JourneyBookingAdjustmentAmount(0);

    return new JourneyBookingPricingEntity({
      publicId: props.publicId ?? new JourneyBookingPricingPublicId(),

      pricePerSeat: props.pricePerSeat,

      seats: props.seats,

      subtotal: props.subtotal,

      discountAmount,

      adjustmentAmount,

      totalAmount: props.totalAmount,

      currency: props.currency,

      createdAt: JourneyBookingPricingEntity.cloneDate(props.createdAt ?? now),

      updatedAt: JourneyBookingPricingEntity.cloneDate(props.updatedAt ?? now),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneyBookingPricingProps,
    id: UniqueEntityId,
    publicId: JourneyBookingPricingPublicId,
  ): JourneyBookingPricingEntity {
    return new JourneyBookingPricingEntity(
      {
        publicId,

        pricePerSeat: props.pricePerSeat,

        seats: props.seats,

        subtotal: props.subtotal,

        discountAmount: props.discountAmount,

        adjustmentAmount: props.adjustmentAmount,

        totalAmount: props.totalAmount,

        currency: props.currency,

        createdAt: JourneyBookingPricingEntity.cloneDate(props.createdAt),

        updatedAt: JourneyBookingPricingEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): JourneyBookingPricingPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Price Per Seat
  // ---------------------------------------------------------------------------

  public get pricePerSeat(): JourneyBookingPricePerSeat {
    return this.props.pricePerSeat;
  }

  public setPricePerSeat(pricePerSeat: JourneyBookingPricePerSeat): void {
    this.props.pricePerSeat = pricePerSeat;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Seats
  // ---------------------------------------------------------------------------

  public get seats(): JourneyBookingSeats {
    return this.props.seats;
  }

  public setSeats(seats: JourneyBookingSeats): void {
    this.props.seats = seats;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Subtotal
  // ---------------------------------------------------------------------------

  public get subtotal(): JourneyBookingSubtotal {
    return this.props.subtotal;
  }

  public setSubtotal(subtotal: JourneyBookingSubtotal): void {
    this.props.subtotal = subtotal;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Discount
  // ---------------------------------------------------------------------------

  public get discountAmount(): JourneyBookingDiscountAmount {
    return this.props.discountAmount;
  }

  public setDiscountAmount(discountAmount: JourneyBookingDiscountAmount): void {
    this.props.discountAmount = discountAmount;

    this.touch();
  }

  public hasDiscount(): boolean {
    return this.props.discountAmount.value > 0;
  }

  // ---------------------------------------------------------------------------
  // Adjustment
  // ---------------------------------------------------------------------------

  public get adjustmentAmount(): JourneyBookingAdjustmentAmount {
    return this.props.adjustmentAmount;
  }

  public setAdjustmentAmount(
    adjustmentAmount: JourneyBookingAdjustmentAmount,
  ): void {
    this.props.adjustmentAmount = adjustmentAmount;

    this.touch();
  }

  public hasAdjustment(): boolean {
    return this.props.adjustmentAmount.value !== 0;
  }

  // ---------------------------------------------------------------------------
  // Total
  // ---------------------------------------------------------------------------

  public get totalAmount(): JourneyBookingTotalAmount {
    return this.props.totalAmount;
  }

  public setTotalAmount(totalAmount: JourneyBookingTotalAmount): void {
    this.props.totalAmount = totalAmount;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Currency
  // ---------------------------------------------------------------------------

  public get currency(): JourneyBookingCurrency {
    return this.props.currency;
  }

  public setCurrency(currency: JourneyBookingCurrency): void {
    this.props.currency = currency;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Pricing Calculations
  // ---------------------------------------------------------------------------

  /**
   * Calculates the subtotal from the captured seat price
   * and seat count.
   */
  public calculateSubtotal(): number {
    return this.props.pricePerSeat.value * this.props.seats.value;
  }

  /**
   * Determines whether the stored subtotal matches
   * the seat calculation.
   */
  public hasValidSubtotal(): boolean {
    return this.props.subtotal.value === this.calculateSubtotal();
  }

  /**
   * Calculates the expected final amount.
   *
   * total = subtotal - discount + adjustment
   */
  public calculateExpectedTotal(): number {
    return (
      this.props.subtotal.value -
      this.props.discountAmount.value +
      this.props.adjustmentAmount.value
    );
  }

  /**
   * Determines whether the stored total matches
   * the pricing components.
   */
  public hasValidTotal(): boolean {
    return this.props.totalAmount.value === this.calculateExpectedTotal();
  }

  /**
   * Determines whether the pricing snapshot is
   * internally consistent.
   */
  public isConsistent(): boolean {
    return this.hasValidSubtotal() && this.hasValidTotal();
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the pricing snapshot contains
   * all required values.
   *
   * All pricing components are mandatory at the
   * entity level.
   */
  public isComplete(): boolean {
    return (
      this.props.pricePerSeat !== undefined &&
      this.props.seats !== undefined &&
      this.props.subtotal !== undefined &&
      this.props.discountAmount !== undefined &&
      this.props.adjustmentAmount !== undefined &&
      this.props.totalAmount !== undefined &&
      this.props.currency !== undefined
    );
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return JourneyBookingPricingEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return JourneyBookingPricingEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneyBookingPricingEntity.cloneDate(updatedAt);
  }

  /**
   * Updates the entity modification timestamp.
   *
   * Public visibility is intentional because the
   * foundation Entity contract exposes touch().
   */
  public override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneyBookingPricingEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: JourneyBookingPricingEntity): boolean {
    return other !== undefined && this.id.equals(other.id);
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

export type { JourneyBookingPricingProps };
