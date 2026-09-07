// -----------------------------------------------------------------------------
// Support Case Participant — Entity
// -----------------------------------------------------------------------------
//
// Represents a member participating in a Support Case.
//
// Aggregate:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// SupportCaseParticipantEntity is a child entity owned by the
// SupportCaseAggregate.
//
// The entity records:
// - the participant public identity;
// - the Identity member participating in the case;
// - the participant role;
// - when the participant joined;
// - when the participant left;
// - creation and update timestamps.
//
// The entity does NOT contain:
// - caseId;
// - Prisma relations;
// - repository access;
// - Identity domain objects.
//
// The aggregate owns the relationship between the Support Case and
// its participants.
//
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { SupportCaseParticipantPublicId } from '../value-objects/support-case-participant-public-id.vo';
import type { SupportCaseParticipantRole } from '../value-objects/support-case-participant-role.vo';

export interface SupportCaseParticipantProps {
  memberPublicId: string;
  role: SupportCaseParticipantRole;

  joinedAt: Date;
  leftAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export class SupportCaseParticipantEntity extends Entity<
  SupportCaseParticipantProps,
  SupportCaseParticipantPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: SupportCaseParticipantProps,
    id?: UniqueEntityId,
    publicId?: SupportCaseParticipantPublicId,
  ) {
    super(
      {
        ...props,
        joinedAt: new Date(props.joinedAt),

        ...(props.leftAt !== undefined
          ? {
              leftAt: new Date(props.leftAt),
            }
          : {}),

        createdAt: new Date(props.createdAt),
        updatedAt: new Date(props.updatedAt),
      },
      id,
      publicId,
    );

    this.validateInvariants();
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    memberPublicId: string;
    role: SupportCaseParticipantRole;
    joinedAt?: Date;
    leftAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }): SupportCaseParticipantEntity {
    const now = new Date();

    return new SupportCaseParticipantEntity({
      memberPublicId: SupportCaseParticipantEntity.validateMemberPublicId(
        props.memberPublicId,
      ),

      role: props.role,

      joinedAt: props.joinedAt ? new Date(props.joinedAt) : new Date(now),

      ...(props.leftAt !== undefined
        ? {
            leftAt: new Date(props.leftAt),
          }
        : {}),

      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(now),

      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(now),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: SupportCaseParticipantProps,
    id: UniqueEntityId,
    publicId: SupportCaseParticipantPublicId,
  ): SupportCaseParticipantEntity {
    return new SupportCaseParticipantEntity(
      {
        ...props,
        memberPublicId: SupportCaseParticipantEntity.validateMemberPublicId(
          props.memberPublicId,
        ),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public get participantPublicId(): SupportCaseParticipantPublicId {
    return this.publicId;
  }

  // ---------------------------------------------------------------------------
  // Accessors
  // ---------------------------------------------------------------------------

  public get memberPublicId(): string {
    return this.props.memberPublicId;
  }

  public get role(): SupportCaseParticipantRole {
    return this.props.role;
  }

  public get joinedAt(): Date {
    return new Date(this.props.joinedAt);
  }

  public get leftAt(): Date | undefined {
    return this.props.leftAt ? new Date(this.props.leftAt) : undefined;
  }

  public get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  public get isActive(): boolean {
    return this.props.leftAt === undefined;
  }

  public get hasLeft(): boolean {
    return this.props.leftAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Member
  // ---------------------------------------------------------------------------

  public changeMember(memberPublicId: string): void {
    this.props.memberPublicId =
      SupportCaseParticipantEntity.validateMemberPublicId(memberPublicId);

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Role
  // ---------------------------------------------------------------------------

  public changeRole(role: SupportCaseParticipantRole): void {
    this.props.role = role;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Leave
  // ---------------------------------------------------------------------------

  public leave(at: Date = new Date()): void {
    if (this.props.leftAt !== undefined) {
      throw new Error('Support case participant has already left the case.');
    }

    this.validateTimestamp(
      at,
      'Support case participant leave timestamp must be a valid date.',
    );

    if (at < this.props.joinedAt) {
      throw new Error(
        'Support case participant leave timestamp cannot precede join timestamp.',
      );
    }

    this.props.leftAt = new Date(at);

    this.touch(at);
  }

  // ---------------------------------------------------------------------------
  // Invariants
  // ---------------------------------------------------------------------------

  private validateInvariants(): void {
    this.validateMemberPublicId(this.props.memberPublicId);

    this.validateTimestamp(
      this.props.joinedAt,
      'Support case participant join timestamp must be a valid date.',
    );

    if (this.props.leftAt !== undefined) {
      this.validateTimestamp(
        this.props.leftAt,
        'Support case participant leave timestamp must be a valid date.',
      );

      if (this.props.leftAt < this.props.joinedAt) {
        throw new Error(
          'Support case participant leave timestamp cannot precede join timestamp.',
        );
      }
    }

    this.validateTimestamp(
      this.props.createdAt,
      'Support case participant creation timestamp must be a valid date.',
    );

    this.validateTimestamp(
      this.props.updatedAt,
      'Support case participant update timestamp must be a valid date.',
    );
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static validateMemberPublicId(memberPublicId: string): string {
    if (typeof memberPublicId !== 'string') {
      throw new Error(
        'Support case participant member public ID must be a string.',
      );
    }

    const normalized = memberPublicId.trim();

    if (!normalized) {
      throw new Error(
        'Support case participant member public ID cannot be empty.',
      );
    }

    return normalized;
  }

  private validateMemberPublicId(memberPublicId: string): void {
    SupportCaseParticipantEntity.validateMemberPublicId(memberPublicId);
  }

  private validateTimestamp(timestamp: Date, message: string): void {
    if (!(timestamp instanceof Date) || Number.isNaN(timestamp.getTime())) {
      throw new Error(message);
    }
  }
}
