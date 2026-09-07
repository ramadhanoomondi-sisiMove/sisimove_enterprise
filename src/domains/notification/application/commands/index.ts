// -----------------------------------------------------------------------------
// Notification — Application Commands
// -----------------------------------------------------------------------------
//
// Public exports for all Notification domain application commands.
//
// Command groups:
//
// Notification
// ├── Create
// ├── Send
// ├── Read
// ├── Fail
// └── Cancel
//
// Notification Delivery
// ├── Create
// ├── Send
// ├── Deliver
// ├── Fail
// └── Cancel
//
// Notification Preference
// ├── Create
// └── Update
//
// This index contains exports only.
// It contains no application logic, domain behavior, or business rules.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Notification Commands
// =============================================================================

export { CreateNotificationCommand } from './create-notification.command';

export { SendNotificationCommand } from './send-notification.command';

export { ReadNotificationCommand } from './read-notification.command';

export { FailNotificationCommand } from './fail-notification.command';

export { CancelNotificationCommand } from './cancel-notification.command';

// =============================================================================
// Notification Delivery Commands
// =============================================================================

export { CreateNotificationDeliveryCommand } from './create-notification-delivery.command';

export { SendNotificationDeliveryCommand } from './send-notification-delivery.command';

export { DeliverNotificationDeliveryCommand } from './deliver-notification-delivery.command';

export { FailNotificationDeliveryCommand } from './fail-notification-delivery.command';

export { CancelNotificationDeliveryCommand } from './cancel-notification-delivery.command';

// =============================================================================
// Notification Preference Commands
// =============================================================================

export { CreateNotificationPreferenceCommand } from './create-notification-preference.command';

export { UpdateNotificationPreferenceCommand } from './update-notification-preference.command';
