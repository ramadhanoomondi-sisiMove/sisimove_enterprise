// src/domains/social/domain/entities/traveller-profile-preferences.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { TravellerProfilePreferencesId } from '../value-objects/traveller-profile-preferences-id.vo';
import type { TravellerProfileId } from '../value-objects/traveller-profile-id.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface TravellerProfilePreferencesProps {
  publicId: TravellerProfilePreferencesId;

  profileId: TravellerProfileId;

  showJourneyHistory: boolean;
  showJourneyStatistics: boolean;
  allowJourneyInvites: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class TravellerProfilePreferencesEntity extends Entity<TravellerProfilePreferencesProps> {
  private constructor(
    props: TravellerProfilePreferencesProps,
    id?: UniqueEntityId,
  ) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    props: TravellerProfilePreferencesProps,
  ): TravellerProfilePreferencesEntity {
    return new TravellerProfilePreferencesEntity(props);
  }

  public static rehydrate(
    props: TravellerProfilePreferencesProps,
    id: UniqueEntityId,
  ): TravellerProfilePreferencesEntity {
    return new TravellerProfilePreferencesEntity(props, id);
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  override get publicId(): TravellerProfilePreferencesId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  get profileId(): TravellerProfileId {
    return this.props.profileId;
  }

  get showJourneyHistory(): boolean {
    return this.props.showJourneyHistory;
  }

  get showJourneyStatistics(): boolean {
    return this.props.showJourneyStatistics;
  }

  get allowJourneyInvites(): boolean {
    return this.props.allowJourneyInvites;
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

  setShowJourneyHistory(show: boolean): void {
    this.props.showJourneyHistory = show;
  }

  setShowJourneyStatistics(show: boolean): void {
    this.props.showJourneyStatistics = show;
  }

  setAllowJourneyInvites(allow: boolean): void {
    this.props.allowJourneyInvites = allow;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  isJourneyHistoryVisible(): boolean {
    return this.props.showJourneyHistory;
  }

  isJourneyStatisticsVisible(): boolean {
    return this.props.showJourneyStatistics;
  }

  canReceiveJourneyInvites(): boolean {
    return this.props.allowJourneyInvites;
  }

  belongsToProfile(profileId: TravellerProfileId): boolean {
    return this.props.profileId.equals(profileId);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: TravellerProfilePreferencesEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { TravellerProfilePreferencesProps };
