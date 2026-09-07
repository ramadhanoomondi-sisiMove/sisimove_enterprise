// -----------------------------------------------------------------------------
// Notification Domain — Exceptions
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Root Exception
// -----------------------------------------------------------------------------

export { NotificationException } from './notification.exception';

// -----------------------------------------------------------------------------
// Notification Exceptions
// -----------------------------------------------------------------------------

export { NotificationNotFoundException } from './notification-not-found.exception';
export { NotificationInvalidStatusException } from './notification-invalid-status.exception';
export { NotificationTitleEmptyException } from './notification-title-empty.exception';
export { NotificationBodyEmptyException } from './notification-body-empty.exception';

// -----------------------------------------------------------------------------
// Notification Delivery Exceptions
// -----------------------------------------------------------------------------

export { NotificationDeliveryNotFoundException } from './notification-delivery-not-found.exception';
export { NotificationDeliveryInvalidStatusException } from './notification-delivery-invalid-status.exception';
export { NotificationDeliveryChannelAlreadyExistsException } from './notification-delivery-channel-already-exists.exception';

// -----------------------------------------------------------------------------
// Notification Preference Exceptions
// -----------------------------------------------------------------------------

export { NotificationPreferenceNotFoundException } from './notification-preference-not-found.exception';
export { NotificationPreferenceAlreadyExistsException } from './notification-preference-already-exists.exception';
export { NotificationPreferenceInvalidMemberException } from './notification-preference-invalid-member.exception';
