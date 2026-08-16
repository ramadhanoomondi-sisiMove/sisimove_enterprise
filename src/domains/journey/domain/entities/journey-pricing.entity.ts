// src/domains/journey/domain/entities/journey-pricing.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyPricingPublicId } from '../value-objects/journey-pricing-public-id.vo';
import type { JourneyPricingAmount } from '../value-objects/journey-pricing-amount.vo';
import type { JourneyCurrency } from '../value-objects/journey-currency.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyPricingProps {
  publicId: JourneyPricingPublicId;

  amount: JourneyPricingAmount;
  currency: JourneyCurrency;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyPricingEntity extends Entity<JourneyPricingProps> {
  private constructor(props: JourneyPricingProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: JourneyPricingProps): JourneyPricingEntity {
    return new JourneyPricingEntity(props);
  }

  public static rehydrate(
    props: JourneyPricingProps,
    id: UniqueEntityId,
  ): JourneyPricingEntity {
    return new JourneyPricingEntity(props, id);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  override get publicId(): PublicEntityId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  get amount(): JourneyPricingAmount {
    return this.props.amount;
  }

  get currency(): JourneyCurrency {
    return this.props.currency;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Mutators
  // ---------------------------------------------------------------------------

  setAmount(amount: JourneyPricingAmount): void {
    this.props.amount = amount;
  }

  setCurrency(currency: JourneyCurrency): void {
    this.props.currency = currency;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  isFree(): boolean {
    return this.props.amount.isFree;
  }

  hasPrice(): boolean {
    return this.props.amount.hasPrice;
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: JourneyPricingEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyPricingProps };
