// -----------------------------------------------------------------------------
// Messaging Conversation Participant — Entity
// -----------------------------------------------------------------------------
//
// Represents a participant within the Messaging Conversation aggregate.
//
// Aggregate:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// └── MessagingConversationParticipantEntity[]
//
// The participant is NOT an aggregate root.
//
// MessagingConversationAggregate owns the participant lifecycle and is
// responsible for coordinating participant membership within a conversation.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain participant identity;
// - maintain participant public identity;
// - maintain conversation internal identity;
// - maintain referenced member public identity;
// - maintain participant role;
// - maintain participant lifecycle status;
// - maintain membership timestamps;
// - maintain last-read timestamp;
// - manage participant lifecycle;
// - manage read state;
// - enforce participant-level invariants;
// - provide lifecycle-safe predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - create conversations;
// - close conversations;
// - validate Journey membership;
// - validate Booking membership;
// - load Identity aggregates;
// - access Prisma;
// - persist itself;
// - access repositories;
// - communicate with external systems;
// - perform authorization checks;
// - enforce conversation-level participant limits.
//
// Conversation-level orchestration belongs to
// MessagingConversationAggregate.
//
// Persistence belongs to infrastructure.
//
// Application workflow orchestration belongs to the application layer.
//
// -----------------------------------------------------------------------------
//
// Cross-domain reference:
//
// memberPublicId references Identity.publicId.
//
// Messaging does not own the referenced Identity entity and therefore stores
// the reference as an opaque MessagingMemberPublicId value object.
//
// -----------------------------------------------------------------------------
//
// Internal aggregate reference:
//
// conversationId references MessagingConversation.id.
//
// This is an internal Messaging-domain identity and is retained by the entity
// because Prisma requires the participant to be associated with its owning
// conversation.
//
// The participant does not own the conversation and cannot change this
// association after creation.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
//       ACTIVE
//       /   \
//      /     \
//     ▼       ▼
//   LEFT    REMOVED
//
// LEFT and REMOVED are terminal participant states.
//
// A participant cannot be reactivated after leaving or being removed.
//
// -----------------------------------------------------------------------------
//
// Read state:
//
// An active participant may advance lastReadAt.
//
// lastReadAt is monotonic and cannot move backwards.
//
// A participant's read state does not alter conversation or message state.
//
// -----------------------------------------------------------------------------
//
// Persistence mapping:
//
// MessagingConversationParticipant
// ├── id              → UniqueEntityId
// ├── publicId        → MessagingConversationParticipantPublicId
// ├── conversationId  → UniqueEntityId
// ├── memberPublicId  → MessagingMemberPublicId
// ├── role            → MessagingParticipantRole
// ├── status          → MessagingParticipantStatus
// ├── joinedAt        → Date
// ├── leftAt          → Date | undefined
// ├── removedAt       → Date | undefined
// ├── lastReadAt      → Date | undefined
// ├── createdAt       → Date
// └── updatedAt       → Date
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

import { MessagingParticipantInvalidStatusException } from '../exceptions/messaging-participant-invalid-status.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { MessagingConversationParticipantPublicId } from '../value-objects/messaging-conversation-participant-public-id.vo';

import { MessagingMemberPublicId } from '../value-objects/messaging-member-public-id.vo';

import { MessagingParticipantRole } from '../value-objects/messaging-participant-role.vo';

import { MessagingParticipantStatus } from '../value-objects/messaging-participant-status.vo';

// =============================================================================
// Props
// =============================================================================

export interface MessagingConversationParticipantProps {
  /**
   * Internal identity of the owning Messaging Conversation.
   *
   * This corresponds to MessagingConversationParticipant.conversationId
   * in Prisma.
   *
   * The participant cannot change its owning conversation.
   */
  conversationId: UniqueEntityId;

  /**
   * Public identity of the Identity-domain member participating in the
   * conversation.
   */
  memberPublicId: MessagingMemberPublicId;

  /**
   * Participant role within the conversation.
   */
  role: MessagingParticipantRole;

  /**
   * Participant lifecycle status.
   */
  status: MessagingParticipantStatus;

  /**
   * Timestamp when the participant joined the conversation.
   */
  joinedAt: Date;

  /**
   * Timestamp when the participant left the conversation.
   */
  leftAt: Date | undefined;

  /**
   * Timestamp when the participant was removed from the conversation.
   */
  removedAt: Date | undefined;

  /**
   * Timestamp through which the participant has read conversation messages.
   */
  lastReadAt: Date | undefined;

  /**
   * Participant creation timestamp.
   */
  createdAt: Date;

  /**
   * Participant last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class MessagingConversationParticipantEntity extends Entity<
  MessagingConversationParticipantProps,
  MessagingConversationParticipantPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: MessagingConversationParticipantProps,
    id?: UniqueEntityId,
    publicId?: MessagingConversationParticipantPublicId,
  ) {
    super(props, id, publicId);

    this.validateInvariants();
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Messaging Conversation Participant entity.
   *
   * Newly created participants begin in ACTIVE state.
   */
  public static create(
    conversationId: UniqueEntityId,
    memberPublicId: MessagingMemberPublicId,
    role: MessagingParticipantRole,
    joinedAt: Date = new Date(),
  ): MessagingConversationParticipantEntity {
    MessagingConversationParticipantEntity.ensureInternalId(conversationId);

    MessagingConversationParticipantEntity.ensureMemberPublicId(memberPublicId);

    MessagingConversationParticipantEntity.ensureRole(role);

    MessagingConversationParticipantEntity.ensureValidDate(
      joinedAt,
      'join date',
    );

    const timestamp =
      MessagingConversationParticipantEntity.cloneDate(joinedAt);

    return new MessagingConversationParticipantEntity(
      {
        conversationId,

        memberPublicId,

        role,

        status: MessagingParticipantStatus.active(),

        joinedAt: timestamp,

        leftAt: undefined,

        removedAt: undefined,

        lastReadAt: undefined,

        createdAt: MessagingConversationParticipantEntity.cloneDate(timestamp),

        updatedAt: MessagingConversationParticipantEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new MessagingConversationParticipantPublicId(),
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Messaging Conversation Participant entity.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    props: MessagingConversationParticipantProps,
    id: UniqueEntityId,
    publicId: MessagingConversationParticipantPublicId,
  ): MessagingConversationParticipantEntity {
    if (props === undefined || props === null) {
      throw new MessagingException(
        'Messaging conversation participant properties are required for rehydration.',
      );
    }

    MessagingConversationParticipantEntity.ensureInternalId(id);

    MessagingConversationParticipantEntity.ensurePublicId(publicId);

    MessagingConversationParticipantEntity.ensureInternalId(
      props.conversationId,
    );

    MessagingConversationParticipantEntity.ensureMemberPublicId(
      props.memberPublicId,
    );

    MessagingConversationParticipantEntity.ensureRole(props.role);

    MessagingConversationParticipantEntity.ensureStatus(props.status);

    MessagingConversationParticipantEntity.ensureValidDate(
      props.joinedAt,
      'join date',
    );

    MessagingConversationParticipantEntity.ensureOptionalDate(
      props.leftAt,
      'leave date',
    );

    MessagingConversationParticipantEntity.ensureOptionalDate(
      props.removedAt,
      'removal date',
    );

    MessagingConversationParticipantEntity.ensureOptionalDate(
      props.lastReadAt,
      'last-read date',
    );

    MessagingConversationParticipantEntity.ensureValidDate(
      props.createdAt,
      'creation date',
    );

    MessagingConversationParticipantEntity.ensureValidDate(
      props.updatedAt,
      'updated date',
    );

    return new MessagingConversationParticipantEntity(
      {
        conversationId: props.conversationId,

        memberPublicId: props.memberPublicId,

        role: props.role,

        status: props.status,

        joinedAt: MessagingConversationParticipantEntity.cloneDate(
          props.joinedAt,
        ),

        leftAt:
          props.leftAt === undefined
            ? undefined
            : MessagingConversationParticipantEntity.cloneDate(props.leftAt),

        removedAt:
          props.removedAt === undefined
            ? undefined
            : MessagingConversationParticipantEntity.cloneDate(props.removedAt),

        lastReadAt:
          props.lastReadAt === undefined
            ? undefined
            : MessagingConversationParticipantEntity.cloneDate(
                props.lastReadAt,
              ),

        createdAt: MessagingConversationParticipantEntity.cloneDate(
          props.createdAt,
        ),

        updatedAt: MessagingConversationParticipantEntity.cloneDate(
          props.updatedAt,
        ),
      },

      id,

      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the conversation participant.
   */
  public override get publicId(): MessagingConversationParticipantPublicId {
    return super.publicId;
  }

  /**
   * Internal identity of the conversation participant.
   */
  public override get id(): UniqueEntityId {
    return super.id;
  }

  // ===========================================================================
  // Conversation Identity
  // ===========================================================================

  /**
   * Internal identity of the owning Messaging Conversation.
   *
   * This value is immutable because a participant cannot move between
   * conversations.
   */
  public get conversationId(): UniqueEntityId {
    return this.props.conversationId;
  }

  /**
   * Determines whether this participant belongs to the supplied conversation.
   */
  public belongsToConversation(conversationId: UniqueEntityId): boolean {
    MessagingConversationParticipantEntity.ensureInternalId(conversationId);

    return this.props.conversationId.equals(conversationId);
  }

  // ===========================================================================
  // Member Identity
  // ===========================================================================

  /**
   * Public identity of the Identity-domain member.
   *
   * This is an opaque cross-domain reference.
   */
  public get memberPublicId(): MessagingMemberPublicId {
    return this.props.memberPublicId;
  }

  /**
   * Determines whether this participant belongs to the supplied member.
   */
  public belongsToMember(memberPublicId: MessagingMemberPublicId): boolean {
    MessagingConversationParticipantEntity.ensureMemberPublicId(memberPublicId);

    return this.props.memberPublicId.equals(memberPublicId);
  }

  // ===========================================================================
  // Participant Role
  // ===========================================================================

  /**
   * Current participant role.
   */
  public get role(): MessagingParticipantRole {
    return this.props.role;
  }

  /**
   * Determines whether the participant is a provider.
   */
  public isProvider(): boolean {
    return this.props.role.isProvider();
  }

  /**
   * Determines whether the participant is a passenger.
   */
  public isPassenger(): boolean {
    return this.props.role.isPassenger();
  }

  /**
   * Changes the participant role.
   *
   * Role changes are allowed only while the participant is ACTIVE.
   */
  public changeRole(role: MessagingParticipantRole): void {
    MessagingConversationParticipantEntity.ensureRole(role);

    this.ensureMutable();

    if (this.props.role.equals(role)) {
      return;
    }

    this.props.role = role;

    this.touch();

    this.validateInvariants();
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current participant lifecycle status.
   */
  public get status(): MessagingParticipantStatus {
    return this.props.status;
  }

  /**
   * Determines whether the participant is active.
   */
  public isActive(): boolean {
    return this.props.status.isActive();
  }

  /**
   * Determines whether the participant has left.
   */
  public hasLeft(): boolean {
    return this.props.status.hasLeft();
  }

  /**
   * Determines whether the participant has been removed.
   */
  public isRemoved(): boolean {
    return this.props.status.isRemoved();
  }

  /**
   * Determines whether the participant can currently interact with the
   * conversation.
   */
  public isUsable(): boolean {
    return this.isActive();
  }

  // ===========================================================================
  // Lifecycle — Leave
  // ===========================================================================

  /**
   * Marks the participant as having left the conversation.
   *
   * Lifecycle:
   *
   * ACTIVE → LEFT
   *
   * LEFT is terminal.
   */
  public leave(leftAt: Date = new Date()): void {
    this.ensureMutable();

    MessagingConversationParticipantEntity.ensureValidDate(
      leftAt,
      'leave date',
    );

    if (leftAt.getTime() < this.props.joinedAt.getTime()) {
      throw new MessagingParticipantInvalidStatusException(
        'Messaging participant leave date cannot be before join date.',
      );
    }

    this.props.status = MessagingParticipantStatus.left();

    this.props.leftAt =
      MessagingConversationParticipantEntity.cloneDate(leftAt);

    this.touch(leftAt);

    this.validateInvariants();
  }

  // ===========================================================================
  // Lifecycle — Remove
  // ===========================================================================

  /**
   * Removes the participant from the conversation.
   *
   * Lifecycle:
   *
   * ACTIVE → REMOVED
   *
   * REMOVED is terminal.
   */
  public remove(removedAt: Date = new Date()): void {
    this.ensureMutable();

    MessagingConversationParticipantEntity.ensureValidDate(
      removedAt,
      'removal date',
    );

    if (removedAt.getTime() < this.props.joinedAt.getTime()) {
      throw new MessagingParticipantInvalidStatusException(
        'Messaging participant removal date cannot be before join date.',
      );
    }

    this.props.status = MessagingParticipantStatus.removed();

    this.props.removedAt =
      MessagingConversationParticipantEntity.cloneDate(removedAt);

    this.touch(removedAt);

    this.validateInvariants();
  }

  // ===========================================================================
  // Lifecycle Predicates
  // ===========================================================================

  /**
   * Determines whether the participant may be modified.
   *
   * LEFT and REMOVED participants are terminal.
   */
  public canBeModified(): boolean {
    return this.isActive();
  }

  /**
   * Determines whether the participant may leave.
   */
  public canLeave(): boolean {
    return this.isActive();
  }

  /**
   * Determines whether the participant may be removed.
   */
  public canBeRemoved(): boolean {
    return this.isActive();
  }

  /**
   * Determines whether the participant may read messages.
   */
  public canReadMessages(): boolean {
    return this.isActive();
  }

  /**
   * Determines whether the participant may send messages.
   *
   * Message authorization itself remains outside the entity.
   * This predicate only describes lifecycle eligibility.
   */
  public canSendMessages(): boolean {
    return this.isActive();
  }

  // ===========================================================================
  // Membership
  // ===========================================================================

  /**
   * Participant join timestamp.
   *
   * Returns a defensive copy.
   */
  public get joinedAt(): Date {
    return MessagingConversationParticipantEntity.cloneDate(
      this.props.joinedAt,
    );
  }

  /**
   * Determines whether the participant joined before the supplied date.
   */
  public joinedBefore(at: Date): boolean {
    MessagingConversationParticipantEntity.ensureValidDate(
      at,
      'comparison date',
    );

    return this.props.joinedAt.getTime() < at.getTime();
  }

  // ===========================================================================
  // Leave Timestamp
  // ===========================================================================

  /**
   * Participant leave timestamp.
   *
   * Returns a defensive copy.
   */
  public get leftAt(): Date | undefined {
    return this.props.leftAt === undefined
      ? undefined
      : MessagingConversationParticipantEntity.cloneDate(this.props.leftAt);
  }

  // ===========================================================================
  // Removal Timestamp
  // ===========================================================================

  /**
   * Participant removal timestamp.
   *
   * Returns a defensive copy.
   */
  public get removedAt(): Date | undefined {
    return this.props.removedAt === undefined
      ? undefined
      : MessagingConversationParticipantEntity.cloneDate(this.props.removedAt);
  }

  // ===========================================================================
  // Read State
  // ===========================================================================

  /**
   * Last timestamp through which the participant has read messages.
   *
   * Returns a defensive copy.
   */
  public get lastReadAt(): Date | undefined {
    return this.props.lastReadAt === undefined
      ? undefined
      : MessagingConversationParticipantEntity.cloneDate(this.props.lastReadAt);
  }

  /**
   * Determines whether the participant has recorded a read position.
   */
  public hasReadPosition(): boolean {
    return this.props.lastReadAt !== undefined;
  }

  /**
   * Marks conversation messages as read up to the supplied timestamp.
   *
   * The read position is monotonic and cannot move backwards.
   */
  public markAsRead(readAt: Date = new Date()): void {
    if (!this.canReadMessages()) {
      throw new MessagingParticipantInvalidStatusException(
        'Only an active messaging participant can update read state.',
      );
    }

    MessagingConversationParticipantEntity.ensureValidDate(readAt, 'read date');

    if (readAt.getTime() < this.props.joinedAt.getTime()) {
      throw new MessagingParticipantInvalidStatusException(
        'Messaging participant read date cannot be before join date.',
      );
    }

    if (
      this.props.lastReadAt !== undefined &&
      readAt.getTime() < this.props.lastReadAt.getTime()
    ) {
      throw new MessagingParticipantInvalidStatusException(
        'Messaging participant last-read date cannot move backwards.',
      );
    }

    if (this.props.lastReadAt?.getTime() === readAt.getTime()) {
      return;
    }

    this.props.lastReadAt =
      MessagingConversationParticipantEntity.cloneDate(readAt);

    this.touch(readAt);

    this.validateInvariants();
  }

  /**
   * Determines whether the participant has read through the supplied
   * timestamp.
   */
  public hasReadThrough(at: Date): boolean {
    MessagingConversationParticipantEntity.ensureValidDate(
      at,
      'comparison date',
    );

    if (this.props.lastReadAt === undefined) {
      return false;
    }

    return this.props.lastReadAt.getTime() >= at.getTime();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Participant creation timestamp.
   *
   * Returns a defensive copy.
   */
  public get createdAt(): Date {
    return MessagingConversationParticipantEntity.cloneDate(
      this.props.createdAt,
    );
  }

  /**
   * Participant last-update timestamp.
   *
   * Returns a defensive copy.
   */
  public get updatedAt(): Date {
    return MessagingConversationParticipantEntity.cloneDate(
      this.props.updatedAt,
    );
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
    MessagingConversationParticipantEntity.ensureValidDate(
      updatedAt,
      'updated date',
    );

    const timestamp =
      MessagingConversationParticipantEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new MessagingException(
        'Messaging conversation participant updated date cannot be before creation date.',
      );
    }

    this.props.updatedAt = timestamp;

    this.validateInvariants();
  }

  // ===========================================================================
  // Invariants
  // ===========================================================================

  /**
   * Validates all participant-level invariants.
   */
  private validateInvariants(): void {
    MessagingConversationParticipantEntity.ensureInternalId(this.id);

    MessagingConversationParticipantEntity.ensurePublicId(this.publicId);

    MessagingConversationParticipantEntity.ensureInternalId(
      this.props.conversationId,
    );

    MessagingConversationParticipantEntity.ensureMemberPublicId(
      this.props.memberPublicId,
    );

    MessagingConversationParticipantEntity.ensureRole(this.props.role);

    MessagingConversationParticipantEntity.ensureStatus(this.props.status);

    MessagingConversationParticipantEntity.ensureValidDate(
      this.props.joinedAt,
      'join date',
    );

    MessagingConversationParticipantEntity.ensureOptionalDate(
      this.props.leftAt,
      'leave date',
    );

    MessagingConversationParticipantEntity.ensureOptionalDate(
      this.props.removedAt,
      'removal date',
    );

    MessagingConversationParticipantEntity.ensureOptionalDate(
      this.props.lastReadAt,
      'last-read date',
    );

    MessagingConversationParticipantEntity.ensureValidDate(
      this.props.createdAt,
      'creation date',
    );

    MessagingConversationParticipantEntity.ensureValidDate(
      this.props.updatedAt,
      'updated date',
    );

    // -------------------------------------------------------------------------
    // Temporal invariants
    // -------------------------------------------------------------------------

    if (this.props.createdAt.getTime() < this.props.joinedAt.getTime()) {
      throw new MessagingException(
        'Messaging conversation participant creation date cannot be before join date.',
      );
    }

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new MessagingException(
        'Messaging conversation participant updated date cannot be before creation date.',
      );
    }

    if (
      this.props.leftAt !== undefined &&
      this.props.leftAt.getTime() < this.props.joinedAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging conversation participant leave date cannot be before join date.',
      );
    }

    if (
      this.props.removedAt !== undefined &&
      this.props.removedAt.getTime() < this.props.joinedAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging conversation participant removal date cannot be before join date.',
      );
    }

    if (
      this.props.lastReadAt !== undefined &&
      this.props.lastReadAt.getTime() < this.props.joinedAt.getTime()
    ) {
      throw new MessagingException(
        'Messaging conversation participant last-read date cannot be before join date.',
      );
    }

    // -------------------------------------------------------------------------
    // ACTIVE
    // -------------------------------------------------------------------------

    if (this.props.status.isActive()) {
      if (this.props.leftAt !== undefined) {
        throw new MessagingException(
          'An active messaging participant cannot have a leave date.',
        );
      }

      if (this.props.removedAt !== undefined) {
        throw new MessagingException(
          'An active messaging participant cannot have a removal date.',
        );
      }

      return;
    }

    // -------------------------------------------------------------------------
    // LEFT
    // -------------------------------------------------------------------------

    if (this.props.status.hasLeft()) {
      if (this.props.leftAt === undefined) {
        throw new MessagingException(
          'A messaging participant with LEFT status must have a leave date.',
        );
      }

      if (this.props.removedAt !== undefined) {
        throw new MessagingException(
          'A messaging participant with LEFT status cannot have a removal date.',
        );
      }

      return;
    }

    // -------------------------------------------------------------------------
    // REMOVED
    // -------------------------------------------------------------------------

    if (this.props.status.isRemoved()) {
      if (this.props.removedAt === undefined) {
        throw new MessagingException(
          'A messaging participant with REMOVED status must have a removal date.',
        );
      }

      if (this.props.leftAt !== undefined) {
        throw new MessagingException(
          'A messaging participant with REMOVED status cannot have a leave date.',
        );
      }

      return;
    }

    throw new MessagingException(
      'Messaging conversation participant has an unsupported lifecycle status.',
    );
  }

  // ===========================================================================
  // Mutable State Guard
  // ===========================================================================

  /**
   * Ensures the participant is still mutable.
   *
   * LEFT and REMOVED are terminal states.
   */
  private ensureMutable(): void {
    if (this.hasLeft()) {
      throw new MessagingParticipantInvalidStatusException(
        'A participant who has left the conversation cannot be modified.',
      );
    }

    if (this.isRemoved()) {
      throw new MessagingParticipantInvalidStatusException(
        'A removed participant cannot be modified.',
      );
    }

    if (!this.isActive()) {
      throw new MessagingParticipantInvalidStatusException(
        'Only an active messaging participant can be modified.',
      );
    }
  }

  // ===========================================================================
  // Value Object Guards
  // ===========================================================================

  private static ensureInternalId(id: unknown): asserts id is UniqueEntityId {
    if (!(id instanceof UniqueEntityId)) {
      throw new MessagingException(
        'Messaging conversation participant internal identity must be a valid entity identity.',
      );
    }
  }

  private static ensurePublicId(
    publicId: unknown,
  ): asserts publicId is MessagingConversationParticipantPublicId {
    if (!(publicId instanceof MessagingConversationParticipantPublicId)) {
      throw new MessagingException(
        'Messaging conversation participant public identity must be a valid public identity.',
      );
    }
  }

  private static ensureMemberPublicId(
    memberPublicId: unknown,
  ): asserts memberPublicId is MessagingMemberPublicId {
    if (!(memberPublicId instanceof MessagingMemberPublicId)) {
      throw new MessagingException(
        'Messaging participant member public identity must be a valid value object.',
      );
    }
  }

  private static ensureRole(
    role: unknown,
  ): asserts role is MessagingParticipantRole {
    if (!(role instanceof MessagingParticipantRole)) {
      throw new MessagingException(
        'Messaging participant role must be a valid value object.',
      );
    }
  }

  private static ensureStatus(
    status: unknown,
  ): asserts status is MessagingParticipantStatus {
    if (!(status instanceof MessagingParticipantStatus)) {
      throw new MessagingException(
        'Messaging participant status must be a valid value object.',
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
        `Messaging conversation participant ${fieldName} must be a valid date.`,
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

    MessagingConversationParticipantEntity.ensureValidDate(value, fieldName);
  }

  // ===========================================================================
  // Date Clone
  // ===========================================================================

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    MessagingConversationParticipantEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
