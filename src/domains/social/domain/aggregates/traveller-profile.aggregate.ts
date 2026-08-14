// src/domains/social/domain/aggregates/traveller-profile.aggregate.ts

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { TravellerProfileEntity } from '../entities/traveller-profile.entity';
import type { TravellerProfilePreferencesEntity } from '../entities/traveller-profile-preferences.entity';
import type { TravellerProfileCorridorEntity } from '../entities/traveller-profile-corridor.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import {
  TravellerProfileCreatedEvent,
  TravellerProfileHandleChangedEvent,
  TravellerProfileBioChangedEvent,
  TravellerProfileAvatarChangedEvent,
  TravellerProfileCountryChangedEvent,
  TravellerProfileStatusChangedEvent,
  TravellerProfileVisibilityChangedEvent,
  TravellerProfilePreferencesChangedEvent,
  TravellerProfileCorridorAddedEvent,
  TravellerProfileCorridorUpdatedEvent,
  TravellerProfileCorridorRemovedEvent,
  TravellerProfilePrimaryCorridorChangedEvent,
} from '../events';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import {
  TravellerProfilePreferencesAlreadyExistException,
  TravellerProfilePreferencesNotFoundException,
  TravellerProfileCorridorNotFoundException,
  TravellerProfileCorridorAlreadyExistsException,
  TravellerProfilePrimaryCorridorAlreadyExistsException,
  TravellerProfilePrimaryCorridorNotFoundException,
  TravellerProfileCannotRemovePrimaryCorridorException,
  TravellerProfileCorridorLimitExceededException,
  TravellerProfileInvalidStatusTransitionException,
} from '../exceptions';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { TravellerHandle } from '../value-objects/traveller-handle.vo';
import type { TravellerBio } from '../value-objects/traveller-bio.vo';
import type { AvatarAssetPublicId } from '../value-objects/avatar-asset-public-id.vo';
import type { CountryCode } from '../value-objects/country-code.vo';
import type { MemberPublicId } from '../value-objects/member-public-id.vo';

import {
  TravellerProfileStatus,
  TravellerProfileStatusValueObject,
} from '../value-objects/traveller-profile-status.vo';

import {
  TravellerProfileVisibility,
  TravellerProfileVisibilityValueObject,
} from '../value-objects/traveller-profile-visibility.vo';

import type { TravellerProfileCorridorId } from '../value-objects/traveller-profile-corridor-id.vo';
import type { CorridorKey } from '../value-objects/corridor-key.vo';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_MAX_CORRIDORS = 10;

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

export class TravellerProfileAggregate extends AggregateRoot<TravellerProfileEntity> {
  private preferencesEntity: TravellerProfilePreferencesEntity | undefined;

  private readonly corridorEntities: TravellerProfileCorridorEntity[] = [];

  private constructor(profile: TravellerProfileEntity, id?: UniqueEntityId) {
    super(profile, id);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(
    profile: TravellerProfileEntity,
  ): TravellerProfileAggregate {
    const aggregate = new TravellerProfileAggregate(profile, profile.id);

    aggregate.recordCreatedEvent();

    return aggregate;
  }

  public static rehydrate(
    profile: TravellerProfileEntity,
    preferences?: TravellerProfilePreferencesEntity,
    corridors: TravellerProfileCorridorEntity[] = [],
  ): TravellerProfileAggregate {
    const aggregate = new TravellerProfileAggregate(profile, profile.id);

    if (preferences !== undefined) {
      aggregate.preferencesEntity = preferences;
    }

    aggregate.corridorEntities.push(...corridors);

    return aggregate;
  }

  // ===========================================================================
  // Aggregate Identity
  // ===========================================================================

  public get profile(): TravellerProfileEntity {
    return this.props;
  }

  public get aggregateId(): UniqueEntityId {
    return this.id;
  }

  public get preferences(): TravellerProfilePreferencesEntity | undefined {
    return this.preferencesEntity;
  }

  public get corridors(): readonly TravellerProfileCorridorEntity[] {
    return this.corridorEntities;
  }

  // ===========================================================================
  // Profile Identity
  // ===========================================================================

  public get memberPublicId(): MemberPublicId {
    return this.profile.memberPublicId;
  }

  public get handle(): TravellerHandle {
    return this.profile.handle;
  }

  public get bio(): TravellerBio {
    return this.profile.bio;
  }

  public get avatarAssetPublicId(): AvatarAssetPublicId | undefined {
    return this.profile.avatarAssetPublicId;
  }

  public get countryCode(): CountryCode {
    return this.profile.countryCode;
  }

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  public get status(): TravellerProfileStatusValueObject {
    return this.profile.status;
  }

  public get visibility(): TravellerProfileVisibilityValueObject {
    return this.profile.visibility;
  }

  // ===========================================================================
  // Journey Statistics
  // ===========================================================================

  public get totalJourneys(): number {
    return this.profile.totalJourneys;
  }

  public get completedJourneys(): number {
    return this.profile.completedJourneys;
  }

  public get providerJourneys(): number {
    return this.profile.providerJourneys;
  }

  public get passengerJourneys(): number {
    return this.profile.passengerJourneys;
  }

  public get completedProviderJourneys(): number {
    return this.profile.completedProviderJourneys;
  }

  public get completedPassengerJourneys(): number {
    return this.profile.completedPassengerJourneys;
  }

  // ===========================================================================
  // Profile Mutations
  // ===========================================================================

  public changeHandle(
    handle: TravellerHandle,
    correlationId: string,
    causationId?: string,
  ): void {
    const previousHandle = this.profile.handle;

    if (previousHandle.equals(handle)) {
      return;
    }

    this.profile.setHandle(handle);

    this.addDomainEvent(
      new TravellerProfileHandleChangedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        previousHandle.value,
        handle.value,
        correlationId,
        causationId,
      ),
    );
  }

  public changeBio(
    bio: TravellerBio,
    correlationId: string,
    causationId?: string,
  ): void {
    const previousBio = this.profile.bio;

    if (previousBio.equals(bio)) {
      return;
    }

    this.profile.setBio(bio);

    this.addDomainEvent(
      new TravellerProfileBioChangedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        previousBio.value,
        bio.value,
        correlationId,
        causationId,
      ),
    );
  }

  public setAvatar(
    avatarAssetPublicId: AvatarAssetPublicId | undefined,
    correlationId: string,
    causationId?: string,
  ): void {
    const previousAvatar = this.profile.avatarAssetPublicId;

    const previousValue = previousAvatar?.value ?? null;
    const newValue = avatarAssetPublicId?.value ?? null;

    if (previousValue === newValue) {
      return;
    }

    this.profile.setAvatarAssetPublicId(avatarAssetPublicId);

    this.addDomainEvent(
      new TravellerProfileAvatarChangedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        previousValue,
        newValue,
        correlationId,
        causationId,
      ),
    );
  }

  public changeCountry(
    countryCode: CountryCode,
    correlationId: string,
    causationId?: string,
  ): void {
    const previousCountry = this.profile.countryCode;

    if (previousCountry.equals(countryCode)) {
      return;
    }

    this.profile.setCountryCode(countryCode);

    this.addDomainEvent(
      new TravellerProfileCountryChangedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        previousCountry.value,
        countryCode.value,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Lifecycle Mutations
  // ===========================================================================

  public changeStatus(
    status: TravellerProfileStatus,
    correlationId: string,
    causationId?: string,
  ): void {
    const previousStatus = this.profile.status.value;

    if (previousStatus === status) {
      return;
    }

    if (!this.canTransitionStatus(previousStatus, status)) {
      throw new TravellerProfileInvalidStatusTransitionException(
        previousStatus,
        status,
      );
    }

    this.profile.setStatus(new TravellerProfileStatusValueObject(status));

    this.addDomainEvent(
      new TravellerProfileStatusChangedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        previousStatus,
        status,
        correlationId,
        causationId,
      ),
    );
  }

  public activate(correlationId: string, causationId?: string): void {
    this.changeStatus(
      TravellerProfileStatus.ACTIVE,
      correlationId,
      causationId,
    );
  }

  public restrict(correlationId: string, causationId?: string): void {
    this.changeStatus(
      TravellerProfileStatus.RESTRICTED,
      correlationId,
      causationId,
    );
  }

  public suspend(correlationId: string, causationId?: string): void {
    this.changeStatus(
      TravellerProfileStatus.SUSPENDED,
      correlationId,
      causationId,
    );
  }

  public close(correlationId: string, causationId?: string): void {
    this.changeStatus(
      TravellerProfileStatus.CLOSED,
      correlationId,
      causationId,
    );
  }

  private canTransitionStatus(
    from: TravellerProfileStatus,
    to: TravellerProfileStatus,
  ): boolean {
    switch (from) {
      case TravellerProfileStatus.ACTIVE:
        return (
          to === TravellerProfileStatus.RESTRICTED ||
          to === TravellerProfileStatus.SUSPENDED ||
          to === TravellerProfileStatus.CLOSED
        );

      case TravellerProfileStatus.RESTRICTED:
        return (
          to === TravellerProfileStatus.ACTIVE ||
          to === TravellerProfileStatus.SUSPENDED ||
          to === TravellerProfileStatus.CLOSED
        );

      case TravellerProfileStatus.SUSPENDED:
        return (
          to === TravellerProfileStatus.ACTIVE ||
          to === TravellerProfileStatus.CLOSED
        );

      case TravellerProfileStatus.CLOSED:
        return false;

      default:
        return false;
    }
  }

  // ===========================================================================
  // Visibility
  // ===========================================================================

  public changeVisibility(
    visibility: TravellerProfileVisibility,
    correlationId: string,
    causationId?: string,
  ): void {
    const previousVisibility = this.profile.visibility.value;

    if (previousVisibility === visibility) {
      return;
    }

    this.profile.setVisibility(
      new TravellerProfileVisibilityValueObject(visibility),
    );

    this.addDomainEvent(
      new TravellerProfileVisibilityChangedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        previousVisibility,
        visibility,
        correlationId,
        causationId,
      ),
    );
  }

  public makePublic(correlationId: string, causationId?: string): void {
    this.changeVisibility(
      TravellerProfileVisibility.PUBLIC,
      correlationId,
      causationId,
    );
  }

  public makeLimited(correlationId: string, causationId?: string): void {
    this.changeVisibility(
      TravellerProfileVisibility.LIMITED,
      correlationId,
      causationId,
    );
  }

  public makePrivate(correlationId: string, causationId?: string): void {
    this.changeVisibility(
      TravellerProfileVisibility.PRIVATE,
      correlationId,
      causationId,
    );
  }

  // ===========================================================================
  // Preferences
  // ===========================================================================

  public attachPreferences(
    preferences: TravellerProfilePreferencesEntity,
    correlationId: string,
    causationId?: string,
  ): void {
    if (this.preferencesEntity !== undefined) {
      throw new TravellerProfilePreferencesAlreadyExistException();
    }

    this.preferencesEntity = preferences;

    this.recordPreferencesChangedEvent(correlationId, causationId);
  }

  public changePreferences(
    showJourneyHistory: boolean,
    showJourneyStatistics: boolean,
    allowJourneyInvites: boolean,
    correlationId: string,
    causationId?: string,
  ): void {
    const preferences = this.preferencesEntity;

    if (preferences === undefined) {
      throw new TravellerProfilePreferencesNotFoundException();
    }

    preferences.setShowJourneyHistory(showJourneyHistory);
    preferences.setShowJourneyStatistics(showJourneyStatistics);
    preferences.setAllowJourneyInvites(allowJourneyInvites);

    this.recordPreferencesChangedEvent(correlationId, causationId);
  }

  public removePreferences(): void {
    if (this.preferencesEntity === undefined) {
      throw new TravellerProfilePreferencesNotFoundException();
    }

    this.preferencesEntity = undefined;
  }

  private recordPreferencesChangedEvent(
    correlationId: string,
    causationId?: string,
  ): void {
    const preferences = this.preferencesEntity;

    if (preferences === undefined) {
      return;
    }

    this.addDomainEvent(
      new TravellerProfilePreferencesChangedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        preferences.publicId.value,
        preferences.showJourneyHistory,
        preferences.showJourneyStatistics,
        preferences.allowJourneyInvites,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Corridors
  // ===========================================================================

  public addCorridor(
    corridor: TravellerProfileCorridorEntity,
    correlationId: string,
    causationId?: string,
    maxCorridors = DEFAULT_MAX_CORRIDORS,
  ): void {
    if (this.corridorEntities.length >= maxCorridors) {
      throw new TravellerProfileCorridorLimitExceededException(maxCorridors);
    }

    if (this.hasEquivalentCorridor(corridor)) {
      throw new TravellerProfileCorridorAlreadyExistsException();
    }

    if (corridor.isPrimary && this.getPrimaryCorridor() !== undefined) {
      throw new TravellerProfilePrimaryCorridorAlreadyExistsException();
    }

    this.corridorEntities.push(corridor);

    this.addDomainEvent(
      new TravellerProfileCorridorAddedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        corridor.publicId.value,
        corridor.originName,
        corridor.destinationName,
        corridor.originLatitude,
        corridor.originLongitude,
        corridor.destinationLatitude,
        corridor.destinationLongitude,
        corridor.corridorKey.value,
        corridor.isPrimary,
        correlationId,
        causationId,
      ),
    );
  }

  public updateCorridor(
    corridorId: TravellerProfileCorridorId,
    correlationId: string,
    causationId?: string,
  ): void {
    const corridor = this.getCorridorById(corridorId);

    if (corridor === undefined) {
      throw new TravellerProfileCorridorNotFoundException();
    }

    this.addDomainEvent(
      new TravellerProfileCorridorUpdatedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        corridor.publicId.value,
        corridor.originName,
        corridor.destinationName,
        corridor.originLatitude,
        corridor.originLongitude,
        corridor.destinationLatitude,
        corridor.destinationLongitude,
        corridor.corridorKey.value,
        corridor.isPrimary,
        correlationId,
        causationId,
      ),
    );
  }

  public removeCorridor(
    corridorId: TravellerProfileCorridorId,
    correlationId: string,
    causationId?: string,
  ): void {
    const index = this.corridorEntities.findIndex((corridor) =>
      corridor.publicId.equals(corridorId),
    );

    if (index === -1) {
      throw new TravellerProfileCorridorNotFoundException();
    }

    const corridor = this.corridorEntities[index];

    if (corridor === undefined) {
      throw new TravellerProfileCorridorNotFoundException();
    }

    if (corridor.isPrimary) {
      throw new TravellerProfileCannotRemovePrimaryCorridorException();
    }

    this.corridorEntities.splice(index, 1);

    this.addDomainEvent(
      new TravellerProfileCorridorRemovedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        corridor.publicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  public setPrimaryCorridor(
    corridorId: TravellerProfileCorridorId,
    correlationId: string,
    causationId?: string,
  ): void {
    const corridor = this.getCorridorById(corridorId);

    if (corridor === undefined) {
      throw new TravellerProfileCorridorNotFoundException();
    }

    const currentPrimary = this.getPrimaryCorridor();

    if (currentPrimary?.publicId.equals(corridor.publicId)) {
      return;
    }

    if (currentPrimary !== undefined) {
      currentPrimary.makeNonPrimary();
    }

    corridor.makePrimary();

    this.addDomainEvent(
      new TravellerProfilePrimaryCorridorChangedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        currentPrimary?.publicId.value ?? null,
        corridor.publicId.value,
        correlationId,
        causationId,
      ),
    );
  }

  public clearPrimaryCorridor(): void {
    const primary = this.getPrimaryCorridor();

    if (primary === undefined) {
      throw new TravellerProfilePrimaryCorridorNotFoundException();
    }

    primary.makeNonPrimary();
  }

  // ===========================================================================
  // Corridor Queries
  // ===========================================================================

  public getCorridorById(
    corridorId: TravellerProfileCorridorId,
  ): TravellerProfileCorridorEntity | undefined {
    return this.corridorEntities.find((corridor) =>
      corridor.publicId.equals(corridorId),
    );
  }

  public getCorridorByPublicId(
    publicId: string,
  ): TravellerProfileCorridorEntity | undefined {
    return this.corridorEntities.find(
      (corridor) => corridor.publicId.value === publicId,
    );
  }

  public getPrimaryCorridor(): TravellerProfileCorridorEntity | undefined {
    return this.corridorEntities.find((corridor) => corridor.isPrimary);
  }

  public hasPrimaryCorridor(): boolean {
    return this.getPrimaryCorridor() !== undefined;
  }

  public hasCorridors(): boolean {
    return this.corridorEntities.length > 0;
  }

  public corridorCount(): number {
    return this.corridorEntities.length;
  }

  public hasCorridor(corridorId: TravellerProfileCorridorId): boolean {
    return this.getCorridorById(corridorId) !== undefined;
  }

  public hasCorridorKey(corridorKey: CorridorKey): boolean {
    return this.corridorEntities.some((corridor) =>
      corridor.hasCorridorKey(corridorKey),
    );
  }

  private hasEquivalentCorridor(
    corridor: TravellerProfileCorridorEntity,
  ): boolean {
    return this.corridorEntities.some((existing) => {
      if (corridor.corridorKey.hasValue && existing.corridorKey.hasValue) {
        return existing.hasCorridorKey(corridor.corridorKey);
      }

      return existing.connects(corridor.originName, corridor.destinationName);
    });
  }

  // ===========================================================================
  // Journey Statistics Projection
  // ===========================================================================

  public applyJourneyPublished(): void {
    this.profile.incrementTotalJourneys();
  }

  public applyJourneyCompleted(): void {
    this.profile.incrementCompletedJourneys();
  }

  public applyProviderJourneyPublished(): void {
    this.profile.incrementProviderJourneys();
  }

  public applyPassengerJourneyPublished(): void {
    this.profile.incrementPassengerJourneys();
  }

  public applyProviderJourneyCompleted(): void {
    this.profile.incrementCompletedProviderJourneys();
  }

  public applyPassengerJourneyCompleted(): void {
    this.profile.incrementCompletedPassengerJourneys();
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  public isActive(): boolean {
    return this.profile.isActive();
  }

  public isRestricted(): boolean {
    return this.profile.isRestricted();
  }

  public isSuspended(): boolean {
    return this.profile.isSuspended();
  }

  public isClosed(): boolean {
    return this.profile.isClosed();
  }

  public isPublic(): boolean {
    return this.profile.isPublic();
  }

  public isLimitedVisibility(): boolean {
    return this.profile.isLimitedVisibility();
  }

  public isPrivate(): boolean {
    return this.profile.isPrivate();
  }

  public hasAvatar(): boolean {
    return this.profile.hasAvatar();
  }

  public hasBio(): boolean {
    return this.profile.hasBio();
  }

  public belongsToMember(memberPublicId: MemberPublicId): boolean {
    return this.profile.belongsToMember(memberPublicId);
  }

  // ===========================================================================
  // Event Recording
  // ===========================================================================

  private recordCreatedEvent(): void {
    this.addDomainEvent(
      new TravellerProfileCreatedEvent(
        this.id.toString(),
        this.profile.publicId.value,
        this.profile.memberPublicId.value,
        this.profile.handle.value,
        this.profile.bio.value,
        this.profile.avatarAssetPublicId?.value ?? null,
        this.profile.countryCode.value,
        this.profile.status.value,
        this.profile.visibility.value,
        this.id.toString(),
      ),
    );
  }
}
