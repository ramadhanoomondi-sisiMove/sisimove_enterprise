// -----------------------------------------------------------------------------
// Notification Domain — Notification Preference Created Event
// -----------------------------------------------------------------------------
//
// Domain event emitted when a NotificationPreferenceAggregate is created.
//
// Aggregate:
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// Cross-domain reference:
// - memberPublicId references an Identity member.
// - Notification does not own the Identity entity.
//
// -----------------------------------------------------------------------------

import { NotificationDomainEvent } from './notification-domain.event';

export class NotificationPreferenceCreatedEvent extends NotificationDomainEvent {
  public constructor(
    preferenceId: string,
    public readonly publicId: string,
    public readonly memberPublicId: string,
    public readonly journeyEnabled: boolean,
    public readonly bookingEnabled: boolean,
    public readonly paymentEnabled: boolean,
    public readonly walletEnabled: boolean,
    public readonly trustEnabled: boolean,
    public readonly verificationEnabled: boolean,
    public readonly messageEnabled: boolean,
    public readonly supportEnabled: boolean,
    public readonly systemEnabled: boolean,
    public readonly createdAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      preferenceId,
      'NotificationPreference',
      'NotificationPreferenceCreated',
      correlationId,
      causationId,
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),
      publicId: this.publicId,
      memberPublicId: this.memberPublicId,
      journeyEnabled: this.journeyEnabled,
      bookingEnabled: this.bookingEnabled,
      paymentEnabled: this.paymentEnabled,
      walletEnabled: this.walletEnabled,
      trustEnabled: this.trustEnabled,
      verificationEnabled: this.verificationEnabled,
      messageEnabled: this.messageEnabled,
      supportEnabled: this.supportEnabled,
      systemEnabled: this.systemEnabled,
      createdAt: new Date(this.createdAt.getTime()),
    };
  }
}
