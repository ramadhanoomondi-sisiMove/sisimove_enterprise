// src/domains/trust/domain/entities/trust-review.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { TrustReviewId } from '../value-objects/trust-review-id.vo';
import type { TrustRatingId } from '../value-objects/trust-rating-id.vo';
import type { TrustReviewContent } from '../value-objects/trust-review-content.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface TrustReviewProps {
  publicId: TrustReviewId;

  ratingId: TrustRatingId;

  content: TrustReviewContent;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class TrustReviewEntity extends Entity<TrustReviewProps> {
  private constructor(props: TrustReviewProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: TrustReviewProps): TrustReviewEntity {
    return new TrustReviewEntity(props);
  }

  public static rehydrate(
    props: TrustReviewProps,
    id: UniqueEntityId,
  ): TrustReviewEntity {
    return new TrustReviewEntity(props, id);
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

  get ratingId(): TrustRatingId {
    return this.props.ratingId;
  }

  get content(): TrustReviewContent {
    return this.props.content;
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

  setContent(content: TrustReviewContent): void {
    this.props.content = content;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  hasContent(): boolean {
    return !this.props.content.isEmpty;
  }

  belongsToRating(ratingId: TrustRatingId): boolean {
    return this.props.ratingId.equals(ratingId);
  }

  hasContentValue(content: TrustReviewContent): boolean {
    return this.props.content.equals(content);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: TrustReviewEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { TrustReviewProps };
