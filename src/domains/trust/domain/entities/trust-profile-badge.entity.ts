// src/domains/trust/domain/entities/trust-profile-badge.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { TrustProfileBadgeId } from '../value-objects/trust-profile-badge-id.vo';
import type { TrustProfileId } from '../value-objects/trust-profile-id.vo';
import type { TrustBadgeId } from '../value-objects/trust-badge-id.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface TrustProfileBadgeProps {
  publicId: TrustProfileBadgeId;

  profileId: TrustProfileId;
  badgeId: TrustBadgeId;

  awardedAt: Date;
  revokedAt: Date | undefined;

  active: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class TrustProfileBadgeEntity extends Entity<TrustProfileBadgeProps> {
  private constructor(props: TrustProfileBadgeProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: TrustProfileBadgeProps): TrustProfileBadgeEntity {
    return new TrustProfileBadgeEntity(props);
  }

  public static rehydrate(
    props: TrustProfileBadgeProps,
    id: UniqueEntityId,
  ): TrustProfileBadgeEntity {
    return new TrustProfileBadgeEntity(props, id);
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

  get profileId(): TrustProfileId {
    return this.props.profileId;
  }

  get badgeId(): TrustBadgeId {
    return this.props.badgeId;
  }

  get awardedAt(): Date {
    return this.props.awardedAt;
  }

  get revokedAt(): Date | undefined {
    return this.props.revokedAt;
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

  setProfileId(profileId: TrustProfileId): void {
    this.props.profileId = profileId;
  }

  setBadgeId(badgeId: TrustBadgeId): void {
    this.props.badgeId = badgeId;
  }

  setAwardedAt(awardedAt: Date): void {
    this.props.awardedAt = awardedAt;
  }

  setRevokedAt(revokedAt: Date | undefined): void {
    this.props.revokedAt = revokedAt;
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

  award(awardedAt: Date = new Date()): void {
    this.props.awardedAt = awardedAt;
    this.props.revokedAt = undefined;
    this.props.active = true;
    this.props.updatedAt = new Date();
  }

  revoke(revokedAt: Date = new Date()): void {
    this.props.revokedAt = revokedAt;
    this.props.active = false;
    this.props.updatedAt = new Date();
  }

  restore(restoredAt: Date = new Date()): void {
    this.props.revokedAt = undefined;
    this.props.awardedAt = restoredAt;
    this.props.active = true;
    this.props.updatedAt = new Date();
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

  isRevoked(): boolean {
    return this.props.revokedAt !== undefined;
  }

  isAwarded(): boolean {
    return true;
  }

  belongsToProfile(profileId: TrustProfileId): boolean {
    return this.props.profileId.equals(profileId);
  }

  representsBadge(badgeId: TrustBadgeId): boolean {
    return this.props.badgeId.equals(badgeId);
  }

  wasAwardedBefore(date: Date): boolean {
    return this.props.awardedAt.getTime() < date.getTime();
  }

  wasAwardedAfter(date: Date): boolean {
    return this.props.awardedAt.getTime() > date.getTime();
  }

  wasRevokedBefore(date: Date): boolean {
    return (
      this.props.revokedAt !== undefined &&
      this.props.revokedAt.getTime() < date.getTime()
    );
  }

  wasRevokedAfter(date: Date): boolean {
    return (
      this.props.revokedAt !== undefined &&
      this.props.revokedAt.getTime() > date.getTime()
    );
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: TrustProfileBadgeEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { TrustProfileBadgeProps };
