// -----------------------------------------------------------------------------
// Journey Demand Participant Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyDemandParticipantId } from '../value-objects/journey-demand-participant-id.vo';

import type { JourneyDemandParticipantPublicId } from '../value-objects/journey-demand-participant-public-id.vo';

import type { MemberPublicId } from '../value-objects/member-public-id.vo';

import { JourneyDemandSeats } from '../value-objects/journey-demand-seats.vo';

import { JourneyDemandParticipantStatusValueObject } from '../value-objects/journey-demand-participant-status.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyDemandParticipantProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: JourneyDemandParticipantPublicId;

  // ---------------------------------------------------------------------------
  // Cross-domain Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the member participating in the Journey Demand.
   *
   * This is a cross-domain reference and is intentionally not represented
   * as a domain entity relation.
   */
  memberPublicId: MemberPublicId;

  // ---------------------------------------------------------------------------
  // Participation
  // ---------------------------------------------------------------------------

  seats: JourneyDemandSeats;

  status: JourneyDemandParticipantStatusValueObject;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  joinedAt: Date;

  withdrawnAt: Date | undefined;

  removedAt: Date | undefined;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class JourneyDemandParticipantEntity extends Entity<
  JourneyDemandParticipantProps,
  JourneyDemandParticipantPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(
    props: JourneyDemandParticipantProps,
    id?: UniqueEntityId,
    publicId?: JourneyDemandParticipantPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(props: {
    publicId: JourneyDemandParticipantPublicId;

    memberPublicId: MemberPublicId;

    seats?: JourneyDemandSeats;

    status?: JourneyDemandParticipantStatusValueObject;

    joinedAt?: Date;

    withdrawnAt?: Date;

    removedAt?: Date;

    createdAt?: Date;

    updatedAt?: Date;
  }): JourneyDemandParticipantEntity {
    const now = new Date();

    return new JourneyDemandParticipantEntity(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId: props.publicId,

        // ---------------------------------------------------------------------
        // Member
        // ---------------------------------------------------------------------

        memberPublicId: props.memberPublicId,

        // ---------------------------------------------------------------------
        // Participation
        // ---------------------------------------------------------------------

        seats: props.seats ?? new JourneyDemandSeats(),

        status:
          props.status ?? JourneyDemandParticipantStatusValueObject.active(),

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        joinedAt: JourneyDemandParticipantEntity.cloneDate(
          props.joinedAt ?? now,
        ),

        withdrawnAt:
          props.withdrawnAt !== undefined
            ? JourneyDemandParticipantEntity.cloneDate(props.withdrawnAt)
            : undefined,

        removedAt:
          props.removedAt !== undefined
            ? JourneyDemandParticipantEntity.cloneDate(props.removedAt)
            : undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: JourneyDemandParticipantEntity.cloneDate(
          props.createdAt ?? now,
        ),

        updatedAt: JourneyDemandParticipantEntity.cloneDate(
          props.updatedAt ?? now,
        ),
      },
      undefined,
      props.publicId,
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(
    props: JourneyDemandParticipantProps,
    id: JourneyDemandParticipantId,
    publicId: JourneyDemandParticipantPublicId,
  ): JourneyDemandParticipantEntity {
    return new JourneyDemandParticipantEntity(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Member
        // ---------------------------------------------------------------------

        memberPublicId: props.memberPublicId,

        // ---------------------------------------------------------------------
        // Participation
        // ---------------------------------------------------------------------

        seats: props.seats,

        status: props.status,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        joinedAt: JourneyDemandParticipantEntity.cloneDate(props.joinedAt),

        withdrawnAt:
          props.withdrawnAt !== undefined
            ? JourneyDemandParticipantEntity.cloneDate(props.withdrawnAt)
            : undefined,

        removedAt:
          props.removedAt !== undefined
            ? JourneyDemandParticipantEntity.cloneDate(props.removedAt)
            : undefined,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: JourneyDemandParticipantEntity.cloneDate(props.createdAt),

        updatedAt: JourneyDemandParticipantEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  override get publicId(): JourneyDemandParticipantPublicId {
    return this.props.publicId;
  }

  // ===========================================================================
  // Member
  // ===========================================================================

  public get memberPublicId(): MemberPublicId {
    return this.props.memberPublicId;
  }

  public belongsToMember(memberPublicId: MemberPublicId): boolean {
    return this.props.memberPublicId.equals(memberPublicId);
  }

  // ===========================================================================
  // Seats
  // ===========================================================================

  public get seats(): JourneyDemandSeats {
    return this.props.seats;
  }

  public seatCount(): number {
    return this.props.seats.value;
  }

  public setSeats(seats: JourneyDemandSeats): void {
    if (!this.isActive()) {
      throw new Error(
        'Only an active Journey Demand participant can change seats.',
      );
    }

    this.props.seats = seats;

    this.touch();
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  public get status(): JourneyDemandParticipantStatusValueObject {
    return this.props.status;
  }

  public setStatus(status: JourneyDemandParticipantStatusValueObject): void {
    this.props.status = status;

    this.touch();
  }

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  public activate(): void {
    if (this.isActive()) {
      return;
    }

    if (!this.props.status.isWithdrawn && !this.props.status.isRemoved) {
      return;
    }

    this.props.status = JourneyDemandParticipantStatusValueObject.active();

    this.props.withdrawnAt = undefined;
    this.props.removedAt = undefined;

    this.touch();
  }

  public withdraw(at: Date = new Date()): void {
    if (this.isWithdrawn()) {
      return;
    }

    if (this.isRemoved()) {
      throw new Error(
        'A removed Journey Demand participant cannot be withdrawn.',
      );
    }

    this.props.status = JourneyDemandParticipantStatusValueObject.withdrawn();

    this.props.withdrawnAt = JourneyDemandParticipantEntity.cloneDate(at);

    this.touch(at);
  }

  public remove(at: Date = new Date()): void {
    if (this.isRemoved()) {
      return;
    }

    this.props.status = JourneyDemandParticipantStatusValueObject.removed();

    this.props.removedAt = JourneyDemandParticipantEntity.cloneDate(at);

    this.touch(at);
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isActive(): boolean {
    return this.props.status.isActive;
  }

  public isWithdrawn(): boolean {
    return this.props.status.isWithdrawn;
  }

  public isRemoved(): boolean {
    return this.props.status.isRemoved;
  }

  public canParticipate(): boolean {
    return this.isActive();
  }

  public hasWithdrawn(): boolean {
    return this.props.withdrawnAt !== undefined;
  }

  public hasBeenRemoved(): boolean {
    return this.props.removedAt !== undefined;
  }

  // ===========================================================================
  // Lifecycle Timestamps
  // ===========================================================================

  public get joinedAt(): Date {
    return JourneyDemandParticipantEntity.cloneDate(this.props.joinedAt);
  }

  public get withdrawnAt(): Date | undefined {
    return this.props.withdrawnAt !== undefined
      ? JourneyDemandParticipantEntity.cloneDate(this.props.withdrawnAt)
      : undefined;
  }

  public get removedAt(): Date | undefined {
    return this.props.removedAt !== undefined
      ? JourneyDemandParticipantEntity.cloneDate(this.props.removedAt)
      : undefined;
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  public get createdAt(): Date {
    return JourneyDemandParticipantEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return JourneyDemandParticipantEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneyDemandParticipantEntity.cloneDate(updatedAt);
  }

  override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneyDemandParticipantEntity.cloneDate(at);
  }

  // ===========================================================================
  // Equality
  // ===========================================================================

  override equals(other?: JourneyDemandParticipantEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ===========================================================================
  // Internal Helpers
  // ===========================================================================

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyDemandParticipantProps };
