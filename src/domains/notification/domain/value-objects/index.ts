// -----------------------------------------------------------------------------
// Notification Domain — Value Objects
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Notification
// -----------------------------------------------------------------------------

export { NotificationPublicId } from './notification-public-id.vo';
export type { NotificationTypeValue } from './notification-type.vo';
export { NotificationType } from './notification-type.vo';

export type { NotificationPriorityValue } from './notification-priority.vo';
export { NotificationPriority } from './notification-priority.vo';

export type { NotificationStatusValue } from './notification-status.vo';
export { NotificationStatus } from './notification-status.vo';

export { NotificationTitle } from './notification-title.vo';
export { NotificationBody } from './notification-body.vo';

// -----------------------------------------------------------------------------
// Notification Delivery
// -----------------------------------------------------------------------------

export { NotificationDeliveryPublicId } from './notification-delivery-public-id.vo';

export type { NotificationChannelValue } from './notification-channel.vo';
export { NotificationChannel } from './notification-channel.vo';

export type { NotificationDeliveryStatusValue } from './notification-delivery-status.vo';
export { NotificationDeliveryStatus } from './notification-delivery-status.vo';

export { NotificationProviderReference } from './notification-provider-reference.vo';
export { NotificationFailureReason } from './notification-failure-reason.vo';

// -----------------------------------------------------------------------------
// Notification Preference
// -----------------------------------------------------------------------------

export { NotificationPreferencePublicId } from './notification-preference-public-id.vo';
export { NotificationMemberPublicId } from './notification-member-public-id.vo';

// -----------------------------------------------------------------------------
// Cross-domain References
// -----------------------------------------------------------------------------

export { NotificationReferenceType } from './notification-reference-type.vo';
export { NotificationReferencePublicId } from './notification-reference-public-id.vo';

export { NotificationEventType } from './notification-event-type.vo';
export { NotificationEventPublicId } from './notification-event-public-id.vo';
