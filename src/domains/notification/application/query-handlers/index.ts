// -----------------------------------------------------------------------------
// Notification — Query Handlers Index
// -----------------------------------------------------------------------------
//
// Public barrel export for Notification application query handlers.
//
// This file provides a single import surface for all Notification query
// handlers.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Notification
// -----------------------------------------------------------------------------

export { GetNotificationHandler } from './get-notification.handler';
export { GetNotificationsHandler } from './get-notifications.handler';
export { GetNotificationsByRecipientHandler } from './get-notifications-by-recipient.handler';
export { GetNotificationsByReferenceHandler } from './get-notifications-by-reference.handler';
export { GetNotificationsByEventHandler } from './get-notifications-by-event.handler';

// -----------------------------------------------------------------------------
// Notification — Deliveries
// -----------------------------------------------------------------------------

export { GetNotificationDeliveriesHandler } from './get-notification-deliveries.handler';
export { GetNotificationDeliveriesByNotificationHandler } from './get-notification-deliveries-by-notification.handler';

// -----------------------------------------------------------------------------
// Notification — Preferences
// -----------------------------------------------------------------------------

export { GetNotificationPreferenceHandler } from './get-notification-preference.handler';
export { GetNotificationPreferenceByMemberHandler } from './get-notification-preference-by-member.handler';