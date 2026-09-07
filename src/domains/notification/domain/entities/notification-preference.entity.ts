// -----------------------------------------------------------------------------
// Notification Preference — Entity
// -----------------------------------------------------------------------------
//
// Represents the notification preferences of a single member.
//
// Aggregate:
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
// - maintain Notification Preference identity;
// - maintain Notification Preference public identity;
// - maintain the opaque member public identity;
// - maintain notification-category preferences;
// - enable/disable notification categories;
// - enforce preference invariants;
// - expose preference state through domain-safe methods;
// - maintain creation and update timestamps.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - access Identity;
// - load Identity entities;
// - validate Identity existence;
// - access Prisma;
// - access repositories;
// - send notifications;
// - deliver notifications;
// - create Notification entities;
// - decide whether a notification should be sent;
// - communicate with Push, Email, or SMS providers.
//
// The memberPublicId is an opaque reference to the Identity domain.
//
// -----------------------------------------------------------------------------
//
// Persistence:
//
// NotificationPreference
// ├── id
// ├── publicId
// ├── memberPublicId
// ├── journeyEnabled
// ├── bookingEnabled
// ├── paymentEnabled
// ├── walletEnabled
// ├── trustEnabled
// ├── verificationEnabled
// ├── messageEnabled
// ├── supportEnabled
// ├── systemEnabled
// ├── createdAt
// └── updatedAt
//
// -----------------------------------------------------------------------------
//
// Preference categories:
//
// JOURNEY
// BOOKING
// PAYMENT
// WALLET
// TRUST
// VERIFICATION
// MESSAGE
// SUPPORT
// SYSTEM
//
// The category names intentionally correspond to NotificationType values.
//
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { NotificationException } from '../exceptions/notification.exception';

import { NotificationMemberPublicId } from '../value-objects/notification-member-public-id.vo';

import { NotificationPreferencePublicId } from '../value-objects/notification-preference-public-id.vo';

// =============================================================================
// Props
// =============================================================================

export interface NotificationPreferenceProps {
  /**
   * Public identity of the member whose notification preferences are stored.
   *
   * This is an opaque reference to the Identity domain.
   */
  memberPublicId: NotificationMemberPublicId;

  /**
   * Whether Journey notifications are enabled.
   */
  journeyEnabled: boolean;

  /**
   * Whether Booking notifications are enabled.
   */
  bookingEnabled: boolean;

  /**
   * Whether Payment notifications are enabled.
   */
  paymentEnabled: boolean;

  /**
   * Whether Wallet notifications are enabled.
   */
  walletEnabled: boolean;

  /**
   * Whether Trust notifications are enabled.
   */
  trustEnabled: boolean;

  /**
   * Whether Verification notifications are enabled.
   */
  verificationEnabled: boolean;

  /**
   * Whether Message notifications are enabled.
   */
  messageEnabled: boolean;

  /**
   * Whether Support notifications are enabled.
   */
  supportEnabled: boolean;

  /**
   * Whether System notifications are enabled.
   */
  systemEnabled: boolean;

  /**
   * Preference creation timestamp.
   */
  createdAt: Date;

  /**
   * Preference last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class NotificationPreferenceEntity extends Entity<
  NotificationPreferenceProps,
  NotificationPreferencePublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: NotificationPreferenceProps,
    id?: UniqueEntityId,
    publicId?: NotificationPreferencePublicId,
  ) {
    super(props, id, publicId);

    this.validateInvariants();
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates default notification preferences for a member.
   *
   * The frozen persistence schema defines every preference as enabled by
   * default, therefore newly-created preferences start with every category
   * enabled.
   */
  public static create(
    memberPublicId: NotificationMemberPublicId,
    createdAt: Date = new Date(),
  ): NotificationPreferenceEntity {
    NotificationPreferenceEntity.ensureMemberPublicId(memberPublicId);

    NotificationPreferenceEntity.ensureValidDate(createdAt, 'creation date');

    const timestamp = NotificationPreferenceEntity.cloneDate(createdAt);

    return new NotificationPreferenceEntity(
      {
        memberPublicId,

        journeyEnabled: true,
        bookingEnabled: true,
        paymentEnabled: true,
        walletEnabled: true,
        trustEnabled: true,
        verificationEnabled: true,
        messageEnabled: true,
        supportEnabled: true,
        systemEnabled: true,

        createdAt: NotificationPreferenceEntity.cloneDate(timestamp),

        updatedAt: NotificationPreferenceEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new NotificationPreferencePublicId(),
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Notification Preference entity.
   *
   * Rehydration does not emit domain events.
   */
  public static rehydrate(
    props: NotificationPreferenceProps,
    id: UniqueEntityId,
    publicId: NotificationPreferencePublicId,
  ): NotificationPreferenceEntity {
    if (props === undefined) {
      throw new NotificationException(
        'Notification preference properties are required for rehydration.',
      );
    }

    if (!(id instanceof UniqueEntityId)) {
      throw new NotificationException(
        'Notification preference internal identity must be a valid entity identity.',
      );
    }

    if (publicId === undefined) {
      throw new NotificationException(
        'Notification preference public identity is required for rehydration.',
      );
    }

    NotificationPreferenceEntity.ensureMemberPublicId(props.memberPublicId);

    NotificationPreferenceEntity.ensureBoolean(
      props.journeyEnabled,
      'journeyEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      props.bookingEnabled,
      'bookingEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      props.paymentEnabled,
      'paymentEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      props.walletEnabled,
      'walletEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      props.trustEnabled,
      'trustEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      props.verificationEnabled,
      'verificationEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      props.messageEnabled,
      'messageEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      props.supportEnabled,
      'supportEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      props.systemEnabled,
      'systemEnabled',
    );

    NotificationPreferenceEntity.ensureValidDate(
      props.createdAt,
      'creation date',
    );

    NotificationPreferenceEntity.ensureValidDate(
      props.updatedAt,
      'updated date',
    );

    return new NotificationPreferenceEntity(
      {
        memberPublicId: props.memberPublicId,

        journeyEnabled: props.journeyEnabled,
        bookingEnabled: props.bookingEnabled,
        paymentEnabled: props.paymentEnabled,
        walletEnabled: props.walletEnabled,
        trustEnabled: props.trustEnabled,
        verificationEnabled: props.verificationEnabled,
        messageEnabled: props.messageEnabled,
        supportEnabled: props.supportEnabled,
        systemEnabled: props.systemEnabled,

        createdAt: NotificationPreferenceEntity.cloneDate(props.createdAt),

        updatedAt: NotificationPreferenceEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Notification Preference.
   */
  public override get publicId(): NotificationPreferencePublicId {
    return super.publicId;
  }

  /**
   * Internal identity of the Notification Preference.
   */
  public override get id(): UniqueEntityId {
    return super.id;
  }

  // ===========================================================================
  // Member
  // ===========================================================================

  /**
   * Public identity of the member owning these preferences.
   *
   * This identifier belongs to the Identity domain.
   */
  public get memberPublicId(): NotificationMemberPublicId {
    return this.props.memberPublicId;
  }

  /**
   * Determines whether these preferences belong to the supplied member.
   */
  public belongsToMember(memberPublicId: NotificationMemberPublicId): boolean {
    if (memberPublicId === undefined) {
      return false;
    }

    return this.props.memberPublicId.equals(memberPublicId);
  }

  // ===========================================================================
  // Journey
  // ===========================================================================

  /**
   * Determines whether Journey notifications are enabled.
   */
  public isJourneyEnabled(): boolean {
    return this.props.journeyEnabled;
  }

  /**
   * Enables Journey notifications.
   */
  public enableJourney(): void {
    this.setPreference('journeyEnabled', true);
  }

  /**
   * Disables Journey notifications.
   */
  public disableJourney(): void {
    this.setPreference('journeyEnabled', false);
  }

  /**
   * Sets the Journey notification preference.
   */
  public setJourneyEnabled(enabled: boolean): void {
    this.setPreference('journeyEnabled', enabled);
  }

  // ===========================================================================
  // Booking
  // ===========================================================================

  /**
   * Determines whether Booking notifications are enabled.
   */
  public isBookingEnabled(): boolean {
    return this.props.bookingEnabled;
  }

  /**
   * Enables Booking notifications.
   */
  public enableBooking(): void {
    this.setPreference('bookingEnabled', true);
  }

  /**
   * Disables Booking notifications.
   */
  public disableBooking(): void {
    this.setPreference('bookingEnabled', false);
  }

  /**
   * Sets the Booking notification preference.
   */
  public setBookingEnabled(enabled: boolean): void {
    this.setPreference('bookingEnabled', enabled);
  }

  // ===========================================================================
  // Payment
  // ===========================================================================

  /**
   * Determines whether Payment notifications are enabled.
   */
  public isPaymentEnabled(): boolean {
    return this.props.paymentEnabled;
  }

  /**
   * Enables Payment notifications.
   */
  public enablePayment(): void {
    this.setPreference('paymentEnabled', true);
  }

  /**
   * Disables Payment notifications.
   */
  public disablePayment(): void {
    this.setPreference('paymentEnabled', false);
  }

  /**
   * Sets the Payment notification preference.
   */
  public setPaymentEnabled(enabled: boolean): void {
    this.setPreference('paymentEnabled', enabled);
  }

  // ===========================================================================
  // Wallet
  // ===========================================================================

  /**
   * Determines whether Wallet notifications are enabled.
   */
  public isWalletEnabled(): boolean {
    return this.props.walletEnabled;
  }

  /**
   * Enables Wallet notifications.
   */
  public enableWallet(): void {
    this.setPreference('walletEnabled', true);
  }

  /**
   * Disables Wallet notifications.
   */
  public disableWallet(): void {
    this.setPreference('walletEnabled', false);
  }

  /**
   * Sets the Wallet notification preference.
   */
  public setWalletEnabled(enabled: boolean): void {
    this.setPreference('walletEnabled', enabled);
  }

  // ===========================================================================
  // Trust
  // ===========================================================================

  /**
   * Determines whether Trust notifications are enabled.
   */
  public isTrustEnabled(): boolean {
    return this.props.trustEnabled;
  }

  /**
   * Enables Trust notifications.
   */
  public enableTrust(): void {
    this.setPreference('trustEnabled', true);
  }

  /**
   * Disables Trust notifications.
   */
  public disableTrust(): void {
    this.setPreference('trustEnabled', false);
  }

  /**
   * Sets the Trust notification preference.
   */
  public setTrustEnabled(enabled: boolean): void {
    this.setPreference('trustEnabled', enabled);
  }

  // ===========================================================================
  // Verification
  // ===========================================================================

  /**
   * Determines whether Verification notifications are enabled.
   */
  public isVerificationEnabled(): boolean {
    return this.props.verificationEnabled;
  }

  /**
   * Enables Verification notifications.
   */
  public enableVerification(): void {
    this.setPreference('verificationEnabled', true);
  }

  /**
   * Disables Verification notifications.
   */
  public disableVerification(): void {
    this.setPreference('verificationEnabled', false);
  }

  /**
   * Sets the Verification notification preference.
   */
  public setVerificationEnabled(enabled: boolean): void {
    this.setPreference('verificationEnabled', enabled);
  }

  // ===========================================================================
  // Message
  // ===========================================================================

  /**
   * Determines whether Message notifications are enabled.
   */
  public isMessageEnabled(): boolean {
    return this.props.messageEnabled;
  }

  /**
   * Enables Message notifications.
   */
  public enableMessage(): void {
    this.setPreference('messageEnabled', true);
  }

  /**
   * Disables Message notifications.
   */
  public disableMessage(): void {
    this.setPreference('messageEnabled', false);
  }

  /**
   * Sets the Message notification preference.
   */
  public setMessageEnabled(enabled: boolean): void {
    this.setPreference('messageEnabled', enabled);
  }

  // ===========================================================================
  // Support
  // ===========================================================================

  /**
   * Determines whether Support notifications are enabled.
   */
  public isSupportEnabled(): boolean {
    return this.props.supportEnabled;
  }

  /**
   * Enables Support notifications.
   */
  public enableSupport(): void {
    this.setPreference('supportEnabled', true);
  }

  /**
   * Disables Support notifications.
   */
  public disableSupport(): void {
    this.setPreference('supportEnabled', false);
  }

  /**
   * Sets the Support notification preference.
   */
  public setSupportEnabled(enabled: boolean): void {
    this.setPreference('supportEnabled', enabled);
  }

  // ===========================================================================
  // System
  // ===========================================================================

  /**
   * Determines whether System notifications are enabled.
   */
  public isSystemEnabled(): boolean {
    return this.props.systemEnabled;
  }

  /**
   * Enables System notifications.
   */
  public enableSystem(): void {
    this.setPreference('systemEnabled', true);
  }

  /**
   * Disables System notifications.
   */
  public disableSystem(): void {
    this.setPreference('systemEnabled', false);
  }

  /**
   * Sets the System notification preference.
   */
  public setSystemEnabled(enabled: boolean): void {
    this.setPreference('systemEnabled', enabled);
  }

  // ===========================================================================
  // Bulk Operations
  // ===========================================================================

  /**
   * Enables all notification categories.
   */
  public enableAll(): void {
    this.props.journeyEnabled = true;
    this.props.bookingEnabled = true;
    this.props.paymentEnabled = true;
    this.props.walletEnabled = true;
    this.props.trustEnabled = true;
    this.props.verificationEnabled = true;
    this.props.messageEnabled = true;
    this.props.supportEnabled = true;
    this.props.systemEnabled = true;

    this.touch();

    this.validateInvariants();
  }

  /**
   * Disables all notification categories.
   */
  public disableAll(): void {
    this.props.journeyEnabled = false;
    this.props.bookingEnabled = false;
    this.props.paymentEnabled = false;
    this.props.walletEnabled = false;
    this.props.trustEnabled = false;
    this.props.verificationEnabled = false;
    this.props.messageEnabled = false;
    this.props.supportEnabled = false;
    this.props.systemEnabled = false;

    this.touch();

    this.validateInvariants();
  }

  // ===========================================================================
  // Preference Summary
  // ===========================================================================

  /**
   * Determines whether every notification category is enabled.
   */
  public areAllEnabled(): boolean {
    return (
      this.props.journeyEnabled &&
      this.props.bookingEnabled &&
      this.props.paymentEnabled &&
      this.props.walletEnabled &&
      this.props.trustEnabled &&
      this.props.verificationEnabled &&
      this.props.messageEnabled &&
      this.props.supportEnabled &&
      this.props.systemEnabled
    );
  }

  /**
   * Determines whether every notification category is disabled.
   */
  public areAllDisabled(): boolean {
    return (
      !this.props.journeyEnabled &&
      !this.props.bookingEnabled &&
      !this.props.paymentEnabled &&
      !this.props.walletEnabled &&
      !this.props.trustEnabled &&
      !this.props.verificationEnabled &&
      !this.props.messageEnabled &&
      !this.props.supportEnabled &&
      !this.props.systemEnabled
    );
  }

  /**
   * Determines whether at least one notification category is enabled.
   */
  public hasEnabledPreferences(): boolean {
    return (
      this.props.journeyEnabled ||
      this.props.bookingEnabled ||
      this.props.paymentEnabled ||
      this.props.walletEnabled ||
      this.props.trustEnabled ||
      this.props.verificationEnabled ||
      this.props.messageEnabled ||
      this.props.supportEnabled ||
      this.props.systemEnabled
    );
  }

  /**
   * Returns the number of enabled notification categories.
   */
  public enabledPreferenceCount(): number {
    let count = 0;

    if (this.props.journeyEnabled) {
      count += 1;
    }

    if (this.props.bookingEnabled) {
      count += 1;
    }

    if (this.props.paymentEnabled) {
      count += 1;
    }

    if (this.props.walletEnabled) {
      count += 1;
    }

    if (this.props.trustEnabled) {
      count += 1;
    }

    if (this.props.verificationEnabled) {
      count += 1;
    }

    if (this.props.messageEnabled) {
      count += 1;
    }

    if (this.props.supportEnabled) {
      count += 1;
    }

    if (this.props.systemEnabled) {
      count += 1;
    }

    return count;
  }

  /**
   * Returns the number of disabled notification categories.
   */
  public disabledPreferenceCount(): number {
    return 9 - this.enabledPreferenceCount();
  }

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  /**
   * Returns the creation timestamp.
   */
  public get createdAt(): Date {
    return NotificationPreferenceEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Returns the last-update timestamp.
   */
  public get updatedAt(): Date {
    return NotificationPreferenceEntity.cloneDate(this.props.updatedAt);
  }

  /**
   * Updates the persistence timestamp.
   *
   * This is not a business lifecycle transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    NotificationPreferenceEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = NotificationPreferenceEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new NotificationException(
        'Notification preference updated date cannot be before creation date.',
      );
    }

    if (timestamp.getTime() < this.props.updatedAt.getTime()) {
      throw new NotificationException(
        'Notification preference updated date cannot move backwards.',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Internal Preference Mutation
  // ===========================================================================

  /**
   * Changes one notification preference.
   *
   * The field name is deliberately restricted to the nine persistence-backed
   * preference properties.
   */
  private setPreference(
    preference:
      | 'journeyEnabled'
      | 'bookingEnabled'
      | 'paymentEnabled'
      | 'walletEnabled'
      | 'trustEnabled'
      | 'verificationEnabled'
      | 'messageEnabled'
      | 'supportEnabled'
      | 'systemEnabled',
    enabled: boolean,
  ): void {
    NotificationPreferenceEntity.ensureBoolean(enabled, preference);

    if (this.props[preference] === enabled) {
      return;
    }

    this.props[preference] = enabled;

    this.touch();

    this.validateInvariants();
  }

  // ===========================================================================
  // Invariants
  // ===========================================================================

  /**
   * Validates all Notification Preference entity-level invariants.
   */
  private validateInvariants(): void {
    NotificationPreferenceEntity.ensureMemberPublicId(
      this.props.memberPublicId,
    );

    NotificationPreferenceEntity.ensureBoolean(
      this.props.journeyEnabled,
      'journeyEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      this.props.bookingEnabled,
      'bookingEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      this.props.paymentEnabled,
      'paymentEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      this.props.walletEnabled,
      'walletEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      this.props.trustEnabled,
      'trustEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      this.props.verificationEnabled,
      'verificationEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      this.props.messageEnabled,
      'messageEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      this.props.supportEnabled,
      'supportEnabled',
    );

    NotificationPreferenceEntity.ensureBoolean(
      this.props.systemEnabled,
      'systemEnabled',
    );

    NotificationPreferenceEntity.ensureValidDate(
      this.props.createdAt,
      'creation date',
    );

    NotificationPreferenceEntity.ensureValidDate(
      this.props.updatedAt,
      'updated date',
    );

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new NotificationException(
        'Notification preference updated date cannot be before creation date.',
      );
    }
  }

  // ===========================================================================
  // Member Validation
  // ===========================================================================

  private static ensureMemberPublicId(
    memberPublicId: NotificationMemberPublicId,
  ): void {
    if (!(memberPublicId instanceof NotificationMemberPublicId)) {
      throw new NotificationException(
        'Notification preference member public ID is invalid.',
      );
    }
  }

  // ===========================================================================
  // Boolean Validation
  // ===========================================================================

  private static ensureBoolean(value: boolean, fieldName: string): void {
    if (typeof value !== 'boolean') {
      throw new NotificationException(
        `Notification preference ${fieldName} must be a boolean.`,
      );
    }
  }

  // ===========================================================================
  // Date Validation
  // ===========================================================================

  /**
   * Validates a Date.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new NotificationException(
        `Notification preference ${fieldName} must be a valid date.`,
      );
    }
  }

  // ===========================================================================
  // Date Clone
  // ===========================================================================

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    NotificationPreferenceEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
