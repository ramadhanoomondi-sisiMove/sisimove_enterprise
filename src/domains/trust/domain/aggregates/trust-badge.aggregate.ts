// src/domains/trust/domain/aggregates/trust-badge.aggregate.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { TrustBadgeEntity } from '../entities/trust-badge.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { TrustBadgeId } from '../value-objects/trust-badge-id.vo';
import type { TrustBadgeTypeValueObject } from '../value-objects/trust-badge-type.vo';
import type { TrustBadgeName } from '../value-objects/trust-badge-name.vo';
import type { TrustBadgeDescription } from '../value-objects/trust-badge-description.vo';
import type { AssetPublicId } from '../value-objects/asset-public-id.vo';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

export class TrustBadgeAggregate extends AggregateRoot<TrustBadgeEntity> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(badge: TrustBadgeEntity, id?: UniqueEntityId) {
    super(badge, id);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(badge: TrustBadgeEntity): TrustBadgeAggregate {
    return new TrustBadgeAggregate(badge, badge.id);
  }

  public static rehydrate(badge: TrustBadgeEntity): TrustBadgeAggregate {
    return new TrustBadgeAggregate(badge, badge.id);
  }

  // ===========================================================================
  // Aggregate Identity
  // ===========================================================================

  public get badge(): TrustBadgeEntity {
    return this.props;
  }

  public get aggregateId(): UniqueEntityId {
    return this.id;
  }

  public get trustBadgeId(): TrustBadgeId {
    return this.badge.publicId;
  }

  // ===========================================================================
  // Properties
  // ===========================================================================

  public get type(): TrustBadgeTypeValueObject {
    return this.badge.type;
  }

  public get name(): TrustBadgeName {
    return this.badge.name;
  }

  public get description(): TrustBadgeDescription | undefined {
    return this.badge.description;
  }

  public get assetPublicId(): AssetPublicId | undefined {
    return this.badge.assetPublicId;
  }

  public get active(): boolean {
    return this.badge.active;
  }

  public get createdAt(): Date {
    return this.badge.createdAt;
  }

  public get updatedAt(): Date {
    return this.badge.updatedAt;
  }

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  public activate(): void {
    if (this.badge.isActive()) {
      return;
    }

    this.badge.activate();
    this.touch();
  }

  public deactivate(): void {
    if (this.badge.isInactive()) {
      return;
    }

    this.badge.deactivate();
    this.touch();
  }

  // ===========================================================================
  // Type
  // ===========================================================================

  public changeType(type: TrustBadgeTypeValueObject): void {
    if (this.badge.isType(type)) {
      return;
    }

    this.badge.setType(type);
    this.touch();
  }

  // ===========================================================================
  // Name
  // ===========================================================================

  public changeName(name: TrustBadgeName): void {
    if (this.badge.name.equals(name)) {
      return;
    }

    this.badge.setName(name);
    this.touch();
  }

  // ===========================================================================
  // Description
  // ===========================================================================

  public changeDescription(
    description: TrustBadgeDescription | undefined,
  ): void {
    const current = this.badge.description;

    if (
      current === description ||
      (current !== undefined &&
        description !== undefined &&
        current.equals(description))
    ) {
      return;
    }

    this.badge.setDescription(description);
    this.touch();
  }

  public removeDescription(): void {
    if (!this.badge.hasDescription()) {
      return;
    }

    this.badge.setDescription(undefined);
    this.touch();
  }

  // ===========================================================================
  // Asset
  // ===========================================================================

  public setAsset(assetPublicId: AssetPublicId): void {
    const current = this.badge.assetPublicId;

    if (current !== undefined && current.equals(assetPublicId)) {
      return;
    }

    this.badge.setAssetPublicId(assetPublicId);
    this.touch();
  }

  public removeAsset(): void {
    if (!this.badge.hasAsset()) {
      return;
    }

    this.badge.setAssetPublicId(undefined);
    this.touch();
  }

  // ===========================================================================
  // Queries
  // ===========================================================================

  public isActive(): boolean {
    return this.badge.isActive();
  }

  public isInactive(): boolean {
    return this.badge.isInactive();
  }

  public hasDescription(): boolean {
    return this.badge.hasDescription();
  }

  public hasAsset(): boolean {
    return this.badge.hasAsset();
  }

  public isType(type: TrustBadgeTypeValueObject): boolean {
    return this.badge.isType(type);
  }

  public isIdentityVerified(): boolean {
    return this.badge.isIdentityVerified();
  }

  public isPhoneVerified(): boolean {
    return this.badge.isPhoneVerified();
  }

  public isExperiencedProvider(): boolean {
    return this.badge.isExperiencedProvider();
  }

  public isExperiencedTraveller(): boolean {
    return this.badge.isExperiencedTraveller();
  }

  public isReliableProvider(): boolean {
    return this.badge.isReliableProvider();
  }

  public isReliableTraveller(): boolean {
    return this.badge.isReliableTraveller();
  }

  public isHighlyRated(): boolean {
    return this.badge.isHighlyRated();
  }

  public usesAsset(assetPublicId: AssetPublicId): boolean {
    return this.badge.usesAsset(assetPublicId);
  }
}
