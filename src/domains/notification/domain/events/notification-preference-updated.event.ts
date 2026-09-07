// -----------------------------------------------------------------------------
// Notification Domain — Notification Preference Updated Event
// -----------------------------------------------------------------------------
//
// Domain event emitted when a NotificationPreferenceEntity is updated.
//
// Aggregate:
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// The complete preference state is included in the event payload so consumers
// do not need to reconstruct the aggregate from individual change events.
//
// -----------------------------------------------------------------------------

import { NotificationDomainEvent } from './notification-domain.event';

export class NotificationPreferenceUpdatedEvent extends NotificationDomainEvent {
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
    public readonly updatedAt: Date,
    correlationId?: string,
    causationId?: string,
  ) {
    super(
      preferenceId,
      'NotificationPreference',
      'NotificationPreferenceUpdated',
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
      updatedAt: new Date(this.updatedAt.getTime()),
    };
  }
}
