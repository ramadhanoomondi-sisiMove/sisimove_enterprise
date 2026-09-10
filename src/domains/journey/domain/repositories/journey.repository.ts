// src/domains/journey/domain/repositories/journey.repository.ts

// -----------------------------------------------------------------------------
// Journey Aggregate
// -----------------------------------------------------------------------------

import type { JourneyAggregate } from '../aggregates/journey.aggregate';

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
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyId } from '../value-objects/journey-id.vo';
import type { JourneyPublicId } from '../value-objects/journey-public-id.vo';
import type { JourneyProviderPublicId } from '../value-objects/journey-provider-public-id.vo';

import type { JourneyStatusValueObject } from '../value-objects/journey-status.vo';

// -----------------------------------------------------------------------------
// Corridor
// -----------------------------------------------------------------------------

import type { JourneyCorridorId } from '../value-objects/journey-corridor-id.vo';
import type { JourneyCorridorPublicId } from '../value-objects/journey-corridor-public-id.vo';

// -----------------------------------------------------------------------------
// Waypoint
// -----------------------------------------------------------------------------

import type { JourneyWaypointId } from '../value-objects/journey-waypoint-id.vo';
import type { JourneyWaypointPublicId } from '../value-objects/journey-waypoint-public-id.vo';

// -----------------------------------------------------------------------------
// Schedule
// -----------------------------------------------------------------------------

import type { JourneyScheduleId } from '../value-objects/journey-schedule-id.vo';
import type { JourneySchedulePublicId } from '../value-objects/journey-schedule-public-id.vo';

// -----------------------------------------------------------------------------
// Vehicle
// -----------------------------------------------------------------------------

import type { JourneyVehicleId } from '../value-objects/journey-vehicle-id.vo';
import type { JourneyVehiclePublicId } from '../value-objects/journey-vehicle-public-id.vo';

// -----------------------------------------------------------------------------
// Capacity
// -----------------------------------------------------------------------------

import type { JourneyCapacityId } from '../value-objects/journey-capacity-id.vo';
import type { JourneyCapacityPublicId } from '../value-objects/journey-capacity-public-id.vo';

// -----------------------------------------------------------------------------
// Pricing
// -----------------------------------------------------------------------------

import type { JourneyPricingId } from '../value-objects/journey-pricing-id.vo';
import type { JourneyPricingPublicId } from '../value-objects/journey-pricing-public-id.vo';

// -----------------------------------------------------------------------------
// Preferences
// -----------------------------------------------------------------------------

import type { JourneyPreferencesId } from '../value-objects/journey-preferences-id.vo';
import type { JourneyPreferencesPublicId } from '../value-objects/journey-preferences-public-id.vo';

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------

import type { JourneyAssetId } from '../value-objects/journey-asset-id.vo';
import type { JourneyAssetPublicId } from '../value-objects/journey-asset-public-id.vo';
import type { JourneyAssetPublicIdReference } from '../value-objects/journey-asset-public-id-reference.vo';

/**
 * Repository abstraction for the Journey aggregate.
 *
 * The domain layer depends only on this contract.
 * Infrastructure is responsible for implementing persistence.
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
 * Important:
 *
 * - JourneyCorridor, JourneySchedule, JourneyCapacity, JourneyPricing,
 *   JourneyPreferences and JourneyAsset are Journey-domain components.
 * - JourneyWaypoint belongs to JourneyCorridor and is therefore always
 *   resolved within the Journey aggregate boundary.
 * - JourneyVehicle is a Journey-domain entity referenced by Journey.
 * - Provider and external Asset identities are cross-domain references.
 *
 * The repository owns the complete Journey aggregate.
 */
export interface JourneyRepository {
  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persist the complete Journey aggregate.
   */
  save(aggregate: JourneyAggregate): Promise<void>;

  /**
   * Find a Journey aggregate by internal domain identifier.
   */
  findById(id: JourneyId): Promise<JourneyAggregate | null>;

  /**
   * Find a Journey aggregate by public identifier.
   */
  findByPublicId(publicId: JourneyPublicId): Promise<JourneyAggregate | null>;

  /**
   * Find all Journey aggregates belonging to a provider.
   */
  findByProviderPublicId(
    providerPublicId: JourneyProviderPublicId,
  ): Promise<JourneyAggregate[]>;

  /**
   * Delete a Journey aggregate.
   *
   * Deletion semantics are determined by the application/domain lifecycle.
   */
  delete(id: JourneyId): Promise<void>;

  /**
   * Determine whether a Journey exists by internal identifier.
   */
  exists(id: JourneyId): Promise<boolean>;

  /**
   * Determine whether a Journey exists by public identifier.
   */
  existsByPublicId(publicId: JourneyPublicId): Promise<boolean>;

  /**
   * Determine whether a Journey exists for a provider.
   */
  existsByProviderPublicId(
    providerPublicId: JourneyProviderPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Journey Queries
  // ===========================================================================
  findPublishedJourneysByRouteAndDate(
    origin: string,
    destination: string,
    departureFrom: Date,
    departureTo: Date,
  ): Promise<JourneyEntity[]>;
  /**
   * Find only the Journey entity by internal identifier.
   */
  findJourneyById(id: JourneyId): Promise<JourneyEntity | null>;

  /**
   * Find only the Journey entity by public identifier.
   */
  findJourneyByPublicId(
    publicId: JourneyPublicId,
  ): Promise<JourneyEntity | null>;

  /**
   * Find Journeys belonging to a provider.
   */
  findJourneysByProviderPublicId(
    providerPublicId: JourneyProviderPublicId,
  ): Promise<JourneyEntity[]>;

  findJourneysByProvider(
    providerPublicId: JourneyProviderPublicId,
  ): Promise<JourneyEntity[]>;

  /**
   * Find Journeys by lifecycle status.
   */
  findJourneysByStatus(
    status: JourneyStatusValueObject,
  ): Promise<JourneyEntity[]>;

  /**
   * Find Journeys belonging to a provider with a specific status.
   */
  findJourneysByProviderAndStatus(
    providerPublicId: JourneyProviderPublicId,
    status: JourneyStatusValueObject,
  ): Promise<JourneyEntity[]>;

  // ===========================================================================
  // Corridor
  // ===========================================================================

  /**
   * Find the corridor belonging to a Journey.
   */
  findCorridor(journeyId: JourneyId): Promise<JourneyCorridorEntity | null>;

  /**
   * Find a Journey corridor by internal identifier.
   *
   * The lookup is scoped to the Journey.
   */
  findCorridorById(
    journeyId: JourneyId,
    corridorId: JourneyCorridorId,
  ): Promise<JourneyCorridorEntity | null>;

  /**
   * Find a Journey corridor by public identifier.
   *
   * The lookup is scoped to the Journey.
   */
  findCorridorByPublicId(
    journeyId: JourneyId,
    corridorPublicId: JourneyCorridorPublicId,
  ): Promise<JourneyCorridorEntity | null>;

  /**
   * Determine whether a Journey has a corridor.
   */
  existsCorridor(journeyId: JourneyId): Promise<boolean>;

  // ===========================================================================
  // Waypoints
  // ===========================================================================

  /**
   * Find a waypoint belonging to a Journey by internal identifier.
   *
   * Waypoints are owned by JourneyCorridor and therefore the lookup is
   * always scoped to the owning Journey.
   */
  findWaypointById(
    journeyId: JourneyId,
    waypointId: JourneyWaypointId,
  ): Promise<JourneyWaypointEntity | null>;

  /**
   * Find a waypoint belonging to a Journey by public identifier.
   *
   * Public identifiers are resolved inside the Journey aggregate boundary.
   */
  findWaypointByPublicId(
    journeyId: JourneyId,
    waypointPublicId: JourneyWaypointPublicId,
  ): Promise<JourneyWaypointEntity | null>;

  /**
   * Find all waypoints belonging to a Journey.
   */
  findWaypoints(journeyId: JourneyId): Promise<JourneyWaypointEntity[]>;

  /**
   * Determine whether a waypoint exists inside a Journey aggregate.
   */
  existsWaypoint(
    journeyId: JourneyId,
    waypointId: JourneyWaypointId,
  ): Promise<boolean>;

  /**
   * Determine whether a waypoint exists inside a Journey aggregate
   * by public identifier.
   */
  existsWaypointByPublicId(
    journeyId: JourneyId,
    waypointPublicId: JourneyWaypointPublicId,
  ): Promise<boolean>;

  /**
   * Determine whether a Journey contains any waypoints.
   */
  existsWaypoints(journeyId: JourneyId): Promise<boolean>;

  // ===========================================================================
  // Schedule
  // ===========================================================================

  /**
   * Find the schedule belonging to a Journey.
   */
  findSchedule(journeyId: JourneyId): Promise<JourneyScheduleEntity | null>;

  /**
   * Find a Journey schedule by its internal identifier.
   */
  findScheduleById(
    journeyId: JourneyId,
    scheduleId: JourneyScheduleId,
  ): Promise<JourneyScheduleEntity | null>;

  /**
   * Find a Journey schedule by its public identifier.
   *
   * The lookup is scoped to the owning Journey aggregate.
   */
  findScheduleByPublicId(
    journeyId: JourneyId,
    schedulePublicId: JourneySchedulePublicId,
  ): Promise<JourneyScheduleEntity | null>;

  /**
   * Determine whether a Journey has a schedule.
   */
  existsSchedule(journeyId: JourneyId): Promise<boolean>;

  // ===========================================================================
  // Vehicle
  // ===========================================================================

  /**
   * Find the vehicle configuration referenced by a Journey.
   */
  findVehicle(journeyId: JourneyId): Promise<JourneyVehicleEntity | null>;

  /**
   * Find a Journey vehicle by internal identifier.
   */
  findVehicleById(
    journeyId: JourneyId,
    vehicleId: JourneyVehicleId,
  ): Promise<JourneyVehicleEntity | null>;

  /**
   * Find a Journey vehicle by public identifier.
   */
  findVehicleByPublicId(
    journeyId: JourneyId,
    vehiclePublicId: JourneyVehiclePublicId,
  ): Promise<JourneyVehicleEntity | null>;

  /**
   * Determine whether a Journey has a vehicle configuration.
   */
  existsVehicle(journeyId: JourneyId): Promise<boolean>;

  // ===========================================================================
  // Capacity
  // ===========================================================================

  /**
   * Find the capacity configuration belonging to a Journey.
   */
  findCapacity(journeyId: JourneyId): Promise<JourneyCapacityEntity | null>;

  /**
   * Find a Journey capacity by internal identifier.
   */
  findCapacityById(
    journeyId: JourneyId,
    capacityId: JourneyCapacityId,
  ): Promise<JourneyCapacityEntity | null>;

  /**
   * Find a Journey capacity by public identifier.
   */
  findCapacityByPublicId(
    journeyId: JourneyId,
    capacityPublicId: JourneyCapacityPublicId,
  ): Promise<JourneyCapacityEntity | null>;

  /**
   * Determine whether a Journey has a capacity configuration.
   */
  existsCapacity(journeyId: JourneyId): Promise<boolean>;

  // ===========================================================================
  // Pricing
  // ===========================================================================

  /**
   * Find the pricing configuration belonging to a Journey.
   */
  findPricing(journeyId: JourneyId): Promise<JourneyPricingEntity | null>;

  /**
   * Find a Journey pricing configuration by internal identifier.
   */
  findPricingById(
    journeyId: JourneyId,
    pricingId: JourneyPricingId,
  ): Promise<JourneyPricingEntity | null>;

  /**
   * Find a Journey pricing configuration by public identifier.
   */
  findPricingByPublicId(
    journeyId: JourneyId,
    pricingPublicId: JourneyPricingPublicId,
  ): Promise<JourneyPricingEntity | null>;

  /**
   * Determine whether a Journey has pricing configured.
   */
  existsPricing(journeyId: JourneyId): Promise<boolean>;

  // ===========================================================================
  // Preferences
  // ===========================================================================

  /**
   * Find the preferences belonging to a Journey.
   */
  findPreferences(
    journeyId: JourneyId,
  ): Promise<JourneyPreferencesEntity | null>;

  /**
   * Find Journey preferences by internal identifier.
   */
  findPreferencesById(
    journeyId: JourneyId,
    preferencesId: JourneyPreferencesId,
  ): Promise<JourneyPreferencesEntity | null>;

  /**
   * Find Journey preferences by public identifier.
   */
  findPreferencesByPublicId(
    journeyId: JourneyId,
    preferencesPublicId: JourneyPreferencesPublicId,
  ): Promise<JourneyPreferencesEntity | null>;

  /**
   * Determine whether a Journey has preferences configured.
   */
  existsPreferences(journeyId: JourneyId): Promise<boolean>;

  // ===========================================================================
  // Assets
  // ===========================================================================

  /**
   * Find a Journey asset by its internal identifier.
   */
  findAssetById(
    journeyId: JourneyId,
    assetId: JourneyAssetId,
  ): Promise<JourneyAssetEntity | null>;

  /**
   * Find a Journey asset by its Journey-domain public identifier.
   */
  findAssetByPublicId(
    journeyId: JourneyId,
    assetPublicId: JourneyAssetPublicId,
  ): Promise<JourneyAssetEntity | null>;

  /**
   * Find a Journey asset by the public identifier of the external Asset
   * domain object it references.
   */
  findAssetByReference(
    journeyId: JourneyId,
    assetPublicId: JourneyAssetPublicIdReference,
  ): Promise<JourneyAssetEntity | null>;

  /**
   * Find all assets belonging to a Journey.
   */
  findAssets(journeyId: JourneyId): Promise<JourneyAssetEntity[]>;

  /**
   * Determine whether an asset exists inside a Journey aggregate.
   */
  existsAsset(journeyId: JourneyId, assetId: JourneyAssetId): Promise<boolean>;

  /**
   * Determine whether a Journey asset exists by its Journey-domain
   * public identifier.
   */
  existsAssetByPublicId(
    journeyId: JourneyId,
    assetPublicId: JourneyAssetPublicId,
  ): Promise<boolean>;

  /**
   * Determine whether a Journey contains an asset referencing the supplied
   * external Asset public identifier.
   */
  existsAssetByReference(
    journeyId: JourneyId,
    assetPublicId: JourneyAssetPublicIdReference,
  ): Promise<boolean>;

  /**
   * Determine whether a Journey contains any assets.
   */
  existsAssets(journeyId: JourneyId): Promise<boolean>;
}
