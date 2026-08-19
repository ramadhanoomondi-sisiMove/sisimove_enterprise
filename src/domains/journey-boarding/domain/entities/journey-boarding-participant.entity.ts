// -----------------------------------------------------------------------------
// Journey Boarding Participant Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyBoardingParticipantPublicId } from '../value-objects/journey-boarding-participant-public-id.vo';

import type { JourneyBoardingParticipantRole } from '../value-objects/journey-boarding-participant-role.vo';

import { JourneyBoardingParticipantStatus } from '../value-objects/journey-boarding-participant-status.vo';

import type { JourneyBoardingBookingPublicId } from '../value-objects/journey-boarding-booking-public-id.vo';

import type { JourneyBoardingMemberPublicId } from '../value-objects/journey-boarding-member-public-id.vo';

import type { JourneyBoardingPublicId } from '../value-objects/journey-boarding-public-id.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyBoardingParticipantProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: JourneyBoardingParticipantPublicId;

  // ---------------------------------------------------------------------------
  // Boarding
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey Boarding aggregate this participant
   * belongs to.
   */
  boardingId: JourneyBoardingPublicId;

  /**
   * Public identity of the member participating in boarding.
   */
  memberPublicId: JourneyBoardingMemberPublicId;

  /**
   * Journey Booking associated with this participant.
   *
   * The provider participant may not have a booking.
   */
  bookingPublicId?: JourneyBoardingBookingPublicId | undefined;

  /**
   * Role of the participant within the boarding process.
   */
  role: JourneyBoardingParticipantRole;

  /**
   * Current physical boarding state of the participant.
   */
  status: JourneyBoardingParticipantStatus;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Time at which the participant became expected for boarding.
   */
  expectedAt: Date;

  /**
   * Time at which the participant physically boarded.
   */
  boardedAt?: Date | undefined;

  /**
   * Time at which the participant withdrew from boarding.
   */
  withdrawnAt?: Date | undefined;

  /**
   * Time at which the participant was marked as a no-show.
   */
  noShowAt?: Date | undefined;

  /**
   * Time at which the participant was removed from boarding.
   */
  removedAt?: Date | undefined;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

/**
 * Represents a physical participant in a Journey Boarding process.
 *
 * A participant may be either:
 *
 * - the journey provider, or
 * - a passenger associated with a Journey Booking.
 *
 * The entity tracks the participant's physical boarding lifecycle independently
 * from the Journey Booking lifecycle.
 */
export class JourneyBoardingParticipantEntity extends Entity<
  JourneyBoardingParticipantProps,
  JourneyBoardingParticipantPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: JourneyBoardingParticipantProps,
    id?: UniqueEntityId,
    publicId?: JourneyBoardingParticipantPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: JourneyBoardingParticipantPublicId;

    boardingId: JourneyBoardingPublicId;

    memberPublicId: JourneyBoardingMemberPublicId;

    bookingPublicId?: JourneyBoardingBookingPublicId | undefined;

    role: JourneyBoardingParticipantRole;

    /**
     * Defaults to EXPECTED for newly created participants.
     */
    status?: JourneyBoardingParticipantStatus;

    expectedAt?: Date | undefined;

    boardedAt?: Date | undefined;

    withdrawnAt?: Date | undefined;

    noShowAt?: Date | undefined;

    removedAt?: Date | undefined;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): JourneyBoardingParticipantEntity {
    const now = new Date();

    return new JourneyBoardingParticipantEntity({
      publicId: props.publicId ?? new JourneyBoardingParticipantPublicId(),

      boardingId: props.boardingId,

      memberPublicId: props.memberPublicId,

      ...(props.bookingPublicId !== undefined
        ? {
            bookingPublicId: props.bookingPublicId,
          }
        : {}),

      role: props.role,

      // -----------------------------------------------------------------------
      // IMPORTANT:
      // The domain entity always contains a concrete status.
      // -----------------------------------------------------------------------

      status: props.status ?? JourneyBoardingParticipantStatus.expected(),

      expectedAt: JourneyBoardingParticipantEntity.cloneDate(
        props.expectedAt ?? now,
      ),

      ...(props.boardedAt !== undefined
        ? {
            boardedAt: JourneyBoardingParticipantEntity.cloneDate(
              props.boardedAt,
            ),
          }
        : {}),

      ...(props.withdrawnAt !== undefined
        ? {
            withdrawnAt: JourneyBoardingParticipantEntity.cloneDate(
              props.withdrawnAt,
            ),
          }
        : {}),

      ...(props.noShowAt !== undefined
        ? {
            noShowAt: JourneyBoardingParticipantEntity.cloneDate(
              props.noShowAt,
            ),
          }
        : {}),

      ...(props.removedAt !== undefined
        ? {
            removedAt: JourneyBoardingParticipantEntity.cloneDate(
              props.removedAt,
            ),
          }
        : {}),

      createdAt: JourneyBoardingParticipantEntity.cloneDate(
        props.createdAt ?? now,
      ),

      updatedAt: JourneyBoardingParticipantEntity.cloneDate(
        props.updatedAt ?? now,
      ),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneyBoardingParticipantProps,
    id: UniqueEntityId,
    publicId: JourneyBoardingParticipantPublicId,
  ): JourneyBoardingParticipantEntity {
    return new JourneyBoardingParticipantEntity(
      {
        ...props,

        // Persistence public ID is authoritative during rehydration.
        publicId,

        expectedAt: JourneyBoardingParticipantEntity.cloneDate(
          props.expectedAt,
        ),

        ...(props.boardedAt !== undefined
          ? {
              boardedAt: JourneyBoardingParticipantEntity.cloneDate(
                props.boardedAt,
              ),
            }
          : {}),

        ...(props.withdrawnAt !== undefined
          ? {
              withdrawnAt: JourneyBoardingParticipantEntity.cloneDate(
                props.withdrawnAt,
              ),
            }
          : {}),

        ...(props.noShowAt !== undefined
          ? {
              noShowAt: JourneyBoardingParticipantEntity.cloneDate(
                props.noShowAt,
              ),
            }
          : {}),

        ...(props.removedAt !== undefined
          ? {
              removedAt: JourneyBoardingParticipantEntity.cloneDate(
                props.removedAt,
              ),
            }
          : {}),

        createdAt: JourneyBoardingParticipantEntity.cloneDate(props.createdAt),

        updatedAt: JourneyBoardingParticipantEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): JourneyBoardingParticipantPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Boarding
  // ---------------------------------------------------------------------------

  public get boardingId(): JourneyBoardingPublicId {
    return this.props.boardingId;
  }

  public setBoardingId(boardingId: JourneyBoardingPublicId): void {
    this.props.boardingId = boardingId;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Member
  // ---------------------------------------------------------------------------

  public get memberPublicId(): JourneyBoardingMemberPublicId {
    return this.props.memberPublicId;
  }

  public setMemberPublicId(
    memberPublicId: JourneyBoardingMemberPublicId,
  ): void {
    this.props.memberPublicId = memberPublicId;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Booking
  // ---------------------------------------------------------------------------

  public get bookingPublicId(): JourneyBoardingBookingPublicId | undefined {
    return this.props.bookingPublicId;
  }

  public setBookingPublicId(
    bookingPublicId: JourneyBoardingBookingPublicId,
  ): void {
    this.props.bookingPublicId = bookingPublicId;
    this.touch();
  }

  public clearBookingPublicId(): void {
    if (this.props.bookingPublicId === undefined) {
      return;
    }

    delete this.props.bookingPublicId;

    this.touch();
  }

  public hasBooking(): boolean {
    return this.props.bookingPublicId !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Role
  // ---------------------------------------------------------------------------

  public get role(): JourneyBoardingParticipantRole {
    return this.props.role;
  }

  public isProvider(): boolean {
    return this.props.role.value === 'PROVIDER';
  }

  public isPassenger(): boolean {
    return this.props.role.value === 'PASSENGER';
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  public get status(): JourneyBoardingParticipantStatus {
    return this.props.status;
  }

  public setStatus(status: JourneyBoardingParticipantStatus): void {
    this.props.status = status;
    this.touch();
  }

  public isExpected(): boolean {
    return this.props.status.isExpected();
  }

  public isBoarded(): boolean {
    return this.props.status.isBoarded();
  }

  public isWithdrawn(): boolean {
    return this.props.status.isWithdrawn();
  }

  public isNoShow(): boolean {
    return this.props.status.isNoShow();
  }

  public isRemoved(): boolean {
    return this.props.status.isRemoved();
  }

  public isTerminal(): boolean {
    return this.isWithdrawn() || this.isNoShow() || this.isRemoved();
  }

  // ---------------------------------------------------------------------------
  // Boarding Lifecycle
  // ---------------------------------------------------------------------------

  public board(at: Date = new Date()): void {
    this.props.status = JourneyBoardingParticipantStatus.boarded();

    this.props.boardedAt = JourneyBoardingParticipantEntity.cloneDate(at);

    this.props.withdrawnAt = undefined;
    this.props.noShowAt = undefined;
    this.props.removedAt = undefined;

    this.touch(at);
  }

  public withdraw(at: Date = new Date()): void {
    this.props.status = JourneyBoardingParticipantStatus.withdrawn();

    this.props.withdrawnAt = JourneyBoardingParticipantEntity.cloneDate(at);

    this.props.boardedAt = undefined;
    this.props.noShowAt = undefined;
    this.props.removedAt = undefined;

    this.touch(at);
  }

  public markNoShow(at: Date = new Date()): void {
    this.props.status = JourneyBoardingParticipantStatus.noShow();

    this.props.noShowAt = JourneyBoardingParticipantEntity.cloneDate(at);

    this.props.boardedAt = undefined;
    this.props.withdrawnAt = undefined;
    this.props.removedAt = undefined;

    this.touch(at);
  }

  public remove(at: Date = new Date()): void {
    this.props.status = JourneyBoardingParticipantStatus.removed();

    this.props.removedAt = JourneyBoardingParticipantEntity.cloneDate(at);

    this.props.boardedAt = undefined;
    this.props.withdrawnAt = undefined;
    this.props.noShowAt = undefined;

    this.touch(at);
  }

  public resetToExpected(at: Date = new Date()): void {
    this.props.status = JourneyBoardingParticipantStatus.expected();

    this.props.boardedAt = undefined;
    this.props.withdrawnAt = undefined;
    this.props.noShowAt = undefined;
    this.props.removedAt = undefined;

    this.touch(at);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  public get expectedAt(): Date {
    return JourneyBoardingParticipantEntity.cloneDate(this.props.expectedAt);
  }

  public get boardedAt(): Date | undefined {
    return this.props.boardedAt
      ? JourneyBoardingParticipantEntity.cloneDate(this.props.boardedAt)
      : undefined;
  }

  public get withdrawnAt(): Date | undefined {
    return this.props.withdrawnAt
      ? JourneyBoardingParticipantEntity.cloneDate(this.props.withdrawnAt)
      : undefined;
  }

  public get noShowAt(): Date | undefined {
    return this.props.noShowAt
      ? JourneyBoardingParticipantEntity.cloneDate(this.props.noShowAt)
      : undefined;
  }

  public get removedAt(): Date | undefined {
    return this.props.removedAt
      ? JourneyBoardingParticipantEntity.cloneDate(this.props.removedAt)
      : undefined;
  }

  // ---------------------------------------------------------------------------
  // Timestamp Queries
  // ---------------------------------------------------------------------------

  public hasBoarded(): boolean {
    return this.props.boardedAt !== undefined;
  }

  public hasWithdrawn(): boolean {
    return this.props.withdrawnAt !== undefined;
  }

  public hasNoShow(): boolean {
    return this.props.noShowAt !== undefined;
  }

  public hasBeenRemoved(): boolean {
    return this.props.removedAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return JourneyBoardingParticipantEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return JourneyBoardingParticipantEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt =
      JourneyBoardingParticipantEntity.cloneDate(updatedAt);
  }

  public override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneyBoardingParticipantEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: JourneyBoardingParticipantEntity): boolean {
    if (!other) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyBoardingParticipantProps };
