// -----------------------------------------------------------------------------
// Messaging Conversation — Entity
// -----------------------------------------------------------------------------
//
// Represents the Messaging Conversation entity within the Messaging domain.
//
// Aggregate context:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// └── MessagingConversationParticipantEntity[]
//
// The Messaging Conversation entity is the authoritative owner of:
//
// - conversation identity;
// - conversation public identity;
// - conversation type;
// - conversation lifecycle status;
// - Journey public identity;
// - optional Booking public identity;
// - last-message timestamp;
// - closure timestamp;
// - creation timestamp;
// - update timestamp.
//
// Participants belong to the Messaging Conversation aggregate and are managed
// through the aggregate root.
//
// Cross-domain references remain opaque public identities:
//
// - Journey → journeyPublicId
// - Booking → bookingPublicId
//
// Messaging does not load or mutate Journey or Booking entities.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain Messaging Conversation identity;
// - maintain Messaging Conversation public identity;
// - maintain conversation type;
// - maintain conversation lifecycle status;
// - maintain Journey reference;
// - maintain optional Booking reference;
// - manage conversation lifecycle;
// - record message activity;
// - maintain audit timestamps;
// - enforce conversation-level invariants;
// - provide lifecycle-safe predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - create participants;
// - create messages;
// - persist itself;
// - access Prisma;
// - access repositories;
// - load Journey;
// - load Booking;
// - perform authorization checks;
// - validate Booking ownership;
// - validate Journey state;
// - send notifications;
// - perform moderation.
//
// Participant ownership belongs to MessagingConversationAggregate.
//
// Message ownership belongs to MessagingMessageAggregate.
//
// Persistence belongs to infrastructure.
//
// Application workflow orchestration belongs to the application layer.
//
// Cross-domain validation belongs to application/domain policies as
// appropriate.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
//       ACTIVE
//         │
//         ▼
//       CLOSED
//
// CLOSED is terminal.
//
// An active conversation may be closed.
//
// A closed conversation cannot be reopened or used for new messaging activity.
//
// -----------------------------------------------------------------------------
//
// Conversation type:
//
// JOURNEY
//   └── Associated with a Journey.
//       journeyPublicId is required.
//
// DIRECT
//   └── Direct conversation.
//
// Current Prisma schema requires journeyPublicId for every conversation,
// including DIRECT. The entity therefore requires journeyPublicId for every
// conversation.
//
// If the domain later permits DIRECT conversations without a Journey, the
// Prisma field must first become nullable and the corresponding domain
// invariant must be changed deliberately.
//
// -----------------------------------------------------------------------------
//
// Booking:
//
// bookingPublicId is optional because a conversation may exist in the context
// of a Journey before a specific Booking exists.
//
// A Booking reference may be assigned later.
//
// Removing an established Booking reference is intentionally not supported
// because the association represents contextual history.
//
// -----------------------------------------------------------------------------
//
// Message activity:
//
// lastMessageAt records the timestamp of the most recent message activity.
//
// The entity does not create or persist messages itself. It only records the
// conversation-level activity supplied by the application/domain workflow.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { MessagingException } from '../exceptions/messaging.exception';

import { MessagingConversationAlreadyClosedException } from '../exceptions/messaging-conversation-already-closed.exception';

import { MessagingConversationInvalidStatusException } from '../exceptions/messaging-conversation-invalid-status.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { MessagingConversationPublicId } from '../value-objects/messaging-conversation-public-id.vo';

import { MessagingConversationType } from '../value-objects/messaging-conversation-type.vo';

import { MessagingConversationStatus } from '../value-objects/messaging-conversation-status.vo';

import { MessagingJourneyPublicId } from '../value-objects/messaging-journey-public-id.vo';

import { MessagingBookingPublicId } from '../value-objects/messaging-booking-public-id.vo';

// =============================================================================
// Props
// =============================================================================

export interface MessagingConversationProps {
  /**
   * Type of the Messaging Conversation.
   */
  type: MessagingConversationType;

  /**
   * Messaging Conversation lifecycle status.
   */
  status: MessagingConversationStatus;

  /**
   * Public identity of the Journey associated with the conversation.
   *
   * The Journey belongs to the Journey domain.
   */
  journeyPublicId: MessagingJourneyPublicId;

  /**
   * Optional public identity of the Booking associated with the conversation.
   *
   * The Booking belongs to the Booking domain.
   */
  bookingPublicId: MessagingBookingPublicId | undefined;

  /**
   * Timestamp of the most recent message activity.
   */
  lastMessageAt: Date | undefined;

  /**
   * Timestamp at which the conversation was closed.
   */
  closedAt: Date | undefined;

  /**
   * Messaging Conversation creation timestamp.
   */
  createdAt: Date;

  /**
   * Messaging Conversation last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class MessagingConversationEntity extends Entity<
  MessagingConversationProps,
  MessagingConversationPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: MessagingConversationProps,
    id?: UniqueEntityId,
    publicId?: MessagingConversationPublicId,
  ) {
    super(props, id, publicId);

    this.validateInvariants();
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Messaging Conversation entity.
   *
   * Newly created conversations begin in ACTIVE state.
   */
  public static create(
    type: MessagingConversationType,
    journeyPublicId: MessagingJourneyPublicId,
    bookingPublicId: MessagingBookingPublicId | undefined = undefined,
    createdAt: Date = new Date(),
  ): MessagingConversationEntity {
    MessagingConversationEntity.ensureType(type);

    MessagingConversationEntity.ensureJourneyPublicId(journeyPublicId);

    MessagingConversationEntity.ensureBookingPublicId(bookingPublicId);

    MessagingConversationEntity.ensureValidDate(createdAt, 'creation date');

    const timestamp = MessagingConversationEntity.cloneDate(createdAt);

    return new MessagingConversationEntity(
      {
        type,

        status: MessagingConversationStatus.active(),

        journeyPublicId,

        bookingPublicId,

        lastMessageAt: undefined,

        closedAt: undefined,

        createdAt: timestamp,

        updatedAt: MessagingConversationEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new MessagingConversationPublicId(),
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Messaging Conversation entity.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    props: MessagingConversationProps,
    id: UniqueEntityId,
    publicId: MessagingConversationPublicId,
  ): MessagingConversationEntity {
    if (props === undefined || props === null) {
      throw new MessagingException(
        'Messaging conversation properties are required for rehydration.',
      );
    }

    MessagingConversationEntity.ensureInternalId(id);

    MessagingConversationEntity.ensurePublicId(publicId);

    MessagingConversationEntity.ensureType(props.type);

    MessagingConversationEntity.ensureStatus(props.status);

    MessagingConversationEntity.ensureJourneyPublicId(props.journeyPublicId);

    MessagingConversationEntity.ensureBookingPublicId(props.bookingPublicId);

    MessagingConversationEntity.ensureOptionalDate(
      props.lastMessageAt,
      'last message date',
    );

    MessagingConversationEntity.ensureOptionalDate(
      props.closedAt,
      'closed date',
    );

    MessagingConversationEntity.ensureValidDate(
      props.createdAt,
      'creation date',
    );

    MessagingConversationEntity.ensureValidDate(
      props.updatedAt,
      'updated date',
    );

    const entity = new MessagingConversationEntity(
      {
        type: props.type,

        status: props.status,

        journeyPublicId: props.journeyPublicId,

        bookingPublicId: props.bookingPublicId,

        lastMessageAt:
          props.lastMessageAt === undefined
            ? undefined
            : MessagingConversationEntity.cloneDate(props.lastMessageAt),

        closedAt:
          props.closedAt === undefined
            ? undefined
            : MessagingConversationEntity.cloneDate(props.closedAt),

        createdAt: MessagingConversationEntity.cloneDate(props.createdAt),

        updatedAt: MessagingConversationEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );

    return entity;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal identity of the Messaging Conversation.
   */
  public override get id(): UniqueEntityId {
    return super.id;
  }

  /**
   * Public identity of the Messaging Conversation.
   */
  public override get publicId(): MessagingConversationPublicId {
    return super.publicId;
  }

  // ===========================================================================
  // Conversation Type
  // ===========================================================================

  /**
   * Current Messaging Conversation type.
   */
  public get type(): MessagingConversationType {
    return this.props.type;
  }

  /**
   * Determines whether the conversation is associated with a Journey.
   */
  public isJourneyConversation(): boolean {
    return this.props.type.isJourney();
  }

  /**
   * Determines whether the conversation is a direct conversation.
   */
  public isDirectConversation(): boolean {
    return this.props.type.isDirect();
  }

  // ===========================================================================
  // Journey Reference
  // ===========================================================================

  /**
   * Public identity of the associated Journey.
   *
   * Messaging does not own the referenced Journey.
   */
  public get journeyPublicId(): MessagingJourneyPublicId {
    return this.props.journeyPublicId;
  }

  /**
   * Determines whether the conversation belongs to the supplied Journey.
   *
   * This only compares opaque public identities.
   *
   * It does not validate that the Journey exists or is active.
   */
  public belongsToJourney(journeyPublicId: MessagingJourneyPublicId): boolean {
    MessagingConversationEntity.ensureJourneyPublicId(journeyPublicId);

    return this.props.journeyPublicId.equals(journeyPublicId);
  }

  // ===========================================================================
  // Booking Reference
  // ===========================================================================

  /**
   * Public identity of the associated Booking, when available.
   */
  public get bookingPublicId(): MessagingBookingPublicId | undefined {
    return this.props.bookingPublicId;
  }

  /**
   * Determines whether the conversation has an associated Booking.
   */
  public hasBooking(): boolean {
    return this.props.bookingPublicId !== undefined;
  }

  /**
   * Determines whether the conversation belongs to the supplied Booking.
   *
   * This only compares opaque public identities.
   *
   * It does not validate that the Booking exists or belongs to the Journey.
   */
  public belongsToBooking(bookingPublicId: MessagingBookingPublicId): boolean {
    MessagingConversationEntity.ensureBookingPublicId(bookingPublicId);

    if (this.props.bookingPublicId === undefined) {
      return false;
    }

    return this.props.bookingPublicId.equals(bookingPublicId);
  }

  /**
   * Associates the conversation with a Booking.
   *
   * The Booking itself is not loaded or validated here.
   *
   * An existing Booking association is immutable.
   */
  public assignBooking(bookingPublicId: MessagingBookingPublicId): void {
    MessagingConversationEntity.ensureBookingPublicId(bookingPublicId);

    this.ensureMutable();

    if (
      this.props.bookingPublicId !== undefined &&
      this.props.bookingPublicId.equals(bookingPublicId)
    ) {
      return;
    }

    if (this.props.bookingPublicId !== undefined) {
      throw new MessagingException(
        'Messaging conversation cannot replace an established Booking reference.',
      );
    }

    this.props.bookingPublicId = bookingPublicId;

    this.touch();

    this.validateInvariants();
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current Messaging Conversation lifecycle status.
   */
  public get status(): MessagingConversationStatus {
    return this.props.status;
  }

  /**
   * Determines whether the conversation is active.
   */
  public isActive(): boolean {
    return this.props.status.isActive();
  }

  /**
   * Determines whether the conversation is closed.
   */
  public isClosed(): boolean {
    return this.props.status.isClosed();
  }

  /**
   * Determines whether the conversation can accept normal messaging activity.
   */
  public isUsable(): boolean {
    return this.isActive();
  }

  // ===========================================================================
  // Lifecycle — Close
  // ===========================================================================

  /**
   * Permanently closes the Messaging Conversation.
   *
   * Lifecycle:
   *
   * ACTIVE → CLOSED
   *
   * CLOSED is terminal.
   */
  public close(closedAt: Date = new Date()): void {
    MessagingConversationEntity.ensureValidDate(closedAt, 'closed date');

    if (this.isClosed()) {
      throw new MessagingConversationAlreadyClosedException(
        'Messaging conversation is already closed.',
      );
    }

    if (!this.isActive()) {
      throw new MessagingConversationInvalidStatusException(
        'Messaging conversation cannot be closed from its current status.',
      );
    }

    const timestamp = MessagingConversationEntity.cloneDate(closedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new MessagingException(
        'Messaging conversation closed date cannot be before creation date.',
      );
    }

    if (
      this.props.lastMessageAt !== undefined &&
      timestamp.getTime() < this.props.lastMessageAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging conversation closed date cannot be before the last message date.',
      );
    }

    this.props.status = MessagingConversationStatus.closed();

    this.props.closedAt = timestamp;

    this.touch(timestamp);

    this.validateInvariants();
  }

  // ===========================================================================
  // Lifecycle Predicates
  // ===========================================================================

  /**
   * Determines whether the conversation may still be modified.
   *
   * CLOSED conversations are terminal.
   */
  public canBeModified(): boolean {
    return this.isActive();
  }

  /**
   * Determines whether the conversation may receive new messages.
   */
  public canReceiveMessages(): boolean {
    return this.isActive();
  }

  /**
   * Determines whether the conversation may be closed.
   */
  public canBeClosed(): boolean {
    return this.isActive();
  }

  // ===========================================================================
  // Message Activity
  // ===========================================================================

  /**
   * Timestamp of the most recent message activity.
   *
   * Returns a defensive copy.
   */
  public get lastMessageAt(): Date | undefined {
    if (this.props.lastMessageAt === undefined) {
      return undefined;
    }

    return MessagingConversationEntity.cloneDate(this.props.lastMessageAt);
  }

  /**
   * Records message activity on the conversation.
   *
   * The Message aggregate remains responsible for the actual message.
   *
   * This entity only records the conversation-level activity timestamp.
   */
  public recordMessageActivity(sentAt: Date = new Date()): void {
    MessagingConversationEntity.ensureValidDate(sentAt, 'message date');

    this.ensureMessageActivityAllowed();

    const timestamp = MessagingConversationEntity.cloneDate(sentAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new MessagingException(
        'Messaging message date cannot be before conversation creation date.',
      );
    }

    if (
      this.props.lastMessageAt !== undefined &&
      timestamp.getTime() < this.props.lastMessageAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging message date cannot be before the current last message date.',
      );
    }

    this.props.lastMessageAt = timestamp;

    this.touch(timestamp);

    this.validateInvariants();
  }

  // ===========================================================================
  // Closure Audit
  // ===========================================================================

  /**
   * Timestamp at which the conversation was closed.
   *
   * Returns a defensive copy.
   */
  public get closedAt(): Date | undefined {
    if (this.props.closedAt === undefined) {
      return undefined;
    }

    return MessagingConversationEntity.cloneDate(this.props.closedAt);
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Messaging Conversation creation timestamp.
   *
   * Returns a defensive copy.
   */
  public get createdAt(): Date {
    return MessagingConversationEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Messaging Conversation last-update timestamp.
   *
   * Returns a defensive copy.
   */
  public get updatedAt(): Date {
    return MessagingConversationEntity.cloneDate(this.props.updatedAt);
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp.
   *
   * This is not a business lifecycle transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    MessagingConversationEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = MessagingConversationEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new MessagingException(
        'Messaging conversation updated date cannot be before creation date.',
      );
    }

    this.props.updatedAt = timestamp;

    this.validateInvariants();
  }

  // ===========================================================================
  // Invariants
  // ===========================================================================

  /**
   * Validates all Messaging Conversation entity-level invariants.
   */
  private validateInvariants(): void {
    MessagingConversationEntity.ensureInternalId(this.id);

    MessagingConversationEntity.ensurePublicId(this.publicId);

    MessagingConversationEntity.ensureType(this.props.type);

    MessagingConversationEntity.ensureStatus(this.props.status);

    MessagingConversationEntity.ensureJourneyPublicId(
      this.props.journeyPublicId,
    );

    MessagingConversationEntity.ensureBookingPublicId(
      this.props.bookingPublicId,
    );

    MessagingConversationEntity.ensureOptionalDate(
      this.props.lastMessageAt,
      'last message date',
    );

    MessagingConversationEntity.ensureOptionalDate(
      this.props.closedAt,
      'closed date',
    );

    MessagingConversationEntity.ensureValidDate(
      this.props.createdAt,
      'creation date',
    );

    MessagingConversationEntity.ensureValidDate(
      this.props.updatedAt,
      'updated date',
    );

    // -------------------------------------------------------------------------
    // Audit ordering
    // -------------------------------------------------------------------------

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new MessagingException(
        'Messaging conversation updated date cannot be before creation date.',
      );
    }

    // -------------------------------------------------------------------------
    // Message activity ordering
    // -------------------------------------------------------------------------

    if (
      this.props.lastMessageAt !== undefined &&
      this.props.lastMessageAt.getTime() < this.props.createdAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging conversation last message date cannot be before creation date.',
      );
    }

    // -------------------------------------------------------------------------
    // Closure ordering
    // -------------------------------------------------------------------------

    if (
      this.props.closedAt !== undefined &&
      this.props.closedAt.getTime() < this.props.createdAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging conversation closed date cannot be before creation date.',
      );
    }

    if (
      this.props.closedAt !== undefined &&
      this.props.lastMessageAt !== undefined &&
      this.props.closedAt.getTime() < this.props.lastMessageAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging conversation closed date cannot be before the last message date.',
      );
    }

    // -------------------------------------------------------------------------
    // Lifecycle consistency
    // -------------------------------------------------------------------------

    if (this.props.status.isClosed() && this.props.closedAt === undefined) {
      throw new MessagingException(
        'A closed messaging conversation must have a closed date.',
      );
    }

    if (this.props.status.isActive() && this.props.closedAt !== undefined) {
      throw new MessagingException(
        'An active messaging conversation cannot have a closed date.',
      );
    }

    // -------------------------------------------------------------------------
    // Current schema invariant
    // -------------------------------------------------------------------------
    //
    // journeyPublicId is required in Prisma for every conversation type,
    // including DIRECT.
    //
    // Therefore no DIRECT-specific relaxation is performed here.
    //
    MessagingConversationEntity.ensureJourneyPublicId(
      this.props.journeyPublicId,
    );
  }

  // ===========================================================================
  // Mutable State Guard
  // ===========================================================================

  /**
   * Ensures the Messaging Conversation can still be modified.
   *
   * CLOSED conversations are terminal.
   */
  private ensureMutable(): void {
    if (this.isClosed()) {
      throw new MessagingConversationAlreadyClosedException(
        'A closed messaging conversation cannot be modified.',
      );
    }

    if (!this.isActive()) {
      throw new MessagingConversationInvalidStatusException(
        'Messaging conversation is not active.',
      );
    }
  }

  // ===========================================================================
  // Message Activity Guard
  // ===========================================================================

  /**
   * Ensures the conversation may receive message activity.
   */
  private ensureMessageActivityAllowed(): void {
    if (this.isClosed()) {
      throw new MessagingConversationAlreadyClosedException(
        'A closed messaging conversation cannot receive new messages.',
      );
    }

    if (!this.isActive()) {
      throw new MessagingConversationInvalidStatusException(
        'Only an active messaging conversation can receive messages.',
      );
    }
  }

  // ===========================================================================
  // Identity Guards
  // ===========================================================================

  /**
   * Validates the internal entity identity.
   */
  private static ensureInternalId(id: unknown): asserts id is UniqueEntityId {
    if (!(id instanceof UniqueEntityId)) {
      throw new MessagingException(
        'Messaging conversation internal identity must be a valid entity identity.',
      );
    }
  }

  /**
   * Validates the public entity identity.
   */
  private static ensurePublicId(
    publicId: unknown,
  ): asserts publicId is MessagingConversationPublicId {
    if (!(publicId instanceof MessagingConversationPublicId)) {
      throw new MessagingException(
        'Messaging conversation public identity must be a valid public identity.',
      );
    }
  }

  // ===========================================================================
  // Value Object Guards
  // ===========================================================================

  /**
   * Validates the conversation type.
   */
  private static ensureType(
    type: unknown,
  ): asserts type is MessagingConversationType {
    if (!(type instanceof MessagingConversationType)) {
      throw new MessagingException(
        'Messaging conversation type must be a valid value object.',
      );
    }
  }

  /**
   * Validates the conversation status.
   */
  private static ensureStatus(
    status: unknown,
  ): asserts status is MessagingConversationStatus {
    if (!(status instanceof MessagingConversationStatus)) {
      throw new MessagingException(
        'Messaging conversation status must be a valid value object.',
      );
    }
  }

  /**
   * Validates the Journey public identity.
   */
  private static ensureJourneyPublicId(
    journeyPublicId: unknown,
  ): asserts journeyPublicId is MessagingJourneyPublicId {
    if (!(journeyPublicId instanceof MessagingJourneyPublicId)) {
      throw new MessagingException(
        'Messaging conversation Journey public ID must be a valid value object.',
      );
    }
  }

  /**
   * Validates the optional Booking public identity.
   */
  private static ensureBookingPublicId(
    bookingPublicId: unknown,
  ): asserts bookingPublicId is MessagingBookingPublicId | undefined {
    if (bookingPublicId === undefined) {
      return;
    }

    if (!(bookingPublicId instanceof MessagingBookingPublicId)) {
      throw new MessagingException(
        'Messaging conversation Booking public ID must be a valid value object.',
      );
    }
  }

  // ===========================================================================
  // Date Guards
  // ===========================================================================

  /**
   * Validates a required Date.
   */
  private static ensureValidDate(
    value: unknown,
    fieldName: string,
  ): asserts value is Date {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new MessagingException(
        `Messaging conversation ${fieldName} must be a valid date.`,
      );
    }
  }

  /**
   * Validates an optional Date.
   */
  private static ensureOptionalDate(
    value: unknown,
    fieldName: string,
  ): asserts value is Date | undefined {
    if (value === undefined) {
      return;
    }

    MessagingConversationEntity.ensureValidDate(value, fieldName);
  }

  // ===========================================================================
  // Date Clone
  // ===========================================================================

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    MessagingConversationEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
