// src/domains/journey/domain/entities/journey-asset.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyAssetPublicId } from '../value-objects/journey-asset-public-id.vo';
import type { JourneyAssetPublicIdReference } from '../value-objects/journey-asset-public-id-reference.vo';
import type { JourneyAssetTypeValueObject } from '../value-objects/journey-asset-type.vo';
import type { JourneyAssetSortOrder } from '../value-objects/journey-asset-sort-order.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyAssetProps {
  publicId: JourneyAssetPublicId;

  assetPublicId: JourneyAssetPublicIdReference;

  type: JourneyAssetTypeValueObject;

  sortOrder: JourneyAssetSortOrder;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyAssetEntity extends Entity<JourneyAssetProps> {
  private constructor(props: JourneyAssetProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: JourneyAssetProps): JourneyAssetEntity {
    return new JourneyAssetEntity(props);
  }

  public static rehydrate(
    props: JourneyAssetProps,
    id: UniqueEntityId,
  ): JourneyAssetEntity {
    return new JourneyAssetEntity(props, id);
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

  get assetPublicId(): JourneyAssetPublicIdReference {
    return this.props.assetPublicId;
  }

  get type(): JourneyAssetTypeValueObject {
    return this.props.type;
  }

  get sortOrder(): JourneyAssetSortOrder {
    return this.props.sortOrder;
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

  setAssetPublicId(assetPublicId: JourneyAssetPublicIdReference): void {
    this.props.assetPublicId = assetPublicId;
  }

  setType(type: JourneyAssetTypeValueObject): void {
    this.props.type = type;
  }

  setSortOrder(sortOrder: JourneyAssetSortOrder): void {
    this.props.sortOrder = sortOrder;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  isCover(): boolean {
    return this.props.type.isCover;
  }

  isVehicle(): boolean {
    return this.props.type.isVehicle;
  }

  isGallery(): boolean {
    return this.props.type.isGallery;
  }

  isFirst(): boolean {
    return this.props.sortOrder.isFirst;
  }

  referencesAsset(assetPublicId: JourneyAssetPublicIdReference): boolean {
    return this.props.assetPublicId.equals(assetPublicId);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: JourneyAssetEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyAssetProps };
