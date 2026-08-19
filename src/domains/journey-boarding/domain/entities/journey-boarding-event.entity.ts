// -----------------------------------------------------------------------------
// Journey Boarding Event Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyBoardingEventPublicId } from '../value-objects/journey-boarding-event-public-id.vo';

import type { JourneyBoardingEventType } from '../value-objects/journey-boarding-event-type.vo';

import type { JourneyBoardingPublicId } from '../value-objects/journey-boarding-public-id.vo';

import type { JourneyBoardingMemberPublicId } from '../value-objects/journey-boarding-member-public-id.vo';

import type { JourneyBoardingBookingPublicId } from '../value-objects/journey-boarding-booking-public-id.vo';

import type { JourneyBoardingActorPublicId } from '../value-objects/journey-boarding-actor-public-id.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyBoardingEventProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the boarding event.
   */
  publicId: JourneyBoardingEventPublicId;

  // ---------------------------------------------------------------------------
  // Boarding
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey Boarding aggregate to which this event
   * belongs.
   *
   * This intentionally uses the Journey Boarding public identity rather than
   * the Journey identity.
   */
  boardingId: JourneyBoardingPublicId;

  // ---------------------------------------------------------------------------
  // Event
  // ---------------------------------------------------------------------------

  /**
   * Domain event type recorded in the Journey Boarding history.
   */
  type: JourneyBoardingEventType;

  // ---------------------------------------------------------------------------
  // Participant Context
  // ---------------------------------------------------------------------------

  /**
   * Member associated with the event, when applicable.
   *
   * For example, a passenger boarding or the provider boarding.
   */
  memberPublicId?: JourneyBoardingMemberPublicId | undefined;

  /**
   * Journey Booking associated with the event, when applicable.
   */
  bookingPublicId?: JourneyBoardingBookingPublicId | undefined;

  /**
   * Member who performed or caused the boarding operation.
   *
   * This may be absent for system-generated events.
   */
  actorPublicId?: JourneyBoardingActorPublicId | undefined;

  // ---------------------------------------------------------------------------
  // Timing
  // ---------------------------------------------------------------------------

  /**
   * Business time at which the event occurred.
   */
  occurredAt: Date;

  // ---------------------------------------------------------------------------
  // Metadata
  // ---------------------------------------------------------------------------

  /**
   * Optional event-specific metadata.
   *
   * Metadata is treated as an opaque JSON-compatible structure at the domain
   * boundary and is defensively cloned when entering or leaving the entity.
   */
  metadata?: Record<string, unknown> | undefined;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Time at which the event entity was persisted/created.
   */
  createdAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

/**
 * Represents an immutable historical event in the Journey Boarding lifecycle.
 *
 * Journey Boarding Events provide an auditable record of physical boarding
 * activity and lifecycle transitions such as:
 *
 * - boarding opened
 * - provider boarded
 * - passenger boarded
 * - passenger no-show
 * - participant withdrawal
 * - participant removal
 * - journey physically started
 * - boarding cancelled
 *
 * The entity intentionally contains public identifiers rather than references
 * to other domain entities.
 *
 * Important:
 *
 * `boardingId` refers to the Journey Boarding aggregate, not the Journey.
 * Therefore it uses `JourneyBoardingPublicId`.
 */
export class JourneyBoardingEventEntity extends Entity<
  JourneyBoardingEventProps,
  JourneyBoardingEventPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: JourneyBoardingEventProps,
    id?: UniqueEntityId,
    publicId?: JourneyBoardingEventPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: JourneyBoardingEventPublicId;

    boardingId: JourneyBoardingPublicId;

    type: JourneyBoardingEventType;

    memberPublicId?: JourneyBoardingMemberPublicId | undefined;

    bookingPublicId?: JourneyBoardingBookingPublicId | undefined;

    actorPublicId?: JourneyBoardingActorPublicId | undefined;

    occurredAt?: Date | undefined;

    metadata?: Record<string, unknown> | undefined;

    createdAt?: Date | undefined;
  }): JourneyBoardingEventEntity {
    const now = new Date();

    const occurredAt = props.occurredAt ?? now;
    const createdAt = props.createdAt ?? now;

    return new JourneyBoardingEventEntity({
      publicId: props.publicId ?? new JourneyBoardingEventPublicId(),

      boardingId: props.boardingId,

      type: props.type,

      ...(props.memberPublicId !== undefined
        ? {
            memberPublicId: props.memberPublicId,
          }
        : {}),

      ...(props.bookingPublicId !== undefined
        ? {
            bookingPublicId: props.bookingPublicId,
          }
        : {}),

      ...(props.actorPublicId !== undefined
        ? {
            actorPublicId: props.actorPublicId,
          }
        : {}),

      occurredAt: JourneyBoardingEventEntity.cloneDate(occurredAt),

      ...(props.metadata !== undefined
        ? {
            metadata: JourneyBoardingEventEntity.cloneMetadata(props.metadata),
          }
        : {}),

      createdAt: JourneyBoardingEventEntity.cloneDate(createdAt),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneyBoardingEventProps,
    id: UniqueEntityId,
    publicId: JourneyBoardingEventPublicId,
  ): JourneyBoardingEventEntity {
    return new JourneyBoardingEventEntity(
      {
        ...props,

        // ---------------------------------------------------------------------
        // Persistence identity is authoritative during rehydration.
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Defensive copies.
        // ---------------------------------------------------------------------

        occurredAt: JourneyBoardingEventEntity.cloneDate(props.occurredAt),

        ...(props.metadata !== undefined
          ? {
              metadata: JourneyBoardingEventEntity.cloneMetadata(
                props.metadata,
              ),
            }
          : {}),

        createdAt: JourneyBoardingEventEntity.cloneDate(props.createdAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): JourneyBoardingEventPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Boarding
  // ---------------------------------------------------------------------------

  public get boardingId(): JourneyBoardingPublicId {
    return this.props.boardingId;
  }

  // ---------------------------------------------------------------------------
  // Event Type
  // ---------------------------------------------------------------------------

  public get type(): JourneyBoardingEventType {
    return this.props.type;
  }

  // ---------------------------------------------------------------------------
  // Participant Context
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // Member
  // ---------------------------------------------------------------------------

  public get memberPublicId(): JourneyBoardingMemberPublicId | undefined {
    return this.props.memberPublicId;
  }

  public hasMember(): boolean {
    return this.props.memberPublicId !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Booking
  // ---------------------------------------------------------------------------

  public get bookingPublicId(): JourneyBoardingBookingPublicId | undefined {
    return this.props.bookingPublicId;
  }

  public hasBooking(): boolean {
    return this.props.bookingPublicId !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Actor
  // ---------------------------------------------------------------------------

  public get actorPublicId(): JourneyBoardingActorPublicId | undefined {
    return this.props.actorPublicId;
  }

  public hasActor(): boolean {
    return this.props.actorPublicId !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Occurred At
  // ---------------------------------------------------------------------------

  public get occurredAt(): Date {
    return JourneyBoardingEventEntity.cloneDate(this.props.occurredAt);
  }

  // ---------------------------------------------------------------------------
  // Created At
  // ---------------------------------------------------------------------------

  /**
   * Time at which the event entity was persisted/created.
   *
   * A defensive copy is returned so callers cannot mutate the entity's
   * internal Date state.
   */
  public get createdAt(): Date {
    return JourneyBoardingEventEntity.cloneDate(this.props.createdAt);
  }
  // ---------------------------------------------------------------------------
  // Metadata
  // ---------------------------------------------------------------------------

  public get metadata(): Record<string, unknown> | undefined {
    if (this.props.metadata === undefined) {
      return undefined;
    }

    return JourneyBoardingEventEntity.cloneMetadata(this.props.metadata);
  }

  public hasMetadata(): boolean {
    return this.props.metadata !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Event Semantics
  // ---------------------------------------------------------------------------

  public isBoardingOpened(): boolean {
    return this.props.type.value === 'BOARDING_OPENED';
  }

  public isProviderBoarded(): boolean {
    return this.props.type.value === 'PROVIDER_BOARDED';
  }

  public isPassengerBoarded(): boolean {
    return this.props.type.value === 'PASSENGER_BOARDED';
  }

  public isPassengerNoShow(): boolean {
    return this.props.type.value === 'PASSENGER_NO_SHOW';
  }

  public isBoardingWithdrawn(): boolean {
    return this.props.type.value === 'BOARDING_WITHDRAWN';
  }

  public isParticipantRemoved(): boolean {
    return this.props.type.value === 'PARTICIPANT_REMOVED';
  }

  public isJourneyStarted(): boolean {
    return this.props.type.value === 'JOURNEY_STARTED';
  }

  public isBoardingCancelled(): boolean {
    return this.props.type.value === 'BOARDING_CANCELLED';
  }

  // ---------------------------------------------------------------------------
  // Event Categories
  // ---------------------------------------------------------------------------

  /**
   * Determines whether this event concerns a specific boarding participant.
   */
  public isParticipantEvent(): boolean {
    return (
      this.isProviderBoarded() ||
      this.isPassengerBoarded() ||
      this.isPassengerNoShow() ||
      this.isBoardingWithdrawn() ||
      this.isParticipantRemoved()
    );
  }

  /**
   * Determines whether this event represents a Journey Boarding lifecycle
   * transition.
   */
  public isLifecycleEvent(): boolean {
    return (
      this.isBoardingOpened() ||
      this.isJourneyStarted() ||
      this.isBoardingCancelled()
    );
  }

  // ---------------------------------------------------------------------------
  // Event Context Queries
  // ---------------------------------------------------------------------------

  /**
   * Determines whether this event is associated with a passenger booking.
   */
  public isBookingEvent(): boolean {
    return this.hasBooking();
  }

  /**
   * Determines whether this event was caused by an identified actor.
   */
  public isActorDriven(): boolean {
    return this.hasActor();
  }

  /**
   * Determines whether this event is system-generated.
   */
  public isSystemGenerated(): boolean {
    return !this.hasActor();
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: JourneyBoardingEventEntity): boolean {
    if (!other) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  /**
   * Creates a defensive copy of a Date.
   */
  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }

  /**
   * Creates a defensive copy of event metadata.
   *
   * `structuredClone` is intentionally avoided here so the entity remains
   * compatible with environments where the domain package is executed without
   * relying on a global structuredClone implementation.
   */
  private static cloneMetadata(
    metadata: Record<string, unknown>,
  ): Record<string, unknown> {
    return JSON.parse(JSON.stringify(metadata)) as Record<string, unknown>;
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBoardingEventProps };
