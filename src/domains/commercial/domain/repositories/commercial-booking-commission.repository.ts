// -----------------------------------------------------------------------------
// Commercial Booking Commission Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Commercial Booking Commission aggregate.
//
// Aggregate boundary:
//
//   CommercialBookingCommissionAggregate
//              │
//              └── CommercialBookingCommissionEntity
//
// The repository is responsible for:
//
// - persisting the Booking Commission aggregate;
// - removing the aggregate where permitted;
// - rehydrating the aggregate;
// - locating all Booking Commission aggregates;
// - locating commissions by their public identity;
// - locating the commission associated with a Booking;
// - locating commissions associated with a Journey;
// - locating commissions produced from a Commercial Commission Rule;
// - supporting lifecycle/status queries;
// - supporting existence checks.
//
// The repository belongs to the Commercial domain layer.
//
// Infrastructure concerns are intentionally excluded:
//
// - no Prisma;
// - no SQL;
// - no ORM models;
// - no database client;
// - no persistence DTOs.
//
// Infrastructure implementations are responsible for mapping persistence
// records to and from the Commercial Booking Commission aggregate.
//
// Commercial Booking Commission does NOT own:
//
// - Booking;
// - Journey;
// - Commercial Commission Rule;
// - Identity;
// - Wallet;
// - Settlement;
// - Treasury;
// - Accounting.
//
// These are represented through public identifiers because they belong to
// other bounded contexts or independent Commercial aggregates.
//
// Historical commission values are snapshots on the Booking Commission entity.
// The repository therefore persists:
//
// - commissionRulePublicId;
// - bookingPublicId;
// - journeyPublicId;
// - percentage;
// - baseAmount;
// - commissionAmount;
// - currency;
//
// together with the lifecycle and audit state.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionAggregate } from '../aggregates/commercial-booking-commission.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionEntity } from '../entities/commercial-booking-commission.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { CommercialBookingCommissionBookingPublicId } from '../value-objects/commercial-booking-commission-booking-public-id.vo';

import type { CommercialBookingCommissionJourneyPublicId } from '../value-objects/commercial-booking-commission-journey-public-id.vo';

import type { CommercialBookingCommissionPublicId } from '../value-objects/commercial-booking-commission-public-id.vo';

import type { CommercialBookingCommissionStatus } from '../value-objects/commercial-booking-commission-status.vo';

import type { CommercialCommissionRulePublicId } from '../value-objects/commercial-commission-rule-public-id.vo';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

/**
 * Repository contract for the Commercial Booking Commission aggregate.
 *
 * A Booking Commission is an independent Commercial aggregate root.
 *
 * The repository provides both aggregate-oriented queries and narrowly scoped
 * entity queries where an application workflow requires the entity directly.
 */
export interface CommercialBookingCommissionRepository {
  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------

  /**
   * Persists a Commercial Booking Commission aggregate.
   *
   * The implementation must persist the complete aggregate state represented
   * by the owned CommercialBookingCommissionEntity.
   */
  save(aggregate: CommercialBookingCommissionAggregate): Promise<void>;

  /**
   * Removes a Commercial Booking Commission aggregate.
   *
   * Deletion policy is determined by the application and infrastructure layers.
   */
  delete(aggregate: CommercialBookingCommissionAggregate): Promise<void>;

  // ---------------------------------------------------------------------------
  // Aggregate Queries
  // ---------------------------------------------------------------------------

  /**
   * Finds all Commercial Booking Commission aggregates.
   *
   * Implementations should return results in a deterministic order.
   *
   * The recommended default ordering is createdAt descending so that the most
   * recently created commissions are returned first.
   */
  findAll(): Promise<CommercialBookingCommissionAggregate[]>;

  /**
   * Finds a Commercial Booking Commission aggregate by its public identifier.
   *
   * Returns null when no commission exists for the supplied public identifier.
   */
  findByPublicId(
    publicId: CommercialBookingCommissionPublicId,
  ): Promise<CommercialBookingCommissionAggregate | null>;

  /**
   * Finds the Commercial Booking Commission associated with a Booking.
   *
   * A Booking can have at most one Commercial Booking Commission.
   *
   * This corresponds to the persistence invariant represented by the unique
   * bookingPublicId constraint.
   */
  findByBookingPublicId(
    bookingPublicId: CommercialBookingCommissionBookingPublicId,
  ): Promise<CommercialBookingCommissionAggregate | null>;

  /**
   * Finds all Commercial Booking Commission aggregates associated with a
   * Journey.
   *
   * A Journey may contain multiple Bookings and therefore multiple Booking
   * Commission aggregates.
   */
  findByJourneyPublicId(
    journeyPublicId: CommercialBookingCommissionJourneyPublicId,
  ): Promise<CommercialBookingCommissionAggregate[]>;

  /**
   * Finds all Commercial Booking Commission aggregates created using a
   * specific Commercial Commission Rule.
   *
   * The commission rule is referenced by public identity only.
   */
  findByCommissionRulePublicId(
    commissionRulePublicId: CommercialCommissionRulePublicId,
  ): Promise<CommercialBookingCommissionAggregate[]>;

  /**
   * Finds all Commercial Booking Commission aggregates with the supplied
   * lifecycle status.
   *
   * This is useful for operational workflows such as identifying pending
   * commissions awaiting assessment.
   */
  findByStatus(
    status: CommercialBookingCommissionStatus,
  ): Promise<CommercialBookingCommissionAggregate[]>;

  /**
   * Finds all pending Commercial Booking Commission aggregates.
   *
   * Pending commissions are commissions whose assessment has not yet occurred.
   */
  findPending(): Promise<CommercialBookingCommissionAggregate[]>;

  /**
   * Finds all assessed Commercial Booking Commission aggregates.
   *
   * Assessed commissions may subsequently be cancelled according to the
   * aggregate lifecycle rules.
   */
  findAssessed(): Promise<CommercialBookingCommissionAggregate[]>;

  /**
   * Finds all cancelled Commercial Booking Commission aggregates.
   */
  findCancelled(): Promise<CommercialBookingCommissionAggregate[]>;

  // ---------------------------------------------------------------------------
  // Entity Queries
  // ---------------------------------------------------------------------------

  /**
   * Finds a Commercial Booking Commission entity by its public identifier.
   *
   * The aggregate-oriented query should be preferred when aggregate behavior
   * or lifecycle operations are required.
   */
  findEntityByPublicId(
    publicId: CommercialBookingCommissionPublicId,
  ): Promise<CommercialBookingCommissionEntity | null>;

  /**
   * Finds the Commercial Booking Commission entity associated with a Booking.
   *
   * The Booking public identifier is unique within the Commercial Booking
   * Commission persistence model.
   */
  findEntityByBookingPublicId(
    bookingPublicId: CommercialBookingCommissionBookingPublicId,
  ): Promise<CommercialBookingCommissionEntity | null>;

  /**
   * Finds all Commercial Booking Commission entities associated with a
   * Journey.
   */
  findEntitiesByJourneyPublicId(
    journeyPublicId: CommercialBookingCommissionJourneyPublicId,
  ): Promise<CommercialBookingCommissionEntity[]>;

  // ---------------------------------------------------------------------------
  // Existence
  // ---------------------------------------------------------------------------

  /**
   * Determines whether a Commercial Booking Commission exists for the supplied
   * public identifier.
   */
  existsByPublicId(
    publicId: CommercialBookingCommissionPublicId,
  ): Promise<boolean>;

  /**
   * Determines whether a Commercial Booking Commission already exists for the
   * supplied Booking.
   *
   * This supports the domain/persistence invariant that one Booking can have
   * only one Commercial Booking Commission.
   */
  existsByBookingPublicId(
    bookingPublicId: CommercialBookingCommissionBookingPublicId,
  ): Promise<boolean>;

  /**
   * Determines whether at least one Commercial Booking Commission exists for
   * the supplied Journey.
   */
  existsByJourneyPublicId(
    journeyPublicId: CommercialBookingCommissionJourneyPublicId,
  ): Promise<boolean>;
}
