// -----------------------------------------------------------------------------
// Notification Preference — Aggregate
// -----------------------------------------------------------------------------
//
// Represents the Notification Preference aggregate.
//
// Aggregate boundary:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// NotificationPreferenceEntity is the aggregate root entity.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain the NotificationPreferenceEntity aggregate root;
// - maintain aggregate identity;
// - maintain the opaque member public identity reference;
// - expose notification preference state;
// - coordinate preference mutations through the root entity;
// - record Notification Preference domain events;
// - enforce invariants that belong to the aggregate boundary.
//
// -----------------------------------------------------------------------------
//
// Entity responsibilities:
//
// NotificationPreferenceEntity owns:
//
// - notification preference state;
// - Journey preference;
// - Booking preference;
// - Payment preference;
// - Wallet preference;
// - Trust preference;
// - Verification preference;
// - Message preference;
// - Support preference;
// - System preference;
// - preference timestamps;
// - preference-level invariants;
// - preference state mutation.
//
// -----------------------------------------------------------------------------
//
// This aggregate does NOT:
//
// - load Identity aggregates;
// - validate whether the member exists;
// - access Prisma;
// - access repositories;
// - perform authorization;
// - send notifications;
// - deliver notifications;
// - communicate with Push, Email, or SMS providers.
//
// The memberPublicId is an opaque reference to the Identity domain.
//
// -----------------------------------------------------------------------------
//
// Aggregate identity:
//
// The aggregate identity is the identity of NotificationPreferenceEntity.
//
// Domain events:
//
// - NotificationPreferenceCreatedEvent
// - NotificationPreferenceUpdatedEvent
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from '../exceptions/notification.exception';

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

import { NotificationPreferenceCreatedEvent } from '../events/notification-preference-created.event';

import { NotificationPreferenceUpdatedEvent } from '../events/notification-preference-updated.event';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { NotificationPreferenceEntity } from '../entities/notification-preference.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { NotificationMemberPublicId } from '../value-objects/notification-member-public-id.vo';

import type { NotificationPreferencePublicId } from '../value-objects/notification-preference-public-id.vo';

// =============================================================================
// Properties
// =============================================================================

export interface NotificationPreferenceAggregateProps {
  /**
   * Notification Preference aggregate root entity.
   */
  preference: NotificationPreferenceEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

export class NotificationPreferenceAggregate extends AggregateRoot<
  NotificationPreferenceAggregateProps,
  NotificationPreferencePublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: NotificationPreferenceAggregateProps) {
    super(props, props.preference.id, props.preference.publicId);

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a Notification Preference aggregate from a new entity.
   *
   * Aggregate construction does not automatically record a domain event.
   *
   * Domain-event recording is explicit so that correlation and causation
   * metadata can be supplied by the application workflow.
   */
  public static create(
    preference: NotificationPreferenceEntity,
  ): NotificationPreferenceAggregate {
    NotificationPreferenceAggregate.ensurePreference(preference);

    return new NotificationPreferenceAggregate({
      preference,
    });
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Notification Preference aggregate.
   *
   * Rehydration never records domain events.
   */
  public static rehydrate(
    preference: NotificationPreferenceEntity,
  ): NotificationPreferenceAggregate {
    NotificationPreferenceAggregate.ensurePreference(preference);

    return new NotificationPreferenceAggregate({
      preference,
    });
  }

  // ===========================================================================
  // Preference
  // ===========================================================================

  /**
   * Returns the Notification Preference aggregate root entity.
   *
   * The entity remains the authoritative owner of preference state.
   */
  public get preference(): NotificationPreferenceEntity {
    return this.props.preference;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Returns the internal identity of the aggregate.
   */
  public override get id(): UniqueEntityId {
    return this.preference.id;
  }

  /**
   * Returns the public identity of the aggregate.
   */
  public override get publicId(): NotificationPreferencePublicId {
    return this.preference.publicId;
  }

  // ===========================================================================
  // Member
  // ===========================================================================

  /**
   * Returns the opaque public identity of the member whose preferences
   * are represented by this aggregate.
   *
   * The identifier belongs to the Identity domain.
   */
  public get memberPublicId(): NotificationMemberPublicId {
    return this.preference.memberPublicId;
  }

  /**
   * Determines whether this Notification Preference aggregate belongs
   * to the supplied member.
   */
  public belongsToMember(memberPublicId: NotificationMemberPublicId): boolean {
    if (!(memberPublicId instanceof NotificationMemberPublicId)) {
      return false;
    }

    return this.preference.belongsToMember(memberPublicId);
  }

  // ===========================================================================
  // Journey
  // ===========================================================================

  /**
   * Determines whether Journey notifications are enabled.
   */
  public isJourneyEnabled(): boolean {
    return this.preference.isJourneyEnabled();
  }

  /**
   * Enables Journey notifications.
   */
  public enableJourney(): void {
    this.preference.enableJourney();
  }

  /**
   * Disables Journey notifications.
   */
  public disableJourney(): void {
    this.preference.disableJourney();
  }

  /**
   * Sets the Journey notification preference.
   */
  public setJourneyEnabled(enabled: boolean): void {
    this.preference.setJourneyEnabled(enabled);
  }

  // ===========================================================================
  // Booking
  // ===========================================================================

  /**
   * Determines whether Booking notifications are enabled.
   */
  public isBookingEnabled(): boolean {
    return this.preference.isBookingEnabled();
  }

  /**
   * Enables Booking notifications.
   */
  public enableBooking(): void {
    this.preference.enableBooking();
  }

  /**
   * Disables Booking notifications.
   */
  public disableBooking(): void {
    this.preference.disableBooking();
  }

  /**
   * Sets the Booking notification preference.
   */
  public setBookingEnabled(enabled: boolean): void {
    this.preference.setBookingEnabled(enabled);
  }

  // ===========================================================================
  // Payment
  // ===========================================================================

  /**
   * Determines whether Payment notifications are enabled.
   */
  public isPaymentEnabled(): boolean {
    return this.preference.isPaymentEnabled();
  }

  /**
   * Enables Payment notifications.
   */
  public enablePayment(): void {
    this.preference.enablePayment();
  }

  /**
   * Disables Payment notifications.
   */
  public disablePayment(): void {
    this.preference.disablePayment();
  }

  /**
   * Sets the Payment notification preference.
   */
  public setPaymentEnabled(enabled: boolean): void {
    this.preference.setPaymentEnabled(enabled);
  }

  // ===========================================================================
  // Wallet
  // ===========================================================================

  /**
   * Determines whether Wallet notifications are enabled.
   */
  public isWalletEnabled(): boolean {
    return this.preference.isWalletEnabled();
  }

  /**
   * Enables Wallet notifications.
   */
  public enableWallet(): void {
    this.preference.enableWallet();
  }

  /**
   * Disables Wallet notifications.
   */
  public disableWallet(): void {
    this.preference.disableWallet();
  }

  /**
   * Sets the Wallet notification preference.
   */
  public setWalletEnabled(enabled: boolean): void {
    this.preference.setWalletEnabled(enabled);
  }

  // ===========================================================================
  // Trust
  // ===========================================================================

  /**
   * Determines whether Trust notifications are enabled.
   */
  public isTrustEnabled(): boolean {
    return this.preference.isTrustEnabled();
  }

  /**
   * Enables Trust notifications.
   */
  public enableTrust(): void {
    this.preference.enableTrust();
  }

  /**
   * Disables Trust notifications.
   */
  public disableTrust(): void {
    this.preference.disableTrust();
  }

  /**
   * Sets the Trust notification preference.
   */
  public setTrustEnabled(enabled: boolean): void {
    this.preference.setTrustEnabled(enabled);
  }

  // ===========================================================================
  // Verification
  // ===========================================================================

  /**
   * Determines whether Verification notifications are enabled.
   */
  public isVerificationEnabled(): boolean {
    return this.preference.isVerificationEnabled();
  }

  /**
   * Enables Verification notifications.
   */
  public enableVerification(): void {
    this.preference.enableVerification();
  }

  /**
   * Disables Verification notifications.
   */
  public disableVerification(): void {
    this.preference.disableVerification();
  }

  /**
   * Sets the Verification notification preference.
   */
  public setVerificationEnabled(enabled: boolean): void {
    this.preference.setVerificationEnabled(enabled);
  }

  // ===========================================================================
  // Message
  // ===========================================================================

  /**
   * Determines whether Message notifications are enabled.
   */
  public isMessageEnabled(): boolean {
    return this.preference.isMessageEnabled();
  }

  /**
   * Enables Message notifications.
   */
  public enableMessage(): void {
    this.preference.enableMessage();
  }

  /**
   * Disables Message notifications.
   */
  public disableMessage(): void {
    this.preference.disableMessage();
  }

  /**
   * Sets the Message notification preference.
   */
  public setMessageEnabled(enabled: boolean): void {
    this.preference.setMessageEnabled(enabled);
  }

  // ===========================================================================
  // Support
  // ===========================================================================

  /**
   * Determines whether Support notifications are enabled.
   */
  public isSupportEnabled(): boolean {
    return this.preference.isSupportEnabled();
  }

  /**
   * Enables Support notifications.
   */
  public enableSupport(): void {
    this.preference.enableSupport();
  }

  /**
   * Disables Support notifications.
   */
  public disableSupport(): void {
    this.preference.disableSupport();
  }

  /**
   * Sets the Support notification preference.
   */
  public setSupportEnabled(enabled: boolean): void {
    this.preference.setSupportEnabled(enabled);
  }

  // ===========================================================================
  // System
  // ===========================================================================

  /**
   * Determines whether System notifications are enabled.
   */
  public isSystemEnabled(): boolean {
    return this.preference.isSystemEnabled();
  }

  /**
   * Enables System notifications.
   */
  public enableSystem(): void {
    this.preference.enableSystem();
  }

  /**
   * Disables System notifications.
   */
  public disableSystem(): void {
    this.preference.disableSystem();
  }

  /**
   * Sets the System notification preference.
   */
  public setSystemEnabled(enabled: boolean): void {
    this.preference.setSystemEnabled(enabled);
  }

  // ===========================================================================
  // Bulk Operations
  // ===========================================================================

  /**
   * Enables every notification category.
   */
  public enableAll(): void {
    this.preference.enableAll();
  }

  /**
   * Disables every notification category.
   */
  public disableAll(): void {
    this.preference.disableAll();
  }

  // ===========================================================================
  // Preference Summary
  // ===========================================================================

  /**
   * Determines whether every notification category is enabled.
   */
  public areAllEnabled(): boolean {
    return this.preference.areAllEnabled();
  }

  /**
   * Determines whether every notification category is disabled.
   */
  public areAllDisabled(): boolean {
    return this.preference.areAllDisabled();
  }

  /**
   * Determines whether at least one notification category is enabled.
   */
  public hasEnabledPreferences(): boolean {
    return this.preference.hasEnabledPreferences();
  }

  /**
   * Returns the number of enabled notification categories.
   */
  public enabledPreferenceCount(): number {
    return this.preference.enabledPreferenceCount();
  }

  /**
   * Returns the number of disabled notification categories.
   */
  public disabledPreferenceCount(): number {
    return this.preference.disabledPreferenceCount();
  }

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  /**
   * Returns the creation timestamp.
   */
  public get createdAt(): Date {
    return this.preference.createdAt;
  }

  /**
   * Returns the last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.preference.updatedAt;
  }

  /**
   * Updates the Notification Preference timestamp.
   *
   * Timestamp validation and mutation remain owned by the entity.
   */
  public setUpdatedAt(updatedAt: Date): void {
    NotificationPreferenceAggregate.ensureValidDate(
      updatedAt,
      'Notification preference updated date',
    );

    this.preference.setUpdatedAt(updatedAt);
  }

  // ===========================================================================
  // Creation Event
  // ===========================================================================

  /**
   * Records the Notification Preference created event.
   *
   * Event recording is intentionally explicit rather than being performed
   * automatically by create().
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    NotificationPreferenceAggregate.ensureCorrelationId(correlationId);

    NotificationPreferenceAggregate.ensureOptionalCausationId(causationId);

    const state = this.getPreferenceState();

    this.addDomainEvent(
      new NotificationPreferenceCreatedEvent(
        this.id.value,
        this.publicId.value,
        this.memberPublicId.value,

        state.journeyEnabled,
        state.bookingEnabled,
        state.paymentEnabled,
        state.walletEnabled,
        state.trustEnabled,
        state.verificationEnabled,
        state.messageEnabled,
        state.supportEnabled,
        state.systemEnabled,

        this.createdAt,

        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Updated Event
  // ===========================================================================

  /**
   * Records the current Notification Preference state as an updated event.
   *
   * Preference mutation is performed by the entity.
   *
   * Event recording is performed explicitly by the aggregate.
   */
  public recordUpdated(correlationId: string, causationId?: string): void {
    NotificationPreferenceAggregate.ensureCorrelationId(correlationId);

    NotificationPreferenceAggregate.ensureOptionalCausationId(causationId);

    const state = this.getPreferenceState();

    this.addDomainEvent(
      new NotificationPreferenceUpdatedEvent(
        this.id.value,
        this.publicId.value,
        this.memberPublicId.value,

        state.journeyEnabled,
        state.bookingEnabled,
        state.paymentEnabled,
        state.walletEnabled,
        state.trustEnabled,
        state.verificationEnabled,
        state.messageEnabled,
        state.supportEnabled,
        state.systemEnabled,

        this.updatedAt,

        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Preference State
  // ===========================================================================

  /**
   * Returns an immutable snapshot of the current preference state.
   */
  public getPreferenceState(): Readonly<{
    journeyEnabled: boolean;
    bookingEnabled: boolean;
    paymentEnabled: boolean;
    walletEnabled: boolean;
    trustEnabled: boolean;
    verificationEnabled: boolean;
    messageEnabled: boolean;
    supportEnabled: boolean;
    systemEnabled: boolean;
  }> {
    return Object.freeze({
      journeyEnabled: this.preference.isJourneyEnabled(),
      bookingEnabled: this.preference.isBookingEnabled(),
      paymentEnabled: this.preference.isPaymentEnabled(),
      walletEnabled: this.preference.isWalletEnabled(),
      trustEnabled: this.preference.isTrustEnabled(),
      verificationEnabled: this.preference.isVerificationEnabled(),
      messageEnabled: this.preference.isMessageEnabled(),
      supportEnabled: this.preference.isSupportEnabled(),
      systemEnabled: this.preference.isSystemEnabled(),
    });
  }

  // ===========================================================================
  // Aggregate Invariants
  // ===========================================================================

  /**
   * Validates invariants owned by the aggregate boundary.
   *
   * Entity-specific preference invariants remain inside
   * NotificationPreferenceEntity.
   */
  private validateAggregateInvariants(): void {
    NotificationPreferenceAggregate.ensurePreference(this.preference);

    NotificationPreferenceAggregate.ensureMemberPublicId(
      this.preference.memberPublicId,
    );
  }

  // ===========================================================================
  // Entity Guards
  // ===========================================================================

  /**
   * Ensures that the aggregate contains the correct root entity.
   */
  private static ensurePreference(
    preference: unknown,
  ): asserts preference is NotificationPreferenceEntity {
    if (!(preference instanceof NotificationPreferenceEntity)) {
      throw new NotificationException(
        'Notification preference aggregate requires a valid NotificationPreferenceEntity.',
      );
    }
  }

  // ===========================================================================
  // Member Guards
  // ===========================================================================

  /**
   * Ensures that the aggregate member reference is a valid
   * NotificationMemberPublicId value object.
   *
   * This validates the shape of the opaque reference only.
   *
   * It does NOT validate whether the member exists in Identity.
   */
  private static ensureMemberPublicId(
    memberPublicId: unknown,
  ): asserts memberPublicId is NotificationMemberPublicId {
    if (!(memberPublicId instanceof NotificationMemberPublicId)) {
      throw new NotificationException(
        'Notification preference member public ID must be a valid NotificationMemberPublicId.',
      );
    }

    if (memberPublicId.value.trim().length === 0) {
      throw new NotificationException(
        'Notification preference member public ID cannot be empty.',
      );
    }
  }

  // ===========================================================================
  // Correlation Guards
  // ===========================================================================

  /**
   * Validates a required correlation identifier.
   */
  private static ensureCorrelationId(correlationId: string): void {
    NotificationPreferenceAggregate.ensureNonEmptyString(
      correlationId,
      'Notification preference correlation identity',
    );
  }

  // ===========================================================================
  // Causation Guards
  // ===========================================================================

  /**
   * Validates an optional causation identifier.
   */
  private static ensureOptionalCausationId(
    causationId: string | undefined,
  ): void {
    if (causationId === undefined) {
      return;
    }

    NotificationPreferenceAggregate.ensureNonEmptyString(
      causationId,
      'Notification preference causation identity',
    );
  }

  // ===========================================================================
  // Primitive Guards
  // ===========================================================================

  /**
   * Ensures that a value is a non-empty string.
   */
  private static ensureNonEmptyString(
    value: unknown,
    fieldName: string,
  ): asserts value is string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new NotificationException(
        `${fieldName} must be a non-empty string.`,
      );
    }
  }

  // ===========================================================================
  // Date Guards
  // ===========================================================================

  /**
   * Ensures that a value is a valid Date.
   */
  private static ensureValidDate(
    value: unknown,
    fieldName: string,
  ): asserts value is Date {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new NotificationException(`${fieldName} must be a valid date.`);
    }
  }
}
