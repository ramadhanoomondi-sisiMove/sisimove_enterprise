// -----------------------------------------------------------------------------
// Journey Boarding Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyBoardingPublicId } from '../value-objects/journey-boarding-public-id.vo';

import { JourneyBoardingStatus } from '../value-objects/journey-boarding-status.vo';

import type { JourneyBoardingJourneyId } from '../value-objects/journey-boarding-journey-id.vo';

import type { JourneyBoardingProviderPublicId } from '../value-objects/journey-boarding-provider-public-id.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyBoardingProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey Boarding aggregate.
   */
  publicId: JourneyBoardingPublicId;

  // ---------------------------------------------------------------------------
  // Journey
  // ---------------------------------------------------------------------------

  /**
   * Journey to which this boarding process belongs.
   *
   * A Journey can have only one Journey Boarding aggregate.
   */
  journeyId: JourneyBoardingJourneyId;

  /**
   * Public identity of the journey provider.
   */
  providerPublicId: JourneyBoardingProviderPublicId;

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  /**
   * Current physical boarding lifecycle state.
   */
  status: JourneyBoardingStatus;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Time at which boarding was opened.
   */
  boardingStartedAt?: Date | undefined;

  /**
   * Time at which the physical journey actually started.
   */
  journeyStartedAt?: Date | undefined;

  /**
   * Time at which the boarding process was cancelled.
   */
  cancelledAt?: Date | undefined;

  // ---------------------------------------------------------------------------
  // Version
  // ---------------------------------------------------------------------------

  /**
   * Optimistic concurrency version.
   */
  version: number;

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
 * Represents the physical boarding process for a Journey.
 *
 * Journey Boarding is responsible for answering the physical question:
 *
 * "Who actually boarded the journey, and has the journey physically started?"
 *
 * It intentionally does not own Journey lifecycle state.
 *
 * The Journey domain remains responsible for the Journey itself, while this
 * entity records the physical transition from preparation, through boarding,
 * to actual journey commencement.
 */
export class JourneyBoardingEntity extends Entity<
  JourneyBoardingProps,
  JourneyBoardingPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: JourneyBoardingProps,
    id?: UniqueEntityId,
    publicId?: JourneyBoardingPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: JourneyBoardingPublicId;

    journeyId: JourneyBoardingJourneyId;

    providerPublicId: JourneyBoardingProviderPublicId;

    status?: JourneyBoardingStatus;

    boardingStartedAt?: Date | undefined;

    journeyStartedAt?: Date | undefined;

    cancelledAt?: Date | undefined;

    version?: number;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): JourneyBoardingEntity {
    const now = new Date();

    const version = props.version ?? 1;

    JourneyBoardingEntity.assertVersion(version);

    return new JourneyBoardingEntity({
      publicId: props.publicId ?? new JourneyBoardingPublicId(),

      journeyId: props.journeyId,

      providerPublicId: props.providerPublicId,

      status: props.status ?? JourneyBoardingStatus.notStarted(),

      ...(props.boardingStartedAt !== undefined
        ? {
            boardingStartedAt: JourneyBoardingEntity.cloneDate(
              props.boardingStartedAt,
            ),
          }
        : {}),

      ...(props.journeyStartedAt !== undefined
        ? {
            journeyStartedAt: JourneyBoardingEntity.cloneDate(
              props.journeyStartedAt,
            ),
          }
        : {}),

      ...(props.cancelledAt !== undefined
        ? {
            cancelledAt: JourneyBoardingEntity.cloneDate(props.cancelledAt),
          }
        : {}),

      version,

      createdAt: JourneyBoardingEntity.cloneDate(props.createdAt ?? now),

      updatedAt: JourneyBoardingEntity.cloneDate(props.updatedAt ?? now),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: JourneyBoardingProps,
    id: UniqueEntityId,
    publicId: JourneyBoardingPublicId,
  ): JourneyBoardingEntity {
    JourneyBoardingEntity.assertVersion(props.version);

    return new JourneyBoardingEntity(
      {
        ...props,

        // Persistence public ID is authoritative during rehydration.
        publicId,

        ...(props.boardingStartedAt !== undefined
          ? {
              boardingStartedAt: JourneyBoardingEntity.cloneDate(
                props.boardingStartedAt,
              ),
            }
          : {}),

        ...(props.journeyStartedAt !== undefined
          ? {
              journeyStartedAt: JourneyBoardingEntity.cloneDate(
                props.journeyStartedAt,
              ),
            }
          : {}),

        ...(props.cancelledAt !== undefined
          ? {
              cancelledAt: JourneyBoardingEntity.cloneDate(props.cancelledAt),
            }
          : {}),

        createdAt: JourneyBoardingEntity.cloneDate(props.createdAt),

        updatedAt: JourneyBoardingEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): JourneyBoardingPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Journey
  // ---------------------------------------------------------------------------

  public get journeyId(): JourneyBoardingJourneyId {
    return this.props.journeyId;
  }

  public setJourneyId(journeyId: JourneyBoardingJourneyId): void {
    this.props.journeyId = journeyId;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Provider
  // ---------------------------------------------------------------------------

  public get providerPublicId(): JourneyBoardingProviderPublicId {
    return this.props.providerPublicId;
  }

  public setProviderPublicId(
    providerPublicId: JourneyBoardingProviderPublicId,
  ): void {
    this.props.providerPublicId = providerPublicId;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  public get status(): JourneyBoardingStatus {
    return this.props.status;
  }

  public setStatus(status: JourneyBoardingStatus): void {
    this.props.status = status;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Status Predicates
  // ---------------------------------------------------------------------------

  public isNotStarted(): boolean {
    return this.props.status.isNotStarted();
  }

  public isBoarding(): boolean {
    return this.props.status.isBoarding();
  }

  public isStarted(): boolean {
    return this.props.status.isStarted();
  }

  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  public isActive(): boolean {
    return this.isBoarding() || this.isStarted();
  }

  public isTerminal(): boolean {
    return this.isCancelled() || this.isStarted();
  }

  // ---------------------------------------------------------------------------
  // Boarding Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Opens the physical boarding process.
   */
  public openBoarding(at: Date = new Date()): void {
    this.props.status = JourneyBoardingStatus.boarding();

    this.props.boardingStartedAt = JourneyBoardingEntity.cloneDate(at);

    this.props.journeyStartedAt = undefined;
    this.props.cancelledAt = undefined;

    this.touch(at);
  }

  /**
   * Marks the physical journey as started.
   *
   * The aggregate is responsible for enforcing the higher-level invariant
   * that the provider has boarded before this operation is allowed.
   */
  public startJourney(at: Date = new Date()): void {
    this.props.status = JourneyBoardingStatus.started();

    this.props.journeyStartedAt = JourneyBoardingEntity.cloneDate(at);

    this.touch(at);
  }

  /**
   * Cancels the physical boarding process.
   */
  public cancel(at: Date = new Date()): void {
    this.props.status = JourneyBoardingStatus.cancelled();

    this.props.cancelledAt = JourneyBoardingEntity.cloneDate(at);

    this.touch(at);
  }

  // ---------------------------------------------------------------------------
  // Boarding Timestamp
  // ---------------------------------------------------------------------------

  public get boardingStartedAt(): Date | undefined {
    return this.props.boardingStartedAt
      ? JourneyBoardingEntity.cloneDate(this.props.boardingStartedAt)
      : undefined;
  }

  public setBoardingStartedAt(at: Date): void {
    this.props.boardingStartedAt = JourneyBoardingEntity.cloneDate(at);

    this.touch(at);
  }

  public hasBoardingStarted(): boolean {
    return this.props.boardingStartedAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Journey Started Timestamp
  // ---------------------------------------------------------------------------

  public get journeyStartedAt(): Date | undefined {
    return this.props.journeyStartedAt
      ? JourneyBoardingEntity.cloneDate(this.props.journeyStartedAt)
      : undefined;
  }

  public setJourneyStartedAt(at: Date): void {
    this.props.journeyStartedAt = JourneyBoardingEntity.cloneDate(at);

    this.touch(at);
  }

  public hasJourneyStarted(): boolean {
    return this.props.journeyStartedAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Cancellation Timestamp
  // ---------------------------------------------------------------------------

  public get cancelledAt(): Date | undefined {
    return this.props.cancelledAt
      ? JourneyBoardingEntity.cloneDate(this.props.cancelledAt)
      : undefined;
  }

  public setCancelledAt(at: Date): void {
    this.props.cancelledAt = JourneyBoardingEntity.cloneDate(at);

    this.touch(at);
  }

  public hasBeenCancelled(): boolean {
    return this.props.cancelledAt !== undefined;
  }

  // ---------------------------------------------------------------------------
  // Version
  // ---------------------------------------------------------------------------

  public get version(): number {
    return this.props.version;
  }

  /**
   * Increments the optimistic concurrency version.
   */
  public incrementVersion(): void {
    this.props.version += 1;
    this.touch();
  }

  /**
   * Sets the optimistic concurrency version during persistence operations.
   */
  public setVersion(version: number): void {
    JourneyBoardingEntity.assertVersion(version);

    this.props.version = version;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return JourneyBoardingEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return JourneyBoardingEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneyBoardingEntity.cloneDate(updatedAt);
  }

  public override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneyBoardingEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: JourneyBoardingEntity): boolean {
    if (!other) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static assertVersion(version: number): void {
    if (!Number.isInteger(version)) {
      throw new Error('Journey Boarding version must be an integer.');
    }

    if (version < 1) {
      throw new Error(
        'Journey Boarding version must be greater than or equal to 1.',
      );
    }
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

export type { JourneyBoardingProps };
