// src/domains/trust/domain/entities/trust-badge.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { TrustBadgeId } from '../value-objects/trust-badge-id.vo';
import type { AssetPublicId } from '../value-objects/asset-public-id.vo';
import type { TrustBadgeName } from '../value-objects/trust-badge-name.vo';
import type { TrustBadgeDescription } from '../value-objects/trust-badge-description.vo';

import type { TrustBadgeTypeValueObject } from '../value-objects/trust-badge-type.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface TrustBadgeProps {
  publicId: TrustBadgeId;

  type: TrustBadgeTypeValueObject;

  name: TrustBadgeName;
  description: TrustBadgeDescription | undefined;

  assetPublicId: AssetPublicId | undefined;

  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class TrustBadgeEntity extends Entity<TrustBadgeProps> {
  private constructor(props: TrustBadgeProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: TrustBadgeProps): TrustBadgeEntity {
    return new TrustBadgeEntity(props);
  }

  public static rehydrate(
    props: TrustBadgeProps,
    id: UniqueEntityId,
  ): TrustBadgeEntity {
    return new TrustBadgeEntity(props, id);
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

  get type(): TrustBadgeTypeValueObject {
    return this.props.type;
  }

  get name(): TrustBadgeName {
    return this.props.name;
  }

  get description(): TrustBadgeDescription | undefined {
    return this.props.description;
  }

  get assetPublicId(): AssetPublicId | undefined {
    return this.props.assetPublicId;
  }

  get active(): boolean {
    return this.props.active;
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

  setType(type: TrustBadgeTypeValueObject): void {
    this.props.type = type;
  }

  setName(name: TrustBadgeName): void {
    this.props.name = name;
  }

  setDescription(description: TrustBadgeDescription | undefined): void {
    this.props.description = description;
  }

  setAssetPublicId(assetPublicId: AssetPublicId | undefined): void {
    this.props.assetPublicId = assetPublicId;
  }

  setActive(active: boolean): void {
    this.props.active = active;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  activate(): void {
    this.props.active = true;
  }

  deactivate(): void {
    this.props.active = false;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  isActive(): boolean {
    return this.props.active;
  }

  isInactive(): boolean {
    return !this.props.active;
  }

  hasDescription(): boolean {
    return (
      this.props.description !== undefined && !this.props.description.isEmpty
    );
  }

  hasAsset(): boolean {
    return this.props.assetPublicId !== undefined;
  }

  isType(type: TrustBadgeTypeValueObject): boolean {
    return this.props.type.equals(type);
  }

  isIdentityVerified(): boolean {
    return this.props.type.isIdentityVerified;
  }

  isPhoneVerified(): boolean {
    return this.props.type.isPhoneVerified;
  }

  isExperiencedProvider(): boolean {
    return this.props.type.isExperiencedProvider;
  }

  isExperiencedTraveller(): boolean {
    return this.props.type.isExperiencedTraveller;
  }

  isReliableProvider(): boolean {
    return this.props.type.isReliableProvider;
  }

  isReliableTraveller(): boolean {
    return this.props.type.isReliableTraveller;
  }

  isHighlyRated(): boolean {
    return this.props.type.isHighlyRated;
  }

  usesAsset(assetPublicId: AssetPublicId): boolean {
    return this.props.assetPublicId?.equals(assetPublicId) ?? false;
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: TrustBadgeEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { TrustBadgeProps };
