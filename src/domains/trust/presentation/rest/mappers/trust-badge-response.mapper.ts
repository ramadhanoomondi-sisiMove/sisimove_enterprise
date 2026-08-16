// src/domains/trust/presentation/rest/mappers/trust-badge-response.mapper.ts

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { TrustBadgeAggregate } from '../../../domain/aggregates/trust-badge.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { TrustBadgeEntity } from '../../../domain/entities/trust-badge.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

export interface TrustBadgeResponse {
  id: string;
  publicId: string;

  type: string;

  name: string;
  description: string | null;

  assetPublicId: string | null;

  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class TrustBadgeResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  static fromAggregate(aggregate: TrustBadgeAggregate): TrustBadgeResponse {
    return this.fromEntity(aggregate.badge);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  static fromEntity(entity: TrustBadgeEntity): TrustBadgeResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      type: entity.type.value,

      name: entity.name.value,

      description: entity.description?.value ?? null,

      assetPublicId: entity.assetPublicId?.value ?? null,

      active: entity.active,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Entities
  // ===========================================================================

  static fromEntities(entities: TrustBadgeEntity[]): TrustBadgeResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }

  // ===========================================================================
  // Individual Response
  // ===========================================================================

  static fromBadge(entity: TrustBadgeEntity): TrustBadgeResponse {
    return this.fromEntity(entity);
  }

  // ===========================================================================
  // Aggregates
  // ===========================================================================

  static fromAggregates(
    aggregates: TrustBadgeAggregate[],
  ): TrustBadgeResponse[] {
    return aggregates.map((aggregate) => this.fromAggregate(aggregate));
  }
}
