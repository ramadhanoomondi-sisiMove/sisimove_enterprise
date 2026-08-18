// -----------------------------------------------------------------------------
// Journey Booking Repository
// -----------------------------------------------------------------------------
//
// Domain repository contract for the Journey Booking aggregate.
//
// Responsibilities:
// - Aggregate persistence and rehydration
// - Aggregate-scoped lookup
// - Root booking queries
// - Snapshot, pricing, payment, and cancellation queries
//
// Persistence concerns such as Prisma includes, joins, transactions,
// pagination, indexing, and query optimization belong to infrastructure.
//
// Cross-domain references such as journeyPublicId, passengerPublicId,
// and transactionPublicId are identifiers only and are not persistence
// relations to other bounded contexts.
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { JourneyBookingAggregate } from '../aggregates/journey-booking.aggregate';

import type { JourneyBookingEntity } from '../entities/journey-booking.entity';
import type { JourneyBookingSnapshotEntity } from '../entities/journey-booking-snapshot.entity';
import type { JourneyBookingPricingEntity } from '../entities/journey-booking-pricing.entity';
import type { JourneyBookingPaymentEntity } from '../entities/journey-booking-payment.entity';
import type { JourneyBookingCancellationEntity } from '../entities/journey-booking-cancellation.entity';

import type { JourneyBookingPublicId } from '../value-objects/journey-booking-public-id.vo';
import type { JourneyPublicId } from '../value-objects/journey-public-id.vo';
import type { JourneyBookingPassengerPublicId } from '../value-objects/journey-booking-passenger-public-id.vo';

import type { JourneyBookingStatus } from '../value-objects/journey-booking-status.vo';

import type { JourneyBookingSnapshotPublicId } from '../value-objects/journey-booking-snapshot-public-id.vo';
import type { JourneyBookingPricingPublicId } from '../value-objects/journey-booking-pricing-public-id.vo';

import type { JourneyBookingPaymentPublicId } from '../value-objects/journey-booking-payment-public-id.vo';
import type { JourneyBookingPaymentStatus } from '../value-objects/journey-booking-payment-status.vo';
import type { JourneyBookingTransactionPublicId } from '../value-objects/journey-booking-transaction-public-id.vo';

import type { JourneyBookingCancellationPublicId } from '../value-objects/journey-booking-cancellation-public-id.vo';
import type { JourneyBookingCancellationReason } from '../value-objects/journey-booking-cancellation-reason.vo';

// =============================================================================
// Journey Booking Repository
// =============================================================================

export interface JourneyBookingRepository {
  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persists the complete Journey Booking aggregate.
   *
   * Infrastructure is responsible for persisting the aggregate root and
   * its owned components atomically.
   */
  save(aggregate: JourneyBookingAggregate): Promise<void>;

  /**
   * Finds and rehydrates a Journey Booking aggregate by its internal ID.
   */
  findById(id: UniqueEntityId): Promise<JourneyBookingAggregate | null>;

  /**
   * Finds and rehydrates a Journey Booking aggregate by its public ID.
   */
  findByPublicId(
    publicId: JourneyBookingPublicId,
  ): Promise<JourneyBookingAggregate | null>;

  /**
   * Deletes a Journey Booking aggregate by its internal ID.
   */
  delete(id: UniqueEntityId): Promise<void>;

  /**
   * Determines whether a Journey Booking exists by internal ID.
   */
  exists(id: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether a Journey Booking exists by public ID.
   */
  existsByPublicId(publicId: JourneyBookingPublicId): Promise<boolean>;

  // ===========================================================================
  // Root Journey Booking Queries
  // ===========================================================================

  /**
   * Finds the Journey Booking root entity by internal ID.
   *
   * This query does not imply aggregate rehydration.
   */
  findJourneyBookingById(
    id: UniqueEntityId,
  ): Promise<JourneyBookingEntity | null>;

  /**
   * Finds the Journey Booking root entity by public ID.
   */
  findJourneyBookingByPublicId(
    publicId: JourneyBookingPublicId,
  ): Promise<JourneyBookingEntity | null>;

  /**
   * Returns all Journey Booking root entities.
   */
  findJourneyBookings(): Promise<JourneyBookingEntity[]>;

  /**
   * Finds bookings associated with a Journey.
   */
  findJourneyBookingsByJourneyPublicId(
    journeyPublicId: JourneyPublicId,
  ): Promise<JourneyBookingEntity[]>;

  /**
   * Finds bookings belonging to a passenger.
   */
  findJourneyBookingsByPassengerPublicId(
    passengerPublicId: JourneyBookingPassengerPublicId,
  ): Promise<JourneyBookingEntity[]>;

  /**
   * Finds bookings by lifecycle status.
   */
  findJourneyBookingsByStatus(
    status: JourneyBookingStatus,
  ): Promise<JourneyBookingEntity[]>;

  /**
   * Finds bookings for a Journey with a specific lifecycle status.
   */
  findJourneyBookingsByJourneyAndStatus(
    journeyPublicId: JourneyPublicId,
    status: JourneyBookingStatus,
  ): Promise<JourneyBookingEntity[]>;

  /**
   * Finds bookings for a passenger with a specific lifecycle status.
   */
  findJourneyBookingsByPassengerAndStatus(
    passengerPublicId: JourneyBookingPassengerPublicId,
    status: JourneyBookingStatus,
  ): Promise<JourneyBookingEntity[]>;

  /**
   * Finds all bookings made by a passenger for a specific Journey.
   */
  findJourneyBookingsByJourneyAndPassenger(
    journeyPublicId: JourneyPublicId,
    passengerPublicId: JourneyBookingPassengerPublicId,
  ): Promise<JourneyBookingEntity[]>;

  /**
   * Determines whether a passenger has an active booking for a Journey.
   *
   * Active bookings are lifecycle states that have not been cancelled,
   * completed, or expired.
   */
  existsActiveBookingByJourneyAndPassenger(
    journeyPublicId: JourneyPublicId,
    passengerPublicId: JourneyBookingPassengerPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Snapshot Queries
  // ===========================================================================

  /**
   * Finds the snapshot owned by a Journey Booking.
   */
  findSnapshot(
    journeyBookingId: UniqueEntityId,
  ): Promise<JourneyBookingSnapshotEntity | null>;

  /**
   * Finds a snapshot by public ID within its owning Journey Booking.
   *
   * The aggregate ID scopes the lookup to the correct aggregate boundary.
   */
  findSnapshotByPublicId(
    journeyBookingId: UniqueEntityId,
    snapshotPublicId: JourneyBookingSnapshotPublicId,
  ): Promise<JourneyBookingSnapshotEntity | null>;

  /**
   * Determines whether a Journey Booking has a snapshot.
   */
  existsSnapshot(journeyBookingId: UniqueEntityId): Promise<boolean>;

  // ===========================================================================
  // Pricing Queries
  // ===========================================================================

  /**
   * Finds the pricing component owned by a Journey Booking.
   */
  findPricing(
    journeyBookingId: UniqueEntityId,
  ): Promise<JourneyBookingPricingEntity | null>;

  /**
   * Finds pricing by public ID within its owning Journey Booking.
   */
  findPricingByPublicId(
    journeyBookingId: UniqueEntityId,
    pricingPublicId: JourneyBookingPricingPublicId,
  ): Promise<JourneyBookingPricingEntity | null>;

  /**
   * Determines whether a Journey Booking has pricing.
   */
  existsPricing(journeyBookingId: UniqueEntityId): Promise<boolean>;

  // ===========================================================================
  // Payment Queries
  // ===========================================================================

  /**
   * Finds the payment component owned by a Journey Booking.
   */
  findPayment(
    journeyBookingId: UniqueEntityId,
  ): Promise<JourneyBookingPaymentEntity | null>;

  /**
   * Finds payment by public ID within its owning Journey Booking.
   */
  findPaymentByPublicId(
    journeyBookingId: UniqueEntityId,
    paymentPublicId: JourneyBookingPaymentPublicId,
  ): Promise<JourneyBookingPaymentEntity | null>;

  /**
   * Finds Journey Bookings whose payment is in the specified payment status.
   */
  findJourneyBookingsByPaymentStatus(
    status: JourneyBookingPaymentStatus,
  ): Promise<JourneyBookingEntity[]>;

  findByTransactionPublicId(
    transactionPublicId: JourneyBookingTransactionPublicId,
  ): Promise<JourneyBookingAggregate | null>;

  /**
   * Finds a payment by its Financial transaction public ID.
   */
  findPaymentByTransactionPublicId(
    transactionPublicId: JourneyBookingTransactionPublicId,
  ): Promise<JourneyBookingPaymentEntity | null>;

  /**
   * Determines whether a Journey Booking has payment information.
   */
  existsPayment(journeyBookingId: UniqueEntityId): Promise<boolean>;

  // ===========================================================================
  // Cancellation Queries
  // ===========================================================================

  /**
   * Finds the cancellation component owned by a Journey Booking.
   */
  findCancellation(
    journeyBookingId: UniqueEntityId,
  ): Promise<JourneyBookingCancellationEntity | null>;

  /**
   * Finds cancellation by public ID within its owning Journey Booking.
   */
  findCancellationByPublicId(
    journeyBookingId: UniqueEntityId,
    cancellationPublicId: JourneyBookingCancellationPublicId,
  ): Promise<JourneyBookingCancellationEntity | null>;

  /**
   * Finds Journey Bookings cancelled for the specified reason.
   */
  findJourneyBookingsByCancellationReason(
    reason: JourneyBookingCancellationReason,
  ): Promise<JourneyBookingEntity[]>;

  /**
   * Determines whether a Journey Booking has cancellation information.
   */
  existsCancellation(journeyBookingId: UniqueEntityId): Promise<boolean>;
}
