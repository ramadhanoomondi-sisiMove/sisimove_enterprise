// -----------------------------------------------------------------------------
// Notification — Queries Index
// -----------------------------------------------------------------------------
//
// Public barrel export for Notification application queries.
//
// This file provides a single import surface for all Notification queries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Notification
// -----------------------------------------------------------------------------

export { GetNotificationQuery } from './get-notification.query';
export { GetNotificationsQuery } from './get-notifications.query';
export { GetNotificationsByRecipientQuery } from './get-notifications-by-recipient.query';
export { GetNotificationsByReferenceQuery } from './get-notifications-by-reference.query';
export { GetNotificationsByEventQuery } from './get-notifications-by-event.query';

// -----------------------------------------------------------------------------
// Notification — Deliveries
// -----------------------------------------------------------------------------

export { GetNotificationDeliveriesQuery } from './get-notification-deliveries.query';
export { GetNotificationDeliveriesByNotificationQuery } from './get-notification-deliveries-by-notification.query';

// -----------------------------------------------------------------------------
// Notification — Preferences
// -----------------------------------------------------------------------------

export { GetNotificationPreferenceQuery } from './get-notification-preference.query';
export { GetNotificationPreferenceByMemberQuery } from './get-notification-preference-by-member.query';
