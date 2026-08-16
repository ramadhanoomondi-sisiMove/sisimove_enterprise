// src/domains/journey/domain/aggregates/journey.aggregate.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyEntity } from '../entities/journey.entity';
import type { JourneyCorridorEntity } from '../entities/journey-corridor.entity';
import type { JourneyWaypointEntity } from '../entities/journey-waypoint.entity';
import type { JourneyScheduleEntity } from '../entities/journey-schedule.entity';
import type { JourneyVehicleEntity } from '../entities/journey-vehicle.entity';
import type { JourneyCapacityEntity } from '../entities/journey-capacity.entity';
import type { JourneyPricingEntity } from '../entities/journey-pricing.entity';
import type { JourneyPreferencesEntity } from '../entities/journey-preferences.entity';
import type { JourneyAssetEntity } from '../entities/journey-asset.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import {
  JourneyCancelledEvent,
  JourneyCompletedEvent,
  JourneyExpiredEvent,
  JourneyPublishedEvent,
  JourneyStartedEvent,
} from '../events';

import type { JourneyDomainEvent } from '../events';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyId } from '../value-objects/journey-id.vo';
import type { JourneyProviderPublicId } from '../value-objects/journey-provider-public-id.vo';

import {
  JourneyStatus,
  JourneyStatusValueObject,
} from '../value-objects/journey-status.vo';

import type { JourneyCorridorId } from '../value-objects/journey-corridor-id.vo';
import type { JourneyWaypointId } from '../value-objects/journey-waypoint-id.vo';
import type { JourneyScheduleId } from '../value-objects/journey-schedule-id.vo';
import type { JourneyVehicleId } from '../value-objects/journey-vehicle-id.vo';
import type { JourneyCapacityId } from '../value-objects/journey-capacity-id.vo';
import type { JourneyPricingId } from '../value-objects/journey-pricing-id.vo';
import type { JourneyPreferencesId } from '../value-objects/journey-preferences-id.vo';
import type { JourneyAssetId } from '../value-objects/journey-asset-id.vo';
import type { JourneyAssetPublicIdReference } from '../value-objects/journey-asset-public-id-reference.vo';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

/**
 * Aggregate root for the Journey domain.
 *
 * JourneyEntity is the canonical state holder.
 * Child entities are owned by JourneyEntity and are not duplicated inside
 * JourneyAggregate.
 *
 * Aggregate boundary:
 *
 * JourneyAggregate
 * ├── JourneyEntity
 * ├── JourneyCorridorEntity?
 * │   └── JourneyWaypointEntity[]
 * ├── JourneyScheduleEntity?
 * ├── JourneyVehicleEntity?
 * ├── JourneyCapacityEntity?
 * ├── JourneyPricingEntity?
 * ├── JourneyPreferencesEntity?
 * └── JourneyAssetEntity[]
 */
export class JourneyAggregate extends AggregateRoot<JourneyEntity> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(journey: JourneyEntity, id?: UniqueEntityId) {
    super(journey, id);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(journey: JourneyEntity): JourneyAggregate {
    return new JourneyAggregate(journey, journey.id);
  }

  /**
   * Rehydrate the complete Journey aggregate.
   *
   * Persistence reconstructs the aggregate by supplying the root entity and
   * its owned child entities. JourneyEntity remains the single canonical
   * aggregate state container.
   */
  public static rehydrate(
    journey: JourneyEntity,
    corridor?: JourneyCorridorEntity,
    schedule?: JourneyScheduleEntity,
    vehicle?: JourneyVehicleEntity,
    capacity?: JourneyCapacityEntity,
    pricing?: JourneyPricingEntity,
    preferences?: JourneyPreferencesEntity,
    waypoints: JourneyWaypointEntity[] = [],
    assets: JourneyAssetEntity[] = [],
  ): JourneyAggregate {
    const aggregate = new JourneyAggregate(journey, journey.id);

    // -------------------------------------------------------------------------
    // Corridor / Waypoints
    // -------------------------------------------------------------------------

    if (corridor !== undefined) {
      corridor.setWaypoints(waypoints);
      journey.setCorridor(corridor);
    } else if (waypoints.length > 0) {
      throw new Error(
        'Cannot rehydrate Journey waypoints without a Journey corridor.',
      );
    }

    // -------------------------------------------------------------------------
    // Optional Components
    // -------------------------------------------------------------------------

    journey.setSchedule(schedule);
    journey.setVehicle(vehicle);
    journey.setCapacity(capacity);
    journey.setPricing(pricing);
    journey.setPreferences(preferences);

    // -------------------------------------------------------------------------
    // Assets
    // -------------------------------------------------------------------------

    journey.setAssets(assets);

    return aggregate;
  }

  // ===========================================================================
  // Aggregate Identity
  // ===========================================================================

  public get journey(): JourneyEntity {
    return this.props;
  }

  public get aggregateId(): UniqueEntityId {
    return this.id;
  }

  public get journeyId(): JourneyId {
    return new JourneyId(this.publicId.value);
  }

  // ===========================================================================
  // Provider
  // ===========================================================================

  public get providerPublicId(): JourneyProviderPublicId {
    return this.journey.providerPublicId;
  }

  public belongsToProvider(providerPublicId: JourneyProviderPublicId): boolean {
    return this.journey.belongsToProvider(providerPublicId);
  }

  // ===========================================================================
  // Lifecycle State
  // ===========================================================================

  public get status(): JourneyStatusValueObject {
    return this.journey.status;
  }

  public get publishedAt(): Date | undefined {
    return this.journey.publishedAt;
  }

  public get startedAt(): Date | undefined {
    return this.journey.startedAt;
  }

  public get completionRequestedAt(): Date | undefined {
    return this.journey.completionRequestedAt;
  }

  public get completedAt(): Date | undefined {
    return this.journey.completedAt;
  }

  public get cancelledAt(): Date | undefined {
    return this.journey.cancelledAt;
  }

  public get expiredAt(): Date | undefined {
    return this.journey.expiredAt;
  }

  public get version(): number {
    return this.journey.version;
  }

  // ===========================================================================
  // Components
  // ===========================================================================

  public get corridor(): JourneyCorridorEntity | undefined {
    return this.journey.corridor;
  }

  public get schedule(): JourneyScheduleEntity | undefined {
    return this.journey.schedule;
  }

  public get vehicle(): JourneyVehicleEntity | undefined {
    return this.journey.vehicle;
  }

  public get capacity(): JourneyCapacityEntity | undefined {
    return this.journey.capacity;
  }

  public get pricing(): JourneyPricingEntity | undefined {
    return this.journey.pricing;
  }

  public get preferences(): JourneyPreferencesEntity | undefined {
    return this.journey.preferences;
  }

  public get waypoints(): readonly JourneyWaypointEntity[] {
    return this.journey.corridor?.waypoints ?? [];
  }

  public get assets(): readonly JourneyAssetEntity[] {
    return this.journey.assets;
  }

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  public publish(
    correlationId: string,
    causationId?: string,
    publishedAt: Date = new Date(),
  ): void {
    if (!this.canPublish()) {
      return;
    }

    this.journey.setStatus(
      new JourneyStatusValueObject(JourneyStatus.PUBLISHED),
    );

    this.journey.setPublishedAt(publishedAt);
    this.journey.setUpdatedAt(publishedAt);
    this.journey.incrementVersion();

    this.addDomainEvent(
      new JourneyPublishedEvent(
        this.id.toString(),
        this.journey.publicId.value,
        this.providerPublicId.value,
        publishedAt,
        correlationId,
        causationId,
      ),
    );
  }

  public start(
    correlationId: string,
    causationId?: string,
    startedAt: Date = new Date(),
  ): void {
    if (!this.canStart()) {
      return;
    }

    this.journey.setStatus(
      new JourneyStatusValueObject(JourneyStatus.IN_PROGRESS),
    );

    this.journey.setStartedAt(startedAt);
    this.journey.setUpdatedAt(startedAt);
    this.journey.incrementVersion();

    this.addDomainEvent(
      new JourneyStartedEvent(
        this.id.toString(),
        this.journey.publicId.value,
        this.providerPublicId.value,
        startedAt,
        correlationId,
        causationId,
      ),
    );
  }

  public complete(
    correlationId: string,
    causationId?: string,
    completedAt: Date = new Date(),
  ): void {
    if (!this.canComplete()) {
      return;
    }

    this.journey.setStatus(
      new JourneyStatusValueObject(JourneyStatus.COMPLETED),
    );

    this.journey.setCompletedAt(completedAt);
    this.journey.setUpdatedAt(completedAt);
    this.journey.incrementVersion();

    this.addDomainEvent(
      new JourneyCompletedEvent(
        this.id.toString(),
        this.journey.publicId.value,
        this.providerPublicId.value,
        completedAt,
        correlationId,
        causationId,
      ),
    );
  }

  public cancel(
    correlationId: string,
    causationId?: string,
    cancelledAt: Date = new Date(),
    reason?: string,
  ): void {
    if (!this.canCancel()) {
      return;
    }

    this.journey.setStatus(
      new JourneyStatusValueObject(JourneyStatus.CANCELLED),
    );

    this.journey.setCancelledAt(cancelledAt);
    this.journey.setUpdatedAt(cancelledAt);
    this.journey.incrementVersion();

    this.addDomainEvent(
      new JourneyCancelledEvent(
        this.id.toString(),
        this.journey.publicId.value,
        this.providerPublicId.value,
        cancelledAt,
        reason,
        correlationId,
        causationId,
      ),
    );
  }

  public expire(
    correlationId: string,
    causationId?: string,
    expiredAt: Date = new Date(),
  ): void {
    if (!this.canExpire()) {
      return;
    }

    this.journey.setStatus(new JourneyStatusValueObject(JourneyStatus.EXPIRED));

    this.journey.setExpiredAt(expiredAt);
    this.journey.setUpdatedAt(expiredAt);
    this.journey.incrementVersion();

    this.addDomainEvent(
      new JourneyExpiredEvent(
        this.id.toString(),
        this.journey.publicId.value,
        this.providerPublicId.value,
        expiredAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isDraft(): boolean {
    return this.journey.status.value === JourneyStatus.DRAFT;
  }

  public isPublished(): boolean {
    return this.journey.status.value === JourneyStatus.PUBLISHED;
  }

  public isInProgress(): boolean {
    return this.journey.status.value === JourneyStatus.IN_PROGRESS;
  }

  public isCompleted(): boolean {
    return this.journey.status.value === JourneyStatus.COMPLETED;
  }

  public isCancelled(): boolean {
    return this.journey.status.value === JourneyStatus.CANCELLED;
  }

  public isExpired(): boolean {
    return this.journey.status.value === JourneyStatus.EXPIRED;
  }

  public isActive(): boolean {
    return this.isPublished() || this.isInProgress();
  }

  public isTerminal(): boolean {
    return this.isCompleted() || this.isCancelled() || this.isExpired();
  }

  // ===========================================================================
  // Lifecycle Capabilities
  // ===========================================================================

  public canPublish(): boolean {
    return this.isDraft() && this.hasRequiredComponents();
  }

  public canStart(): boolean {
    return this.isPublished();
  }

  public canComplete(): boolean {
    return this.isInProgress();
  }

  public canCancel(): boolean {
    return !this.isTerminal();
  }

  public canExpire(): boolean {
    return !this.isTerminal();
  }

  // ===========================================================================
  // Corridor
  // ===========================================================================

  public attachCorridor(corridor: JourneyCorridorEntity): void {
    this.journey.setCorridor(corridor);
  }

  public removeCorridor(): void {
    if (this.hasWaypoints()) {
      throw new Error(
        'Cannot remove JourneyCorridor while waypoints are attached.',
      );
    }

    this.journey.setCorridor(undefined);
  }

  public hasCorridor(): boolean {
    return this.journey.hasCorridor();
  }

  public get corridorId(): JourneyCorridorId | undefined {
    return this.corridor?.publicId as JourneyCorridorId | undefined;
  }

  // ===========================================================================
  // Waypoints
  // ===========================================================================

  public addWaypoint(waypoint: JourneyWaypointEntity): void {
    const corridor = this.corridor;

    if (corridor === undefined) {
      throw new Error(
        'A Journey corridor is required before adding waypoints.',
      );
    }

    if (corridor.containsWaypoint(waypoint)) {
      return;
    }

    corridor.addWaypoint(waypoint);
  }

  public removeWaypoint(waypointId: JourneyWaypointId): void {
    const corridor = this.corridor;

    if (corridor === undefined) {
      return;
    }

    const waypoint = corridor.waypoints.find((candidate) =>
      candidate.id.equals(waypointId),
    );

    if (waypoint !== undefined) {
      corridor.removeWaypoint(waypoint);
    }
  }

  public getWaypointById(
    waypointId: JourneyWaypointId,
  ): JourneyWaypointEntity | undefined {
    return this.corridor?.waypoints.find((waypoint) =>
      waypoint.id.equals(waypointId),
    );
  }

  public hasWaypoint(waypointId: JourneyWaypointId): boolean {
    return this.getWaypointById(waypointId) !== undefined;
  }

  public hasWaypoints(): boolean {
    return this.corridor?.hasWaypoints() ?? false;
  }

  public getWaypointCount(): number {
    return this.corridor?.waypointCount() ?? 0;
  }

  // ===========================================================================
  // Schedule
  // ===========================================================================

  public attachSchedule(schedule: JourneyScheduleEntity): void {
    this.journey.setSchedule(schedule);
  }

  public removeSchedule(): void {
    this.journey.setSchedule(undefined);
  }

  public hasSchedule(): boolean {
    return this.journey.hasSchedule();
  }

  public get scheduleId(): JourneyScheduleId | undefined {
    return this.schedule?.publicId as JourneyScheduleId | undefined;
  }

  // ===========================================================================
  // Vehicle
  // ===========================================================================

  public attachVehicle(vehicle: JourneyVehicleEntity): void {
    this.journey.setVehicle(vehicle);
  }

  public removeVehicle(): void {
    this.journey.setVehicle(undefined);
  }

  public hasVehicle(): boolean {
    return this.journey.hasVehicle();
  }

  public get vehicleId(): JourneyVehicleId | undefined {
    return this.vehicle?.publicId as JourneyVehicleId | undefined;
  }

  // ===========================================================================
  // Capacity
  // ===========================================================================

  public attachCapacity(capacity: JourneyCapacityEntity): void {
    this.journey.setCapacity(capacity);
  }

  public removeCapacity(): void {
    this.journey.setCapacity(undefined);
  }

  public hasCapacity(): boolean {
    return this.journey.hasCapacity();
  }

  public get capacityId(): JourneyCapacityId | undefined {
    return this.capacity?.publicId as JourneyCapacityId | undefined;
  }

  // ===========================================================================
  // Pricing
  // ===========================================================================

  public attachPricing(pricing: JourneyPricingEntity): void {
    this.journey.setPricing(pricing);
  }

  public removePricing(): void {
    this.journey.setPricing(undefined);
  }

  public hasPricing(): boolean {
    return this.journey.hasPricing();
  }

  public get pricingId(): JourneyPricingId | undefined {
    return this.pricing?.publicId as JourneyPricingId | undefined;
  }

  // ===========================================================================
  // Preferences
  // ===========================================================================

  public attachPreferences(preferences: JourneyPreferencesEntity): void {
    this.journey.setPreferences(preferences);
  }

  public removePreferences(): void {
    this.journey.setPreferences(undefined);
  }

  public hasPreferences(): boolean {
    return this.journey.hasPreferences();
  }

  public get preferencesId(): JourneyPreferencesId | undefined {
    return this.preferences?.publicId as JourneyPreferencesId | undefined;
  }

  // ===========================================================================
  // Assets
  // ===========================================================================

  public attachAsset(asset: JourneyAssetEntity): void {
    if (this.journey.assets.some((existing) => existing.id.equals(asset.id))) {
      return;
    }

    this.journey.addAsset(asset);
  }

  public removeAsset(assetId: JourneyAssetId): void {
    const asset = this.getAssetById(assetId);

    if (asset !== undefined) {
      this.journey.removeAsset(asset);
    }
  }

  /**
   * Remove a Journey asset using its public asset reference.
   *
   * The reference is resolved inside the aggregate boundary so that the
   * application layer does not need to know how JourneyAssetEntity stores
   * or matches its external asset reference.
   */
  public removeAssetByReference(
    assetPublicId: JourneyAssetPublicIdReference,
  ): void {
    const asset = this.getAssetByReference(assetPublicId);

    if (asset === undefined) {
      return;
    }

    this.journey.removeAsset(asset);
  }

  public getAssetById(assetId: JourneyAssetId): JourneyAssetEntity | undefined {
    return this.journey.assets.find((asset) => asset.id.equals(assetId));
  }

  public getAssetByReference(
    assetPublicId: JourneyAssetPublicIdReference,
  ): JourneyAssetEntity | undefined {
    return this.journey.assets.find((asset) =>
      asset.referencesAsset(assetPublicId),
    );
  }

  public hasAsset(assetId: JourneyAssetId): boolean {
    return this.getAssetById(assetId) !== undefined;
  }

  public hasAssets(): boolean {
    return this.journey.hasAssets();
  }

  public getAssetCount(): number {
    return this.journey.assetCount();
  }
  // ===========================================================================
  // Aggregate Invariants
  // ===========================================================================

  /**
   * Components required before a Journey can be published.
   *
   * Preferences and Journey assets remain optional.
   */
  public hasRequiredComponents(): boolean {
    return (
      this.hasCorridor() &&
      this.hasSchedule() &&
      this.hasVehicle() &&
      this.hasCapacity() &&
      this.hasPricing()
    );
  }

  // ===========================================================================
  // Event Recording
  // ===========================================================================

  public recordDomainEvent(event: JourneyDomainEvent): void {
    this.addDomainEvent(event);
  }
}
