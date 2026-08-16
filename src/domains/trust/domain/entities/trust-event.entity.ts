// src/domains/trust/domain/entities/trust-event.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { TrustEventId } from '../value-objects/trust-event-id.vo';
import type { TrustProfileId } from '../value-objects/trust-profile-id.vo';

import type { JourneyPublicId } from '../value-objects/journey-public-id.vo';
import type { BookingPublicId } from '../value-objects/booking-public-id.vo';
import type { RatingPublicId } from '../value-objects/rating-public-id.vo';
import type { BadgePublicId } from '../value-objects/badge-public-id.vo';
import type { DisputePublicId } from '../value-objects/dispute-public-id.vo';
import type { ActorPublicId } from '../value-objects/actor-public-id.vo';

import type { TrustEventTypeValueObject } from '../value-objects/trust-event-type.vo';

import type { TrustEventReason } from '../value-objects/trust-event-reason.vo';
import type { TrustEventMetadata } from '../value-objects/trust-event-metadata.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface TrustEventProps {
  publicId: TrustEventId;

  profileId: TrustProfileId;

  type: TrustEventTypeValueObject;

  journeyPublicId: JourneyPublicId | undefined;
  bookingPublicId: BookingPublicId | undefined;
  ratingPublicId: RatingPublicId | undefined;
  badgePublicId: BadgePublicId | undefined;
  disputePublicId: DisputePublicId | undefined;
  actorPublicId: ActorPublicId | undefined;

  reason: TrustEventReason | undefined;
  metadata: TrustEventMetadata | undefined;

  createdAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class TrustEventEntity extends Entity<TrustEventProps> {
  private constructor(props: TrustEventProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: TrustEventProps): TrustEventEntity {
    return new TrustEventEntity(props);
  }

  public static rehydrate(
    props: TrustEventProps,
    id: UniqueEntityId,
  ): TrustEventEntity {
    return new TrustEventEntity(props, id);
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

  get type(): TrustEventTypeValueObject {
    return this.props.type;
  }

  get journeyPublicId(): JourneyPublicId | undefined {
    return this.props.journeyPublicId;
  }

  get bookingPublicId(): BookingPublicId | undefined {
    return this.props.bookingPublicId;
  }

  get ratingPublicId(): RatingPublicId | undefined {
    return this.props.ratingPublicId;
  }

  get badgePublicId(): BadgePublicId | undefined {
    return this.props.badgePublicId;
  }

  get disputePublicId(): DisputePublicId | undefined {
    return this.props.disputePublicId;
  }

  get actorPublicId(): ActorPublicId | undefined {
    return this.props.actorPublicId;
  }

  get reason(): TrustEventReason | undefined {
    return this.props.reason;
  }

  get metadata(): TrustEventMetadata | undefined {
    return this.props.metadata;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  // ---------------------------------------------------------------------------
  // Mutators
  // ---------------------------------------------------------------------------

  setType(type: TrustEventTypeValueObject): void {
    this.props.type = type;
  }

  setJourneyPublicId(journeyPublicId: JourneyPublicId | undefined): void {
    this.props.journeyPublicId = journeyPublicId;
  }

  setBookingPublicId(bookingPublicId: BookingPublicId | undefined): void {
    this.props.bookingPublicId = bookingPublicId;
  }

  setRatingPublicId(ratingPublicId: RatingPublicId | undefined): void {
    this.props.ratingPublicId = ratingPublicId;
  }

  setBadgePublicId(badgePublicId: BadgePublicId | undefined): void {
    this.props.badgePublicId = badgePublicId;
  }

  setDisputePublicId(disputePublicId: DisputePublicId | undefined): void {
    this.props.disputePublicId = disputePublicId;
  }

  setActorPublicId(actorPublicId: ActorPublicId | undefined): void {
    this.props.actorPublicId = actorPublicId;
  }

  setReason(reason: TrustEventReason | undefined): void {
    this.props.reason = reason;
  }

  setMetadata(metadata: TrustEventMetadata | undefined): void {
    this.props.metadata = metadata;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  isJourneyCompleted(): boolean {
    return this.props.type.isJourneyCompleted;
  }

  isJourneyCancelled(): boolean {
    return this.props.type.isJourneyCancelled;
  }

  isRatingReceived(): boolean {
    return this.props.type.isRatingReceived;
  }

  isRatingRemoved(): boolean {
    return this.props.type.isRatingRemoved;
  }

  isVerificationGranted(): boolean {
    return this.props.type.isVerificationGranted;
  }

  isVerificationRevoked(): boolean {
    return this.props.type.isVerificationRevoked;
  }

  isBadgeAwarded(): boolean {
    return this.props.type.isBadgeAwarded;
  }

  isBadgeRevoked(): boolean {
    return this.props.type.isBadgeRevoked;
  }

  isDisputeOpened(): boolean {
    return this.props.type.isDisputeOpened;
  }

  isDisputeResolved(): boolean {
    return this.props.type.isDisputeResolved;
  }

  isTrustRestricted(): boolean {
    return this.props.type.isTrustRestricted;
  }

  isTrustRestored(): boolean {
    return this.props.type.isTrustRestored;
  }

  isManualAdjustment(): boolean {
    return this.props.type.isManualAdjustment;
  }

  belongsToProfile(profileId: TrustProfileId): boolean {
    return this.props.profileId.equals(profileId);
  }

  belongsToJourney(journeyPublicId: JourneyPublicId): boolean {
    return this.props.journeyPublicId?.equals(journeyPublicId) ?? false;
  }

  belongsToBooking(bookingPublicId: BookingPublicId): boolean {
    return this.props.bookingPublicId?.equals(bookingPublicId) ?? false;
  }

  referencesRating(ratingPublicId: RatingPublicId): boolean {
    return this.props.ratingPublicId?.equals(ratingPublicId) ?? false;
  }

  referencesBadge(badgePublicId: BadgePublicId): boolean {
    return this.props.badgePublicId?.equals(badgePublicId) ?? false;
  }

  referencesDispute(disputePublicId: DisputePublicId): boolean {
    return this.props.disputePublicId?.equals(disputePublicId) ?? false;
  }

  wasCreatedBy(actorPublicId: ActorPublicId): boolean {
    return this.props.actorPublicId?.equals(actorPublicId) ?? false;
  }

  hasReason(): boolean {
    return this.props.reason !== undefined && !this.props.reason.isEmpty;
  }

  hasMetadata(): boolean {
    return this.props.metadata !== undefined && !this.props.metadata.isEmpty;
  }

  hasJourneyReference(): boolean {
    return this.props.journeyPublicId !== undefined;
  }

  hasBookingReference(): boolean {
    return this.props.bookingPublicId !== undefined;
  }

  hasRatingReference(): boolean {
    return this.props.ratingPublicId !== undefined;
  }

  hasBadgeReference(): boolean {
    return this.props.badgePublicId !== undefined;
  }

  hasDisputeReference(): boolean {
    return this.props.disputePublicId !== undefined;
  }

  hasActorReference(): boolean {
    return this.props.actorPublicId !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: TrustEventEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { TrustEventProps };
