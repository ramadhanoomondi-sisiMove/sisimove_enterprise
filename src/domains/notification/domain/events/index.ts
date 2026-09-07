// -----------------------------------------------------------------------------
// Notification Domain — Domain Events
// -----------------------------------------------------------------------------
//
// Exports all Notification domain events.
//
// Aggregates:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Base Event
// -----------------------------------------------------------------------------

export { NotificationDomainEvent } from './notification-domain.event';

// -----------------------------------------------------------------------------
// Notification Events
// -----------------------------------------------------------------------------

export { NotificationCreatedEvent } from './notification-created.event';
export { NotificationSentEvent } from './notification-sent.event';
export { NotificationReadEvent } from './notification-read.event';
export { NotificationFailedEvent } from './notification-failed.event';
export { NotificationCancelledEvent } from './notification-cancelled.event';

// -----------------------------------------------------------------------------
// Notification Delivery Events
// -----------------------------------------------------------------------------

export { NotificationDeliveryCreatedEvent } from './notification-delivery-created.event';
export { NotificationDeliverySentEvent } from './notification-delivery-sent.event';
export { NotificationDeliveryDeliveredEvent } from './notification-delivery-delivered.event';
export { NotificationDeliveryFailedEvent } from './notification-delivery-failed.event';
export { NotificationDeliveryCancelledEvent } from './notification-delivery-cancelled.event';

// -----------------------------------------------------------------------------
// Notification Preference Events
// -----------------------------------------------------------------------------

export { NotificationPreferenceCreatedEvent } from './notification-preference-created.event';
export { NotificationPreferenceUpdatedEvent } from './notification-preference-updated.event';
