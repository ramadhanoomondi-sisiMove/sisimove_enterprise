// src/domains/social/domain/entities/traveller-profile.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { AvatarAssetPublicId } from '../value-objects/avatar-asset-public-id.vo';
import type { CountryCode } from '../value-objects/country-code.vo';
import type { MemberPublicId } from '../value-objects/member-public-id.vo';
import type { TravellerBio } from '../value-objects/traveller-bio.vo';
import type { TravellerHandle } from '../value-objects/traveller-handle.vo';
import type { TravellerProfilePublicId } from '../value-objects/traveller-profile-public-id.vo';

import {
  TravellerProfileStatus,
  TravellerProfileStatusValueObject,
} from '../value-objects/traveller-profile-status.vo';

import {
  TravellerProfileVisibility,
  TravellerProfileVisibilityValueObject,
} from '../value-objects/traveller-profile-visibility.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface TravellerProfileProps {
  publicId: TravellerProfilePublicId;

  memberPublicId: MemberPublicId;

  handle: TravellerHandle;
  bio: TravellerBio;

  avatarAssetPublicId: AvatarAssetPublicId | undefined;

  countryCode: CountryCode;

  status: TravellerProfileStatusValueObject;
  visibility: TravellerProfileVisibilityValueObject;

  totalJourneys: number;
  completedJourneys: number;

  providerJourneys: number;
  passengerJourneys: number;

  completedProviderJourneys: number;
  completedPassengerJourneys: number;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class TravellerProfileEntity extends Entity<TravellerProfileProps> {
  private constructor(props: TravellerProfileProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: TravellerProfileProps): TravellerProfileEntity {
    return new TravellerProfileEntity(props);
  }

  public static rehydrate(
    props: TravellerProfileProps,
    id: UniqueEntityId,
  ): TravellerProfileEntity {
    return new TravellerProfileEntity(props, id);
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

  get handle(): TravellerHandle {
    return this.props.handle;
  }

  get bio(): TravellerBio {
    return this.props.bio;
  }

  get avatarAssetPublicId(): AvatarAssetPublicId | undefined {
    return this.props.avatarAssetPublicId;
  }

  get countryCode(): CountryCode {
    return this.props.countryCode;
  }

  get status(): TravellerProfileStatusValueObject {
    return this.props.status;
  }

  get visibility(): TravellerProfileVisibilityValueObject {
    return this.props.visibility;
  }

  get totalJourneys(): number {
    return this.props.totalJourneys;
  }

  get completedJourneys(): number {
    return this.props.completedJourneys;
  }

  get providerJourneys(): number {
    return this.props.providerJourneys;
  }

  get passengerJourneys(): number {
    return this.props.passengerJourneys;
  }

  get completedProviderJourneys(): number {
    return this.props.completedProviderJourneys;
  }

  get completedPassengerJourneys(): number {
    return this.props.completedPassengerJourneys;
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

  setHandle(handle: TravellerHandle): void {
    this.props.handle = handle;
  }

  setBio(bio: TravellerBio): void {
    this.props.bio = bio;
  }

  setAvatarAssetPublicId(
    avatarAssetPublicId: AvatarAssetPublicId | undefined,
  ): void {
    this.props.avatarAssetPublicId = avatarAssetPublicId;
  }

  setCountryCode(countryCode: CountryCode): void {
    this.props.countryCode = countryCode;
  }

  setStatus(status: TravellerProfileStatusValueObject): void {
    this.props.status = status;
  }

  setVisibility(visibility: TravellerProfileVisibilityValueObject): void {
    this.props.visibility = visibility;
  }

  setTotalJourneys(totalJourneys: number): void {
    this.props.totalJourneys = totalJourneys;
  }

  setCompletedJourneys(completedJourneys: number): void {
    this.props.completedJourneys = completedJourneys;
  }

  setProviderJourneys(providerJourneys: number): void {
    this.props.providerJourneys = providerJourneys;
  }

  setPassengerJourneys(passengerJourneys: number): void {
    this.props.passengerJourneys = passengerJourneys;
  }

  setCompletedProviderJourneys(completedProviderJourneys: number): void {
    this.props.completedProviderJourneys = completedProviderJourneys;
  }

  setCompletedPassengerJourneys(completedPassengerJourneys: number): void {
    this.props.completedPassengerJourneys = completedPassengerJourneys;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  activate(): void {
    this.props.status = new TravellerProfileStatusValueObject(
      TravellerProfileStatus.ACTIVE,
    );
  }

  restrict(): void {
    this.props.status = new TravellerProfileStatusValueObject(
      TravellerProfileStatus.RESTRICTED,
    );
  }

  suspend(): void {
    this.props.status = new TravellerProfileStatusValueObject(
      TravellerProfileStatus.SUSPENDED,
    );
  }

  close(): void {
    this.props.status = new TravellerProfileStatusValueObject(
      TravellerProfileStatus.CLOSED,
    );
  }

  makePublic(): void {
    this.props.visibility = new TravellerProfileVisibilityValueObject(
      TravellerProfileVisibility.PUBLIC,
    );
  }

  makeLimited(): void {
    this.props.visibility = new TravellerProfileVisibilityValueObject(
      TravellerProfileVisibility.LIMITED,
    );
  }

  makePrivate(): void {
    this.props.visibility = new TravellerProfileVisibilityValueObject(
      TravellerProfileVisibility.PRIVATE,
    );
  }

  // ---------------------------------------------------------------------------
  // Journey statistics
  //
  // These methods are intentionally simple state mutators. The aggregate or
  // event projection layer remains responsible for deciding when they may be
  // applied.
  // ---------------------------------------------------------------------------

  incrementTotalJourneys(): void {
    this.props.totalJourneys += 1;
  }

  incrementCompletedJourneys(): void {
    this.props.completedJourneys += 1;
  }

  incrementProviderJourneys(): void {
    this.props.providerJourneys += 1;
  }

  incrementPassengerJourneys(): void {
    this.props.passengerJourneys += 1;
  }

  incrementCompletedProviderJourneys(): void {
    this.props.completedProviderJourneys += 1;
  }

  incrementCompletedPassengerJourneys(): void {
    this.props.completedPassengerJourneys += 1;
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

  isClosed(): boolean {
    return this.props.status.isClosed;
  }

  isPublic(): boolean {
    return this.props.visibility.isPublic;
  }

  isLimitedVisibility(): boolean {
    return this.props.visibility.isLimited;
  }

  isPrivate(): boolean {
    return this.props.visibility.isPrivate;
  }

  hasAvatar(): boolean {
    return this.props.avatarAssetPublicId !== undefined;
  }

  hasBio(): boolean {
    return !this.props.bio.isEmpty;
  }

  hasCompletedJourneys(): boolean {
    return this.props.completedJourneys > 0;
  }

  hasProviderJourneys(): boolean {
    return this.props.providerJourneys > 0;
  }

  hasPassengerJourneys(): boolean {
    return this.props.passengerJourneys > 0;
  }

  hasTravellerJourneys(): boolean {
    return this.props.totalJourneys > 0;
  }

  hasHandle(handle: TravellerHandle): boolean {
    return this.props.handle.equals(handle);
  }

  belongsToMember(memberPublicId: MemberPublicId): boolean {
    return this.props.memberPublicId.equals(memberPublicId);
  }

  usesCountry(countryCode: CountryCode): boolean {
    return this.props.countryCode.equals(countryCode);
  }

  usesAvatar(avatarAssetPublicId: AvatarAssetPublicId): boolean {
    return this.props.avatarAssetPublicId?.equals(avatarAssetPublicId) ?? false;
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: TravellerProfileEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { TravellerProfileProps };
