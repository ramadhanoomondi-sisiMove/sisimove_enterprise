// src/domains/trust/domain/entities/trust-profile.entity.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { MemberPublicId } from '../value-objects/member-public-id.vo';
import type { TrustProfileId } from '../value-objects/trust-profile-id.vo';

import {
  TrustProfileStatus,
  TrustProfileStatusValueObject,
} from '../value-objects/trust-profile-status.vo';

import {
  TrustVerificationLevel,
  TrustVerificationLevelValueObject,
} from '../value-objects/trust-verification-level.vo';

import type { TrustRatingAverage } from '../value-objects/trust-rating-average.vo';
import type { TrustRatingCount } from '../value-objects/trust-rating-count.vo';
import type { TrustCompletionRate } from '../value-objects/trust-completion-rate.vo';
import type { TrustCancellationRate } from '../value-objects/trust-cancellation-rate.vo';

import { CompletedJourneys } from '../value-objects/completed-journeys.vo';
import { ProviderJourneys } from '../value-objects/provider-journeys.vo';
import { PassengerJourneys } from '../value-objects/passenger-journeys.vo';
import { CompletedProviderJourneys } from '../value-objects/completed-provider-journeys.vo';
import { CompletedPassengerJourneys } from '../value-objects/completed-passenger-journeys.vo';
import { CancelledJourneys } from '../value-objects/cancelled-journeys.vo';
import { ProviderCancellations } from '../value-objects/provider-cancellations.vo';
import { PassengerCancellations } from '../value-objects/passenger-cancellations.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface TrustProfileProps {
  publicId: TrustProfileId;

  memberPublicId: MemberPublicId;

  status: TrustProfileStatusValueObject;
  verificationLevel: TrustVerificationLevelValueObject;

  ratingAverage: TrustRatingAverage;
  ratingCount: TrustRatingCount;

  completedJourneys: CompletedJourneys;
  providerJourneys: ProviderJourneys;
  passengerJourneys: PassengerJourneys;

  completedProviderJourneys: CompletedProviderJourneys;
  completedPassengerJourneys: CompletedPassengerJourneys;

  cancelledJourneys: CancelledJourneys;
  providerCancellations: ProviderCancellations;
  passengerCancellations: PassengerCancellations;

  completionRate: TrustCompletionRate;
  cancellationRate: TrustCancellationRate;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class TrustProfileEntity extends Entity<TrustProfileProps> {
  private constructor(props: TrustProfileProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: TrustProfileProps): TrustProfileEntity {
    return new TrustProfileEntity(props);
  }

  public static rehydrate(
    props: TrustProfileProps,
    id: UniqueEntityId,
  ): TrustProfileEntity {
    return new TrustProfileEntity(props, id);
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

  get memberPublicId(): MemberPublicId {
    return this.props.memberPublicId;
  }

  get status(): TrustProfileStatusValueObject {
    return this.props.status;
  }

  get verificationLevel(): TrustVerificationLevelValueObject {
    return this.props.verificationLevel;
  }

  get ratingAverage(): TrustRatingAverage {
    return this.props.ratingAverage;
  }

  get ratingCount(): TrustRatingCount {
    return this.props.ratingCount;
  }

  get completedJourneys(): CompletedJourneys {
    return this.props.completedJourneys;
  }

  get providerJourneys(): ProviderJourneys {
    return this.props.providerJourneys;
  }

  get passengerJourneys(): PassengerJourneys {
    return this.props.passengerJourneys;
  }

  get completedProviderJourneys(): CompletedProviderJourneys {
    return this.props.completedProviderJourneys;
  }

  get completedPassengerJourneys(): CompletedPassengerJourneys {
    return this.props.completedPassengerJourneys;
  }

  get cancelledJourneys(): CancelledJourneys {
    return this.props.cancelledJourneys;
  }

  get providerCancellations(): ProviderCancellations {
    return this.props.providerCancellations;
  }

  get passengerCancellations(): PassengerCancellations {
    return this.props.passengerCancellations;
  }

  get completionRate(): TrustCompletionRate {
    return this.props.completionRate;
  }

  get cancellationRate(): TrustCancellationRate {
    return this.props.cancellationRate;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // ---------------------------------------------------------------------------
  // State Mutators
  // ---------------------------------------------------------------------------

  setStatus(status: TrustProfileStatusValueObject): void {
    this.props.status = status;
  }

  setVerificationLevel(
    verificationLevel: TrustVerificationLevelValueObject,
  ): void {
    this.props.verificationLevel = verificationLevel;
  }

  setRatingAverage(ratingAverage: TrustRatingAverage): void {
    this.props.ratingAverage = ratingAverage;
  }

  setRatingCount(ratingCount: TrustRatingCount): void {
    this.props.ratingCount = ratingCount;
  }

  setCompletedJourneys(completedJourneys: CompletedJourneys): void {
    this.props.completedJourneys = completedJourneys;
  }

  setProviderJourneys(providerJourneys: ProviderJourneys): void {
    this.props.providerJourneys = providerJourneys;
  }

  setPassengerJourneys(passengerJourneys: PassengerJourneys): void {
    this.props.passengerJourneys = passengerJourneys;
  }

  setCompletedProviderJourneys(
    completedProviderJourneys: CompletedProviderJourneys,
  ): void {
    this.props.completedProviderJourneys = completedProviderJourneys;
  }

  setCompletedPassengerJourneys(
    completedPassengerJourneys: CompletedPassengerJourneys,
  ): void {
    this.props.completedPassengerJourneys = completedPassengerJourneys;
  }

  setCancelledJourneys(cancelledJourneys: CancelledJourneys): void {
    this.props.cancelledJourneys = cancelledJourneys;
  }

  setProviderCancellations(providerCancellations: ProviderCancellations): void {
    this.props.providerCancellations = providerCancellations;
  }

  setPassengerCancellations(
    passengerCancellations: PassengerCancellations,
  ): void {
    this.props.passengerCancellations = passengerCancellations;
  }

  setCompletionRate(completionRate: TrustCompletionRate): void {
    this.props.completionRate = completionRate;
  }

  setCancellationRate(cancellationRate: TrustCancellationRate): void {
    this.props.cancellationRate = cancellationRate;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  activate(): void {
    this.props.status = new TrustProfileStatusValueObject(
      TrustProfileStatus.ACTIVE,
    );
  }

  restrict(): void {
    this.props.status = new TrustProfileStatusValueObject(
      TrustProfileStatus.RESTRICTED,
    );
  }

  suspend(): void {
    this.props.status = new TrustProfileStatusValueObject(
      TrustProfileStatus.SUSPENDED,
    );
  }

  // ---------------------------------------------------------------------------
  // Verification Lifecycle
  // ---------------------------------------------------------------------------

  setVerification(level: TrustVerificationLevel): void {
    this.props.verificationLevel = new TrustVerificationLevelValueObject(level);
  }

  clearVerification(): void {
    this.props.verificationLevel = new TrustVerificationLevelValueObject(
      TrustVerificationLevel.NONE,
    );
  }

  // ---------------------------------------------------------------------------
  // Rating Statistics
  // ---------------------------------------------------------------------------

  setRatingStatistics(
    ratingAverage: TrustRatingAverage,
    ratingCount: TrustRatingCount,
  ): void {
    this.props.ratingAverage = ratingAverage;
    this.props.ratingCount = ratingCount;
  }

  // ---------------------------------------------------------------------------
  // Journey Statistics
  //
  // These methods intentionally mutate only the materialized Trust projection.
  // Journey remains authoritative for journey lifecycle facts.
  // ---------------------------------------------------------------------------

  incrementCompletedJourneys(): void {
    this.props.completedJourneys = new CompletedJourneys(
      this.props.completedJourneys.value + 1,
    );
  }

  incrementProviderJourneys(): void {
    this.props.providerJourneys = new ProviderJourneys(
      this.props.providerJourneys.value + 1,
    );
  }

  incrementPassengerJourneys(): void {
    this.props.passengerJourneys = new PassengerJourneys(
      this.props.passengerJourneys.value + 1,
    );
  }

  incrementCompletedProviderJourneys(): void {
    this.props.completedProviderJourneys = new CompletedProviderJourneys(
      this.props.completedProviderJourneys.value + 1,
    );
  }

  incrementCompletedPassengerJourneys(): void {
    this.props.completedPassengerJourneys = new CompletedPassengerJourneys(
      this.props.completedPassengerJourneys.value + 1,
    );
  }

  incrementCancelledJourneys(): void {
    this.props.cancelledJourneys = new CancelledJourneys(
      this.props.cancelledJourneys.value + 1,
    );
  }

  incrementProviderCancellations(): void {
    this.props.providerCancellations = new ProviderCancellations(
      this.props.providerCancellations.value + 1,
    );
  }

  incrementPassengerCancellations(): void {
    this.props.passengerCancellations = new PassengerCancellations(
      this.props.passengerCancellations.value + 1,
    );
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  isActive(): boolean {
    return this.props.status.isActive;
  }

  isRestricted(): boolean {
    return this.props.status.isRestricted;
  }

  isSuspended(): boolean {
    return this.props.status.isSuspended;
  }

  isVerified(): boolean {
    return (
      this.props.verificationLevel.isVerified ||
      this.props.verificationLevel.isHighlyVerified
    );
  }

  isHighlyVerified(): boolean {
    return this.props.verificationLevel.isHighlyVerified;
  }

  hasVerification(): boolean {
    return !this.props.verificationLevel.isNone;
  }

  hasRatings(): boolean {
    return this.props.ratingCount.hasRatings;
  }

  hasCompletedJourneys(): boolean {
    return this.props.completedJourneys.hasJourneys;
  }

  hasProviderJourneys(): boolean {
    return this.props.providerJourneys.hasJourneys;
  }

  hasPassengerJourneys(): boolean {
    return this.props.passengerJourneys.hasJourneys;
  }

  hasProviderCancellations(): boolean {
    return this.props.providerCancellations.hasCancellations;
  }

  hasPassengerCancellations(): boolean {
    return this.props.passengerCancellations.hasCancellations;
  }

  hasCancellations(): boolean {
    return this.props.cancelledJourneys.hasCancellations;
  }

  hasPerfectRating(): boolean {
    return this.props.ratingAverage.isPerfect;
  }

  hasPerfectCompletionRate(): boolean {
    return this.props.completionRate.isComplete;
  }

  belongsToMember(memberPublicId: MemberPublicId): boolean {
    return this.props.memberPublicId.equals(memberPublicId);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: TrustProfileEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { TrustProfileProps };
