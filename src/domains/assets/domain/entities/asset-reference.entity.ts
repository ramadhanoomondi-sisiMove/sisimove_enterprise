// src/domains/assets/domain/entities/asset-reference.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import {
  AssetReferenceField,
  type AssetId,
  type AssetReferenceId,
  type AssetResourceType,
} from '../value-objects';

export interface AssetReferenceProps {
  publicId: AssetReferenceId;

  assetId: AssetId;

  resourceType: AssetResourceType;
  resourcePublicId: string;

  referenceField: AssetReferenceField;

  createdAt: Date;
}

export class AssetReferenceEntity extends Entity<
  AssetReferenceProps,
  AssetReferenceId
> {
  private constructor(props: AssetReferenceProps, id?: UniqueEntityId) {
    super(props, id, props.publicId);
  }

  // --------------------------------------------------------------------------
  // Factory
  // --------------------------------------------------------------------------

  public static create(props: AssetReferenceProps): AssetReferenceEntity {
    return new AssetReferenceEntity(props);
  }

  public static rehydrate(
    props: AssetReferenceProps,
    id: UniqueEntityId,
  ): AssetReferenceEntity {
    return new AssetReferenceEntity(props, id);
  }

  // --------------------------------------------------------------------------
  // Properties
  // --------------------------------------------------------------------------

  override get publicId(): AssetReferenceId {
    return super.publicId;
  }

  get assetId(): AssetId {
    return this.props.assetId;
  }

  get resourceType(): AssetResourceType {
    return this.props.resourceType;
  }

  get resourcePublicId(): string {
    return this.props.resourcePublicId;
  }

  get referenceField(): AssetReferenceField {
    return this.props.referenceField;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  // --------------------------------------------------------------------------
  // Queries
  // --------------------------------------------------------------------------

  referencesAsset(assetId: AssetId): boolean {
    return this.assetId.equals(assetId);
  }

  referencesResource(
    resourceType: AssetResourceType,
    resourcePublicId: string,
  ): boolean {
    return (
      this.resourceType === resourceType &&
      this.resourcePublicId === resourcePublicId
    );
  }

  hasField(field: AssetReferenceField): boolean {
    return this.referenceField === field;
  }

  isPrimary(): boolean {
    return this.hasField(AssetReferenceField.PRIMARY);
  }

  isSecondary(): boolean {
    return this.hasField(AssetReferenceField.SECONDARY);
  }

  isAvatar(): boolean {
    return this.hasField(AssetReferenceField.AVATAR);
  }

  isCover(): boolean {
    return this.hasField(AssetReferenceField.COVER);
  }

  isBanner(): boolean {
    return this.hasField(AssetReferenceField.BANNER);
  }

  isThumbnail(): boolean {
    return this.hasField(AssetReferenceField.THUMBNAIL);
  }

  isPreview(): boolean {
    return this.hasField(AssetReferenceField.PREVIEW);
  }

  isGallery(): boolean {
    return this.hasField(AssetReferenceField.GALLERY);
  }

  isAttachment(): boolean {
    return this.hasField(AssetReferenceField.ATTACHMENT);
  }

  isDocument(): boolean {
    return this.hasField(AssetReferenceField.DOCUMENT);
  }

  // --------------------------------------------------------------------------
  // Equality
  // --------------------------------------------------------------------------

  override equals(other?: AssetReferenceEntity): boolean {
    if (other === undefined) {
      return false;
    }

    if (super.equals(other)) {
      return true;
    }

    return (
      this.assetId.equals(other.assetId) &&
      this.resourceType === other.resourceType &&
      this.resourcePublicId === other.resourcePublicId &&
      this.referenceField === other.referenceField
    );
  }
}
