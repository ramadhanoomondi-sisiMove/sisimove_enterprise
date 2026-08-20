// -----------------------------------------------------------------------------
// Journey Completion Confirmation Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyCompletionConfirmationPublicId } from '../value-objects/journey-completion-confirmation-public-id.vo';

import type { JourneyCompletionPublicId } from '../value-objects/journey-completion-public-id.vo';

import type { JourneyCompletionMemberPublicId } from '../value-objects/journey-completion-member-public-id.vo';

import type { JourneyCompletionBookingPublicId } from '../value-objects/journey-completion-booking-public-id.vo';

import type { JourneyCompletionConfirmationRole } from '../value-objects/journey-completion-confirmation-role.vo';

import { JourneyCompletionConfirmationStatus } from '../value-objects/journey-completion-confirmation-status.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyCompletionConfirmationProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of this Journey Completion Confirmation entity.
   */
  publicId: JourneyCompletionConfirmationPublicId;

  // ---------------------------------------------------------------------------
  // Completion
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey Completion aggregate this confirmation
   * belongs to.
   *
   * The Prisma persistence layer maps this public identity to the internal
   * JourneyCompletion.id foreign key.
   */
  completionId: JourneyCompletionPublicId;

  // ---------------------------------------------------------------------------
  // Member
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the member who confirmed journey completion.
   */
  memberPublicId: JourneyCompletionMemberPublicId;

  // ---------------------------------------------------------------------------
  // Booking
  // ---------------------------------------------------------------------------

  /**
   * Optional Journey Booking associated with this confirmation.
   *
   * The provider confirmation normally has no booking identity.
   */
  bookingPublicId?: JourneyCompletionBookingPublicId | undefined;

  // ---------------------------------------------------------------------------
  // Confirmation
  // ---------------------------------------------------------------------------

  /**
   * Role of the member within the completion confirmation process.
   */
  role: JourneyCompletionConfirmationRole;

  /**
   * Current confirmation lifecycle status.
   */
  status: JourneyCompletionConfirmationStatus;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Time at which the member confirmed completion.
   */
  confirmedAt: Date;

  /**
   * Time at which the confirmation was withdrawn.
   */
  withdrawnAt?: Date | undefined;

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
 * Represents a member's confirmation of Journey Completion.
 *
 * A confirmation is an independent child entity of the Journey Completion
 * aggregate.
 *
 * It records:
 *
 * - which completion it belongs to;
 * - which member confirmed;
 * - the member's role;
 * - the optional Journey Booking involved;
 * - whether the confirmation remains active or has been withdrawn.
 *
 * Confirmation lifecycle:
 *
 * CONFIRMED
 *   The member has confirmed that the journey was completed.
 *
 * WITHDRAWN
 *   The member previously confirmed completion but subsequently withdrew
 *   that confirmation.
 */
export class JourneyCompletionConfirmationEntity extends Entity<
  JourneyCompletionConfirmationProps,
  JourneyCompletionConfirmationPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: JourneyCompletionConfirmationProps,
    id?: UniqueEntityId,
    publicId?: JourneyCompletionConfirmationPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: JourneyCompletionConfirmationPublicId;

    completionId: JourneyCompletionPublicId;

    memberPublicId: JourneyCompletionMemberPublicId;

    bookingPublicId?: JourneyCompletionBookingPublicId | undefined;

    role: JourneyCompletionConfirmationRole;

    /**
     * Defaults to CONFIRMED for newly created confirmations.
     */
    status?: JourneyCompletionConfirmationStatus;

    confirmedAt?: Date | undefined;

    withdrawnAt?: Date | undefined;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): JourneyCompletionConfirmationEntity {
    const now = new Date();

    return new JourneyCompletionConfirmationEntity({
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: props.publicId ?? new JourneyCompletionConfirmationPublicId(),

      // -----------------------------------------------------------------------
      // Completion
      // -----------------------------------------------------------------------

      completionId: props.completionId,

      // -----------------------------------------------------------------------
      // Member
      // -----------------------------------------------------------------------

      memberPublicId: props.memberPublicId,

      // -----------------------------------------------------------------------
      // Booking
      // -----------------------------------------------------------------------

      ...(props.bookingPublicId !== undefined
        ? {
            bookingPublicId: props.bookingPublicId,
          }
        : {}),

      // -----------------------------------------------------------------------
      // Confirmation
      // -----------------------------------------------------------------------

      role: props.role,

      // -----------------------------------------------------------------------
      // IMPORTANT:
      // The domain entity always contains a concrete status.
      // -----------------------------------------------------------------------

      status: props.status ?? JourneyCompletionConfirmationStatus.confirmed(),

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      confirmedAt: JourneyCompletionConfirmationEntity.cloneDate(
        props.confirmedAt ?? now,
      ),

      ...(props.withdrawnAt !== undefined
        ? {
            withdrawnAt: JourneyCompletionConfirmationEntity.cloneDate(
              props.withdrawnAt,
            ),
          }
        : {}),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: JourneyCompletionConfirmationEntity.cloneDate(
        props.createdAt ?? now,
      ),

      updatedAt: JourneyCompletionConfirmationEntity.cloneDate(
        props.updatedAt ?? now,
      ),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneyCompletionConfirmationProps,
    id: UniqueEntityId,
    publicId: JourneyCompletionConfirmationPublicId,
  ): JourneyCompletionConfirmationEntity {
    return new JourneyCompletionConfirmationEntity(
      {
        ...props,

        // ---------------------------------------------------------------------
        // Persistence public ID is authoritative during rehydration.
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Lifecycle timestamps
        // ---------------------------------------------------------------------

        confirmedAt: JourneyCompletionConfirmationEntity.cloneDate(
          props.confirmedAt,
        ),

        ...(props.withdrawnAt !== undefined
          ? {
              withdrawnAt: JourneyCompletionConfirmationEntity.cloneDate(
                props.withdrawnAt,
              ),
            }
          : {}),

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: JourneyCompletionConfirmationEntity.cloneDate(
          props.createdAt,
        ),

        updatedAt: JourneyCompletionConfirmationEntity.cloneDate(
          props.updatedAt,
        ),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): JourneyCompletionConfirmationPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Completion
  // ---------------------------------------------------------------------------

  public get completionId(): JourneyCompletionPublicId {
    return this.props.completionId;
  }

  public setCompletionId(completionId: JourneyCompletionPublicId): void {
    this.props.completionId = completionId;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Member
  // ---------------------------------------------------------------------------

  public get memberPublicId(): JourneyCompletionMemberPublicId {
    return this.props.memberPublicId;
  }

  public setMemberPublicId(
    memberPublicId: JourneyCompletionMemberPublicId,
  ): void {
    this.props.memberPublicId = memberPublicId;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Booking
  // ---------------------------------------------------------------------------

  public get bookingPublicId(): JourneyCompletionBookingPublicId | undefined {
    return this.props.bookingPublicId;
  }

  public setBookingPublicId(
    bookingPublicId: JourneyCompletionBookingPublicId,
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

  public get role(): JourneyCompletionConfirmationRole {
    return this.props.role;
  }

  public isProvider(): boolean {
    return this.props.role.isProvider();
  }

  public isPassenger(): boolean {
    return this.props.role.isPassenger();
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  public get status(): JourneyCompletionConfirmationStatus {
    return this.props.status;
  }

  public setStatus(status: JourneyCompletionConfirmationStatus): void {
    this.props.status = status;

    this.touch();
  }

  public isConfirmed(): boolean {
    return this.props.status.isConfirmed();
  }

  public isWithdrawn(): boolean {
    return this.props.status.isWithdrawn();
  }

  public isTerminal(): boolean {
    return this.isWithdrawn();
  }

  public canWithdraw(): boolean {
    return this.isConfirmed();
  }

  // ---------------------------------------------------------------------------
  // Confirmation Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Confirms completion.
   *
   * This operation also clears a previous withdrawal timestamp, allowing a
   * controlled domain re-confirmation when the aggregate permits it.
   */
  public confirm(at: Date = new Date()): void {
    this.props.status = JourneyCompletionConfirmationStatus.confirmed();

    this.props.confirmedAt = JourneyCompletionConfirmationEntity.cloneDate(at);

    this.props.withdrawnAt = undefined;

    this.touch(at);
  }

  /**
   * Withdraws an existing completion confirmation.
   */
  public withdraw(at: Date = new Date()): void {
    this.props.status = JourneyCompletionConfirmationStatus.withdrawn();

    this.props.withdrawnAt = JourneyCompletionConfirmationEntity.cloneDate(at);

    this.touch(at);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  public get confirmedAt(): Date {
    return JourneyCompletionConfirmationEntity.cloneDate(
      this.props.confirmedAt,
    );
  }

  public get withdrawnAt(): Date | undefined {
    return this.props.withdrawnAt
      ? JourneyCompletionConfirmationEntity.cloneDate(this.props.withdrawnAt)
      : undefined;
  }

  // ---------------------------------------------------------------------------
  // Timestamp Queries
  // ---------------------------------------------------------------------------

  public hasConfirmed(): boolean {
    return this.props.confirmedAt !== undefined;
  }

  public hasWithdrawn(): boolean {
    return this.props.withdrawnAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return JourneyCompletionConfirmationEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return JourneyCompletionConfirmationEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt =
      JourneyCompletionConfirmationEntity.cloneDate(updatedAt);
  }

  public override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneyCompletionConfirmationEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: JourneyCompletionConfirmationEntity): boolean {
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

export type { JourneyCompletionConfirmationProps };
