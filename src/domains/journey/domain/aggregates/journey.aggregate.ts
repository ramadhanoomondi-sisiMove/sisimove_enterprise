// src/domains/journey/domain/aggregates/journey.aggregate.ts

// -----------------------------------------------------------------------------
// sisiMove — Journey Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate:
//   JourneyAggregate
//   └── JourneyEntity
//       ├── JourneyCorridorEntity?
//       │   └── JourneyWaypointEntity[]
//       ├── JourneyScheduleEntity?
//       ├── JourneyVehicleEntity?
//       ├── JourneyCapacityEntity?
//       ├── JourneyPricingEntity?
//       ├── JourneyPreferencesEntity?
//       └── JourneyAssetEntity[]
//
// JourneyEntity remains the canonical state holder for the aggregate.
//
// Child entities are owned by JourneyEntity and are therefore not duplicated
// as independent state inside JourneyAggregate.
//
// The aggregate owns:
// - Journey lifecycle transitions;
// - Journey component composition;
// - Journey invariants;
// - aggregate-level ownership checks;
// - domain-event recording.
//
// Public discovery is intentionally NOT an aggregate concern.
//
// Whether a Journey is publicly readable is determined by the repository's
// public-read boundary. The aggregate only exposes its domain state and
// lifecycle capabilities.
// -----------------------------------------------------------------------------

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
 *
 * JourneyAggregate is the domain orchestration boundary for the complete
 * Journey. Application handlers load the aggregate, invoke aggregate behavior,
 * persist the aggregate, and publish its recorded domain events.
 *
 * The application layer must not independently coordinate:
 *
 *   JourneyEntity + JourneyCorridorEntity
 *   JourneyEntity + JourneyWaypointEntity
 *   JourneyEntity + JourneyScheduleEntity
 *   etc.
 *
 * Those relationships belong to this aggregate.
 *
 * Public discovery is deliberately outside this aggregate.
 *
 * The aggregate can answer questions about its own domain state, such as
 * whether the Journey is published or complete. The repository/application
 * read boundary decides whether that state is exposed to external consumers.
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

  /**
   * Create a new Journey aggregate around an existing JourneyEntity.
   *
   * JourneyEntity remains the single canonical state container.
   */
  public static create(journey: JourneyEntity): JourneyAggregate {
    return new JourneyAggregate(journey, journey.id);
  }

  /**
   * Rehydrate the complete Journey aggregate.
   *
   * Persistence reconstructs the aggregate by supplying the root entity and
   * all currently owned child entities.
   *
   * The aggregate re-establishes the ownership relationship between:
   *
   *   JourneyEntity
   *       └── JourneyCorridorEntity
   *               └── JourneyWaypointEntity[]
   *
   * The application/persistence layer therefore does not need to manually
   * maintain child ownership after rehydration.
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

  /**
   * Return the canonical Journey entity owned by this aggregate.
   *
   * JourneyEntity remains the single source of truth for Journey state.
   */
  public get journey(): JourneyEntity {
    return this.props;
  }

  /**
   * Return the aggregate's internal identity.
   */
  public get aggregateId(): UniqueEntityId {
    return this.id;
  }

  /**
   * Return the Journey domain identifier.
   *
   * JourneyId is constructed from the Journey public identifier because that
   * identifier is the stable domain-facing identity of the Journey.
   */
  public get journeyId(): JourneyId {
    return new JourneyId(this.publicId.value);
  }

  // ===========================================================================
  // Provider
  // ===========================================================================

  /**
   * Provider identity associated with this Journey.
   *
   * This is an opaque cross-domain public identifier.
   */
  public get providerPublicId(): JourneyProviderPublicId {
    return this.journey.providerPublicId;
  }

  /**
   * Determine whether this Journey belongs to the supplied provider.
   */
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

  /**
   * Return the waypoints owned by the Journey's corridor.
   *
   * Waypoints are not independently owned by the aggregate root; they are
   * children of JourneyCorridorEntity, which itself is owned by JourneyEntity.
   */
  public get waypoints(): readonly JourneyWaypointEntity[] {
    return this.journey.corridor?.waypoints ?? [];
  }

  /**
   * Return Journey-owned asset attachments.
   */
  public get assets(): readonly JourneyAssetEntity[] {
    return this.journey.assets;
  }

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  /**
   * Publish the Journey.
   *
   * Publishing is allowed only when:
   *
   * - the Journey is currently DRAFT; and
   * - all mandatory Journey components are configured.
   *
   * The aggregate remains responsible for this invariant.
   */
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

  /**
   * Start a published Journey.
   */
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

  /**
   * Complete an in-progress Journey.
   */
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

  /**
   * Cancel the Journey.
   */
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

  /**
   * Expire the Journey.
   */
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

  /**
   * Determine whether the Journey is currently operational.
   */
  public isActive(): boolean {
    return this.isPublished() || this.isInProgress();
  }

  /**
   * Determine whether the Journey has reached a terminal lifecycle state.
   */
  public isTerminal(): boolean {
    return this.isCompleted() || this.isCancelled() || this.isExpired();
  }

  // ===========================================================================
  // Lifecycle Capabilities
  // ===========================================================================

  /**
   * A Journey may only be structurally configured while it is a draft.
   *
   * Once published, the Journey becomes an operational Journey and its
   * structural components are no longer freely replaceable through the
   * configuration operations.
   *
   * This keeps component mutation inside the aggregate lifecycle boundary.
   */
  public canModifyComponents(): boolean {
    return this.isDraft();
  }

  /**
   * A Journey can become publicly discoverable only after all mandatory
   * Journey components have been configured.
   *
   * Public visibility itself remains outside the aggregate.
   */
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

  /**
   * Attach or configure the Journey corridor.
   *
   * A corridor may be attached to a draft Journey when:
   *
   * - no corridor currently exists; or
   * - the existing corridor has no waypoints.
   *
   * Replacing a corridor that already owns waypoints is intentionally
   * prohibited. Such a replacement would implicitly orphan child entities.
   * Waypoint removal must remain an explicit aggregate operation.
   */
  public attachCorridor(corridor: JourneyCorridorEntity): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' corridor while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

    if (this.hasWaypoints()) {
      throw new Error(
        'Cannot replace JourneyCorridor while waypoints are attached.',
      );
    }

    this.journey.setCorridor(corridor);
  }

  /**
   * Remove the Journey corridor.
   *
   * A corridor cannot be removed while it owns waypoints because waypoints
   * are children of the corridor and therefore must not be orphaned.
   */
  public removeCorridor(): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' corridor while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

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

  /**
   * Add a waypoint to the Journey's corridor.
   *
   * The Journey aggregate owns the relationship between corridor and
   * waypoint. The application layer therefore never attaches a waypoint
   * directly to a corridor.
   */
  public addWaypoint(waypoint: JourneyWaypointEntity): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' waypoints while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

    const corridor = this.corridor;

    if (corridor === undefined) {
      throw new Error(
        'A Journey corridor is required before adding waypoints.',
      );
    }

    /**
     * Idempotent behavior for the same Journey-owned waypoint.
     *
     * The corridor remains responsible for determining whether it already
     * contains the supplied child entity.
     */
    if (corridor.containsWaypoint(waypoint)) {
      return;
    }

    corridor.addWaypoint(waypoint);
  }

  /**
   * Remove a Journey-owned waypoint.
   *
   * The application layer supplies only the waypoint identity. The aggregate
   * resolves the child and performs the actual removal.
   */
  public removeWaypoint(waypointId: JourneyWaypointId): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' waypoints while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

    const corridor = this.corridor;

    if (corridor === undefined) {
      return;
    }

    const waypoint = corridor.waypoints.find((candidate) =>
      candidate.id.equals(waypointId),
    );

    if (waypoint === undefined) {
      return;
    }

    corridor.removeWaypoint(waypoint);
  }

  /**
   * Resolve a Journey-owned waypoint by its domain identifier.
   */
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

  /**
   * Attach or replace the Journey schedule.
   *
   * Schedule composition remains a Journey aggregate responsibility.
   */
  public attachSchedule(schedule: JourneyScheduleEntity): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' schedule while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

    this.journey.setSchedule(schedule);
  }

  public removeSchedule(): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' schedule while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

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

  /**
   * Attach or replace the Journey vehicle.
   */
  public attachVehicle(vehicle: JourneyVehicleEntity): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' vehicle while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

    this.journey.setVehicle(vehicle);
  }

  public removeVehicle(): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' vehicle while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

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

  /**
   * Attach or replace Journey capacity configuration.
   */
  public attachCapacity(capacity: JourneyCapacityEntity): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' capacity while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

    this.journey.setCapacity(capacity);
  }

  public removeCapacity(): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' capacity while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

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

  /**
   * Attach or replace Journey pricing configuration.
   */
  public attachPricing(pricing: JourneyPricingEntity): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' pricing while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

    this.journey.setPricing(pricing);
  }

  public removePricing(): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' pricing while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

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

  /**
   * Attach or replace Journey preferences.
   *
   * Preferences are optional, but when present they are still owned by the
   * Journey aggregate.
   */
  public attachPreferences(preferences: JourneyPreferencesEntity): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' preferences while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

    this.journey.setPreferences(preferences);
  }

  public removePreferences(): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' preferences while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

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

  /**
   * Attach a Journey-owned asset reference.
   *
   * The asset itself belongs to the Asset bounded context. Journey owns only
   * its attachment entity and the opaque external asset reference.
   */
  public attachAsset(asset: JourneyAssetEntity): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' assets while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // Prevent duplicate attachment of the same JourneyAsset entity.
    // -------------------------------------------------------------------------

    if (this.journey.assets.some((existing) => existing.id.equals(asset.id))) {
      return;
    }

    // -------------------------------------------------------------------------
    // Prevent the same external Asset from being attached more than once.
    //
    // JourneyAsset is the Journey-owned attachment record.
    // assetPublicId identifies the external Asset-domain resource.
    // -------------------------------------------------------------------------

    if (this.hasAssetReference(asset.assetPublicId)) {
      throw new Error(
        `Asset '${asset.assetPublicId.value}' is already attached to ` +
          `Journey '${this.publicId.value}'.`,
      );
    }

    // -------------------------------------------------------------------------
    // Attach the Journey-owned asset record.
    // -------------------------------------------------------------------------

    this.journey.addAsset(asset);
  }

  /**
   * Determine whether an external Asset reference is already attached.
   */
  public hasAssetReference(
    assetPublicId: JourneyAssetPublicIdReference,
  ): boolean {
    return this.getAssetByReference(assetPublicId) !== undefined;
  }

  /**
   * Remove a Journey asset using its external asset reference.
   *
   * The reference is resolved inside the aggregate boundary so the
   * application layer does not need to understand JourneyAssetEntity's
   * internal representation.
   */
  public removeAssetByReference(
    assetPublicId: JourneyAssetPublicIdReference,
  ): void {
    if (!this.canModifyComponents()) {
      throw new Error(
        `Cannot modify Journey '${this.publicId.value}' assets while ` +
          `the Journey is ${this.status.value}.`,
      );
    }

    const asset = this.getAssetByReference(assetPublicId);

    if (asset === undefined) {
      return;
    }

    this.journey.removeAsset(asset);
  }

  /**
   * Resolve a Journey-owned asset by its external Asset-domain reference.
   */
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
   * Determine whether all mandatory Journey components are present.
   *
   * Required:
   *
   * - Corridor
   * - Schedule
   * - Vehicle
   * - Capacity
   * - Pricing
   *
   * Optional:
   *
   * - Preferences
   * - Assets
   * - Waypoints
   *
   * Waypoints remain optional because the corridor itself is the mandatory
   * route component.
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

  /**
   * Record an already-created Journey domain event.
   *
   * This exists for aggregate-level orchestration cases where a domain event
   * has already been constructed by domain/application infrastructure.
   *
   * Normal lifecycle events should continue to be recorded by the aggregate
   * lifecycle methods themselves.
   */
  public recordDomainEvent(event: JourneyDomainEvent): void {
    this.addDomainEvent(event);
  }
}
