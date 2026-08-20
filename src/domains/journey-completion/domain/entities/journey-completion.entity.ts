// -----------------------------------------------------------------------------
// Journey Completion Entity
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyCompletionPublicId } from '../value-objects/journey-completion-public-id.vo';

import { JourneyCompletionStatus } from '../value-objects/journey-completion-status.vo';

import type { JourneyCompletionJourneyPublicId } from '../value-objects/journey-completion-journey-public-id.vo';

import type { JourneyCompletionProviderPublicId } from '../value-objects/journey-completion-provider-public-id.vo';

// -----------------------------------------------------------------------------
// Child Entities
// -----------------------------------------------------------------------------

import type { JourneyCompletionConfirmationEntity } from './journey-completion-confirmation.entity';

import type { JourneyCompletionDisputeEntity } from './journey-completion-dispute.entity';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface JourneyCompletionProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey Completion aggregate.
   */
  publicId: JourneyCompletionPublicId;

  // ---------------------------------------------------------------------------
  // Cross-domain References
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Journey this completion belongs to.
   *
   * This is intentionally represented as a value object rather than a domain
   * entity relation.
   */
  journeyPublicId: JourneyCompletionJourneyPublicId;

  /**
   * Public identity of the Journey provider.
   *
   * This is intentionally represented as a value object rather than a domain
   * entity relation.
   */
  providerPublicId: JourneyCompletionProviderPublicId;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current lifecycle status of the Journey Completion.
   */
  status: JourneyCompletionStatus;

  // ---------------------------------------------------------------------------
  // Completion Components
  // ---------------------------------------------------------------------------

  /**
   * Confirmation records belonging to this Journey Completion aggregate.
   *
   * Individual confirmation entities remain authoritative for determining
   * which roles have actually confirmed and whether those confirmations
   * remain valid.
   */
  confirmations: JourneyCompletionConfirmationEntity[];

  /**
   * Dispute records belonging to this Journey Completion aggregate.
   */
  disputes: JourneyCompletionDisputeEntity[];

  // ---------------------------------------------------------------------------
  // Confirmation Tracking
  // ---------------------------------------------------------------------------

  /**
   * Number of confirmations required before completion can be confirmed.
   */
  requiredConfirmations: number;

  /**
   * Number of currently active valid confirmations.
   *
   * This is aggregate bookkeeping only.
   *
   * The confirmation child entities remain authoritative for role-specific
   * confirmation validity.
   */
  confirmedCount: number;

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  /**
   * Time at which completion confirmation was requested.
   */
  completionRequestedAt?: Date | undefined;

  /**
   * Time at which completion was confirmed.
   */
  confirmedAt?: Date | undefined;

  /**
   * Time at which the completion entered dispute handling.
   */
  disputedAt?: Date | undefined;

  /**
   * Time at which the completion was cancelled.
   */
  cancelledAt?: Date | undefined;

  // ---------------------------------------------------------------------------
  // Aggregate Version
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
 * Root entity of the Journey Completion aggregate.
 *
 * A JourneyCompletion represents the process by which a Journey is formally
 * completed through the required confirmation and, where applicable, dispute
 * handling.
 *
 * The aggregate owns:
 *
 * - JourneyCompletionConfirmation
 * - JourneyCompletionDispute
 *
 * Cross-domain references such as the Journey and provider are represented
 * exclusively through public identity value objects.
 *
 * The aggregate does not own:
 *
 * - Journey lifecycle;
 * - settlement;
 * - payment;
 * - payout;
 * - dispute resolution policy.
 *
 * Those concerns belong to their respective aggregates, application services,
 * or domain policies.
 */
export class JourneyCompletionEntity extends Entity<
  JourneyCompletionProps,
  JourneyCompletionPublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: JourneyCompletionProps,
    id?: UniqueEntityId,
    publicId?: JourneyCompletionPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: JourneyCompletionPublicId | undefined;

    journeyPublicId: JourneyCompletionJourneyPublicId;

    providerPublicId: JourneyCompletionProviderPublicId;

    status?: JourneyCompletionStatus | undefined;

    confirmations?: JourneyCompletionConfirmationEntity[] | undefined;

    disputes?: JourneyCompletionDisputeEntity[] | undefined;

    requiredConfirmations?: number | undefined;

    confirmedCount?: number | undefined;

    completionRequestedAt?: Date | undefined;

    confirmedAt?: Date | undefined;

    disputedAt?: Date | undefined;

    cancelledAt?: Date | undefined;

    version?: number | undefined;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): JourneyCompletionEntity {
    const now = new Date();

    const publicId = props.publicId ?? new JourneyCompletionPublicId();

    const requiredConfirmations = props.requiredConfirmations ?? 2;

    const confirmedCount = props.confirmedCount ?? 0;

    const version = props.version ?? 1;

    const confirmations = [...(props.confirmations ?? [])];

    const disputes = [...(props.disputes ?? [])];

    JourneyCompletionEntity.assertRequiredConfirmations(requiredConfirmations);

    JourneyCompletionEntity.assertConfirmedCount(
      confirmedCount,
      requiredConfirmations,
    );

    JourneyCompletionEntity.assertVersion(version);

    JourneyCompletionEntity.assertUniqueEntities(
      confirmations,
      'confirmations',
    );

    JourneyCompletionEntity.assertUniqueEntities(disputes, 'disputes');

    return new JourneyCompletionEntity(
      {
        // ---------------------------------------------------------------------
        // Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Cross-domain References
        // ---------------------------------------------------------------------

        journeyPublicId: props.journeyPublicId,

        providerPublicId: props.providerPublicId,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: props.status ?? JourneyCompletionStatus.pending(),

        // ---------------------------------------------------------------------
        // Completion Components
        // ---------------------------------------------------------------------

        confirmations,

        disputes,

        // ---------------------------------------------------------------------
        // Confirmation Tracking
        // ---------------------------------------------------------------------

        requiredConfirmations,

        confirmedCount,

        // ---------------------------------------------------------------------
        // Lifecycle Timestamps
        // ---------------------------------------------------------------------

        completionRequestedAt: JourneyCompletionEntity.cloneOptionalDate(
          props.completionRequestedAt,
        ),

        confirmedAt: JourneyCompletionEntity.cloneOptionalDate(
          props.confirmedAt,
        ),

        disputedAt: JourneyCompletionEntity.cloneOptionalDate(props.disputedAt),

        cancelledAt: JourneyCompletionEntity.cloneOptionalDate(
          props.cancelledAt,
        ),

        // ---------------------------------------------------------------------
        // Version
        // ---------------------------------------------------------------------

        version,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: JourneyCompletionEntity.cloneDate(props.createdAt ?? now),

        updatedAt: JourneyCompletionEntity.cloneDate(props.updatedAt ?? now),
      },
      undefined,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Rehydrates a Journey Completion from persistence.
   *
   * Persistence identity is authoritative during rehydration.
   */
  public static rehydrate(
    props: JourneyCompletionProps,
    id: UniqueEntityId,
    publicId: JourneyCompletionPublicId,
  ): JourneyCompletionEntity {
    JourneyCompletionEntity.assertRequiredConfirmations(
      props.requiredConfirmations,
    );

    JourneyCompletionEntity.assertConfirmedCount(
      props.confirmedCount,
      props.requiredConfirmations,
    );

    JourneyCompletionEntity.assertVersion(props.version);

    JourneyCompletionEntity.assertUniqueEntities(
      props.confirmations,
      'confirmations',
    );

    JourneyCompletionEntity.assertUniqueEntities(props.disputes, 'disputes');

    return new JourneyCompletionEntity(
      {
        ...props,

        // ---------------------------------------------------------------------
        // Persistence Identity
        // ---------------------------------------------------------------------

        publicId,

        // ---------------------------------------------------------------------
        // Child Entities
        // ---------------------------------------------------------------------

        confirmations: [...props.confirmations],

        disputes: [...props.disputes],

        // ---------------------------------------------------------------------
        // Lifecycle Timestamps
        // ---------------------------------------------------------------------

        completionRequestedAt: JourneyCompletionEntity.cloneOptionalDate(
          props.completionRequestedAt,
        ),

        confirmedAt: JourneyCompletionEntity.cloneOptionalDate(
          props.confirmedAt,
        ),

        disputedAt: JourneyCompletionEntity.cloneOptionalDate(props.disputedAt),

        cancelledAt: JourneyCompletionEntity.cloneOptionalDate(
          props.cancelledAt,
        ),

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: JourneyCompletionEntity.cloneDate(props.createdAt),

        updatedAt: JourneyCompletionEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): JourneyCompletionPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Journey Reference
  // ---------------------------------------------------------------------------

  public get journeyPublicId(): JourneyCompletionJourneyPublicId {
    return this.props.journeyPublicId;
  }

  public setJourneyPublicId(
    journeyPublicId: JourneyCompletionJourneyPublicId,
  ): void {
    if (this.props.journeyPublicId.equals(journeyPublicId)) {
      return;
    }

    this.props.journeyPublicId = journeyPublicId;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Provider Reference
  // ---------------------------------------------------------------------------

  public get providerPublicId(): JourneyCompletionProviderPublicId {
    return this.props.providerPublicId;
  }

  public setProviderPublicId(
    providerPublicId: JourneyCompletionProviderPublicId,
  ): void {
    if (this.props.providerPublicId.equals(providerPublicId)) {
      return;
    }

    this.props.providerPublicId = providerPublicId;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  public get status(): JourneyCompletionStatus {
    return this.props.status;
  }

  // ---------------------------------------------------------------------------
  // Confirmation Components
  // ---------------------------------------------------------------------------

  /**
   * Returns a read-only snapshot of the confirmation collection.
   *
   * The aggregate retains ownership of the underlying collection.
   */
  public get confirmations(): readonly JourneyCompletionConfirmationEntity[] {
    return [...this.props.confirmations];
  }

  /**
   * Adds a confirmation child to the aggregate.
   *
   * Duplicate confirmation identities are ignored.
   */
  public addConfirmation(
    confirmation: JourneyCompletionConfirmationEntity,
  ): void {
    if (this.hasConfirmation(confirmation)) {
      return;
    }

    this.props.confirmations.push(confirmation);

    this.touch();
  }

  /**
   * Removes a confirmation child from the aggregate.
   */
  public removeConfirmation(
    confirmation: JourneyCompletionConfirmationEntity,
  ): void {
    const previousLength = this.props.confirmations.length;

    this.props.confirmations = this.props.confirmations.filter(
      (existing) => !existing.equals(confirmation),
    );

    if (this.props.confirmations.length !== previousLength) {
      this.touch();
    }
  }

  /**
   * Replaces the complete confirmation collection.
   */
  public setConfirmations(
    confirmations: JourneyCompletionConfirmationEntity[],
  ): void {
    const nextConfirmations = [...confirmations];

    JourneyCompletionEntity.assertUniqueEntities(
      nextConfirmations,
      'confirmations',
    );

    this.props.confirmations = nextConfirmations;

    this.touch();
  }

  /**
   * Removes all confirmation children.
   */
  public clearConfirmations(): void {
    if (this.props.confirmations.length === 0) {
      return;
    }

    this.props.confirmations = [];

    this.touch();
  }

  public hasConfirmations(): boolean {
    return this.props.confirmations.length > 0;
  }

  public confirmationCount(): number {
    return this.props.confirmations.length;
  }

  public hasConfirmation(
    confirmation: JourneyCompletionConfirmationEntity,
  ): boolean {
    return this.props.confirmations.some((existing) =>
      existing.equals(confirmation),
    );
  }

  // ---------------------------------------------------------------------------
  // Dispute Components
  // ---------------------------------------------------------------------------

  /**
   * Returns a read-only snapshot of the dispute collection.
   */
  public get disputes(): readonly JourneyCompletionDisputeEntity[] {
    return [...this.props.disputes];
  }

  /**
   * Adds a dispute child to the aggregate.
   *
   * Duplicate dispute identities are ignored.
   */
  public addDispute(dispute: JourneyCompletionDisputeEntity): void {
    if (this.hasDispute(dispute)) {
      return;
    }

    this.props.disputes.push(dispute);

    this.touch();
  }

  /**
   * Removes a dispute child from the aggregate.
   */
  public removeDispute(dispute: JourneyCompletionDisputeEntity): void {
    const previousLength = this.props.disputes.length;

    this.props.disputes = this.props.disputes.filter(
      (existing) => !existing.equals(dispute),
    );

    if (this.props.disputes.length !== previousLength) {
      this.touch();
    }
  }

  /**
   * Replaces the complete dispute collection.
   */
  public setDisputes(disputes: JourneyCompletionDisputeEntity[]): void {
    const nextDisputes = [...disputes];

    JourneyCompletionEntity.assertUniqueEntities(nextDisputes, 'disputes');

    this.props.disputes = nextDisputes;

    this.touch();
  }

  /**
   * Removes all dispute children.
   */
  public clearDisputes(): void {
    if (this.props.disputes.length === 0) {
      return;
    }

    this.props.disputes = [];

    this.touch();
  }

  public hasDisputes(): boolean {
    return this.props.disputes.length > 0;
  }

  public disputeCount(): number {
    return this.props.disputes.length;
  }

  public hasDispute(dispute: JourneyCompletionDisputeEntity): boolean {
    return this.props.disputes.some((existing) => existing.equals(dispute));
  }

  // ---------------------------------------------------------------------------
  // Confirmation Tracking
  // ---------------------------------------------------------------------------

  public get requiredConfirmations(): number {
    return this.props.requiredConfirmations;
  }

  public setRequiredConfirmations(requiredConfirmations: number): void {
    JourneyCompletionEntity.assertRequiredConfirmations(requiredConfirmations);

    JourneyCompletionEntity.assertConfirmedCount(
      this.props.confirmedCount,
      requiredConfirmations,
    );

    if (this.props.requiredConfirmations === requiredConfirmations) {
      return;
    }

    this.props.requiredConfirmations = requiredConfirmations;

    this.touch();
  }

  public get confirmedCount(): number {
    return this.props.confirmedCount;
  }

  public setConfirmedCount(confirmedCount: number): void {
    JourneyCompletionEntity.assertConfirmedCount(
      confirmedCount,
      this.props.requiredConfirmations,
    );

    if (this.props.confirmedCount === confirmedCount) {
      return;
    }

    this.props.confirmedCount = confirmedCount;

    this.touch();
  }

  public incrementConfirmedCount(): void {
    const nextCount = this.props.confirmedCount + 1;

    JourneyCompletionEntity.assertConfirmedCount(
      nextCount,
      this.props.requiredConfirmations,
    );

    this.props.confirmedCount = nextCount;

    this.touch();
  }

  public decrementConfirmedCount(): void {
    const nextCount = this.props.confirmedCount - 1;

    JourneyCompletionEntity.assertConfirmedCount(
      nextCount,
      this.props.requiredConfirmations,
    );

    this.props.confirmedCount = nextCount;

    this.touch();
  }

  public hasRequiredConfirmations(): boolean {
    return this.props.confirmedCount >= this.props.requiredConfirmations;
  }

  public remainingConfirmations(): number {
    return Math.max(
      0,
      this.props.requiredConfirmations - this.props.confirmedCount,
    );
  }

  // ---------------------------------------------------------------------------
  // Completion Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Moves a pending completion into the confirmation phase.
   *
   * The eligibility of the Journey itself remains outside this aggregate.
   */
  public requestCompletion(at: Date = new Date()): void {
    const nextStatus = JourneyCompletionStatus.confirmationRequired();

    if (!this.props.status.canTransitionTo(nextStatus)) {
      return;
    }

    this.props.status = nextStatus;

    this.props.completionRequestedAt = JourneyCompletionEntity.cloneDate(at);

    this.props.confirmedAt = undefined;
    this.props.disputedAt = undefined;
    this.props.cancelledAt = undefined;

    this.touch(at);
  }

  /**
   * Confirms the Journey Completion.
   *
   * Confirmation is only valid when:
   *
   * - the aggregate is in confirmation-required state; and
   * - the required number of valid confirmations has been reached.
   *
   * Role-specific validation remains the responsibility of the confirmation
   * child entities and the appropriate domain/application policy.
   */
  public confirm(at: Date = new Date()): void {
    if (!this.canBeConfirmed()) {
      return;
    }

    const nextStatus = JourneyCompletionStatus.confirmed();

    if (!this.props.status.canTransitionTo(nextStatus)) {
      return;
    }

    this.props.status = nextStatus;

    this.props.confirmedAt = JourneyCompletionEntity.cloneDate(at);

    this.props.disputedAt = undefined;
    this.props.cancelledAt = undefined;

    this.touch(at);
  }

  /**
   * Moves the completion into dispute handling.
   *
   * A dispute may only be opened while confirmation is required.
   */
  public dispute(at: Date = new Date()): void {
    if (!this.canBeDisputed()) {
      return;
    }

    const nextStatus = JourneyCompletionStatus.disputed();

    if (!this.props.status.canTransitionTo(nextStatus)) {
      return;
    }

    this.props.status = nextStatus;

    this.props.disputedAt = JourneyCompletionEntity.cloneDate(at);

    this.props.confirmedAt = undefined;
    this.props.cancelledAt = undefined;

    this.touch(at);
  }

  /**
   * Cancels the Journey Completion process.
   *
   * Cancellation is valid only while the completion is:
   *
   * - pending; or
   * - awaiting confirmation.
   *
   * Dispute handling is deliberately not silently cancelled by this
   * aggregate operation.
   */
  public cancel(at: Date = new Date()): void {
    if (!this.canBeCancelled()) {
      return;
    }

    const nextStatus = JourneyCompletionStatus.cancelled();

    if (!this.props.status.canTransitionTo(nextStatus)) {
      return;
    }

    this.props.status = nextStatus;

    this.props.cancelledAt = JourneyCompletionEntity.cloneDate(at);

    this.props.confirmedAt = undefined;
    this.props.disputedAt = undefined;

    this.touch(at);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Queries
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.status.isPending();
  }

  public isConfirmationRequired(): boolean {
    return this.props.status.isConfirmationRequired();
  }

  public isConfirmed(): boolean {
    return this.props.status.isConfirmed();
  }

  public isDisputed(): boolean {
    return this.props.status.isDisputed();
  }

  public isCancelled(): boolean {
    return this.props.status.isCancelled();
  }

  public isActive(): boolean {
    return this.props.status.isActive();
  }

  public isTerminal(): boolean {
    return this.props.status.isTerminal();
  }

  /**
   * Determines whether the aggregate currently satisfies the conditions
   * required to perform confirmation.
   */
  public canBeConfirmed(): boolean {
    return this.isConfirmationRequired() && this.hasRequiredConfirmations();
  }

  /**
   * Determines whether a dispute may currently be opened.
   */
  public canBeDisputed(): boolean {
    return this.isConfirmationRequired();
  }

  /**
   * Determines whether cancellation may currently be requested.
   */
  public canBeCancelled(): boolean {
    return this.isPending() || this.isConfirmationRequired();
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  public get completionRequestedAt(): Date | undefined {
    return JourneyCompletionEntity.cloneOptionalDate(
      this.props.completionRequestedAt,
    );
  }

  public setCompletionRequestedAt(
    completionRequestedAt: Date | undefined,
  ): void {
    if (
      JourneyCompletionEntity.areDatesEqual(
        this.props.completionRequestedAt,
        completionRequestedAt,
      )
    ) {
      return;
    }

    this.props.completionRequestedAt =
      JourneyCompletionEntity.cloneOptionalDate(completionRequestedAt);

    this.touch();
  }

  public hasCompletionBeenRequested(): boolean {
    return this.props.completionRequestedAt !== undefined;
  }

  public get confirmedAt(): Date | undefined {
    return JourneyCompletionEntity.cloneOptionalDate(this.props.confirmedAt);
  }

  public setConfirmedAt(confirmedAt: Date | undefined): void {
    if (
      JourneyCompletionEntity.areDatesEqual(this.props.confirmedAt, confirmedAt)
    ) {
      return;
    }

    this.props.confirmedAt =
      JourneyCompletionEntity.cloneOptionalDate(confirmedAt);

    this.touch();
  }

  public hasBeenConfirmed(): boolean {
    return this.props.confirmedAt !== undefined;
  }

  public get disputedAt(): Date | undefined {
    return JourneyCompletionEntity.cloneOptionalDate(this.props.disputedAt);
  }

  public setDisputedAt(disputedAt: Date | undefined): void {
    if (
      JourneyCompletionEntity.areDatesEqual(this.props.disputedAt, disputedAt)
    ) {
      return;
    }

    this.props.disputedAt =
      JourneyCompletionEntity.cloneOptionalDate(disputedAt);

    this.touch();
  }

  public hasBeenDisputed(): boolean {
    return this.props.disputedAt !== undefined;
  }

  public get cancelledAt(): Date | undefined {
    return JourneyCompletionEntity.cloneOptionalDate(this.props.cancelledAt);
  }

  public setCancelledAt(cancelledAt: Date | undefined): void {
    if (
      JourneyCompletionEntity.areDatesEqual(this.props.cancelledAt, cancelledAt)
    ) {
      return;
    }

    this.props.cancelledAt =
      JourneyCompletionEntity.cloneOptionalDate(cancelledAt);

    this.touch();
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
   * Sets the optimistic concurrency version.
   *
   * Version changes are intentionally independent from updatedAt. Persistence
   * infrastructure may use this method during rehydration or concurrency
   * handling without creating a domain audit mutation.
   */
  public setVersion(version: number): void {
    JourneyCompletionEntity.assertVersion(version);

    if (this.props.version === version) {
      return;
    }

    this.props.version = version;
  }

  /**
   * Increments the optimistic concurrency version.
   *
   * Version changes are intentionally independent from updatedAt.
   */
  public incrementVersion(): void {
    const nextVersion = this.props.version + 1;

    JourneyCompletionEntity.assertVersion(nextVersion);

    this.props.version = nextVersion;
  }

  // ---------------------------------------------------------------------------
  // Completeness
  // ---------------------------------------------------------------------------

  /**
   * Determines whether the aggregate contains the minimum structural
   * information required to represent a valid Journey Completion.
   *
   * This method intentionally does not validate business policies such as:
   *
   * - whether the Journey is eligible for completion;
   * - whether specific confirmation roles are present;
   * - whether a dispute may be resolved;
   * - whether settlement may proceed.
   */
  public isComplete(): boolean {
    return (
      this.props.requiredConfirmations >= 1 &&
      this.props.confirmedCount >= 0 &&
      this.props.confirmedCount <= this.props.requiredConfirmations &&
      this.props.version >= 1 &&
      this.props.confirmations.every(
        (confirmation) => confirmation !== undefined,
      ) &&
      this.props.disputes.every((dispute) => dispute !== undefined)
    );
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return JourneyCompletionEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return JourneyCompletionEntity.cloneDate(this.props.updatedAt);
  }

  /**
   * Explicitly changes updatedAt.
   *
   * This is primarily useful for persistence and rehydration concerns.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = JourneyCompletionEntity.cloneDate(updatedAt);
  }

  /**
   * Updates the aggregate audit timestamp without changing lifecycle state.
   */
  public override touch(at: Date = new Date()): void {
    this.props.updatedAt = JourneyCompletionEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: JourneyCompletionEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static assertRequiredConfirmations(
    requiredConfirmations: number,
  ): void {
    if (!Number.isInteger(requiredConfirmations)) {
      throw new Error(
        'Journey completion required confirmations must be an integer.',
      );
    }

    if (requiredConfirmations < 1) {
      throw new Error(
        'Journey completion must require at least one confirmation.',
      );
    }
  }

  private static assertConfirmedCount(
    confirmedCount: number,
    requiredConfirmations: number,
  ): void {
    if (!Number.isInteger(confirmedCount)) {
      throw new Error('Journey completion confirmed count must be an integer.');
    }

    if (confirmedCount < 0) {
      throw new Error('Journey completion confirmed count cannot be negative.');
    }

    if (confirmedCount > requiredConfirmations) {
      throw new Error(
        'Journey completion confirmed count cannot exceed required confirmations.',
      );
    }
  }

  private static assertVersion(version: number): void {
    if (!Number.isInteger(version)) {
      throw new Error('Journey completion version must be an integer.');
    }

    if (version < 1) {
      throw new Error(
        'Journey completion version must be greater than or equal to one.',
      );
    }
  }

  /**
   * Ensures that an aggregate-owned child collection does not contain
   * duplicate entity identities.
   *
   * Child entities remain responsible for their own internal invariants.
   */
  // -----------------------------------------------------------------------------
  // Validation Helpers
  // -----------------------------------------------------------------------------

  private static assertUniqueEntities<
    T extends {
      equals(other?: T): boolean;
    },
  >(entities: T[], collectionName: string): void {
    for (let index = 0; index < entities.length; index += 1) {
      const entity = entities[index];

      // Required for TypeScript when noUncheckedIndexedAccess is enabled.
      if (entity === undefined) {
        continue;
      }

      for (
        let comparisonIndex = index + 1;
        comparisonIndex < entities.length;
        comparisonIndex += 1
      ) {
        const comparisonEntity = entities[comparisonIndex];

        if (comparisonEntity === undefined) {
          continue;
        }

        if (entity.equals(comparisonEntity)) {
          throw new Error(
            `Journey completion ${collectionName} cannot contain duplicate child entities.`,
          );
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }

  private static cloneOptionalDate(date: Date | undefined): Date | undefined {
    return date !== undefined
      ? JourneyCompletionEntity.cloneDate(date)
      : undefined;
  }

  private static areDatesEqual(
    first: Date | undefined,
    second: Date | undefined,
  ): boolean {
    if (first === undefined && second === undefined) {
      return true;
    }

    if (first === undefined || second === undefined) {
      return false;
    }

    return first.getTime() === second.getTime();
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { JourneyCompletionProps };
