// -----------------------------------------------------------------------------
// Notification — Request DTOs
// -----------------------------------------------------------------------------
//
// Barrel export for Notification HTTP request DTOs.
//
// Responsibilities:
//
// - expose all Notification request DTOs from one module;
// - provide a stable import boundary for controllers;
// - keep controller imports independent from individual DTO file paths.
//
// This file contains NO:
//
// - validation rules;
// - business rules;
// - application logic;
// - domain logic;
// - persistence logic.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Notification
// =============================================================================

export { CreateNotificationRequestDto } from './create-notification.request.dto';

export { SendNotificationRequestDto } from './send-notification.request.dto';

export { ReadNotificationRequestDto } from './read-notification.request.dto';

export { FailNotificationRequestDto } from './fail-notification.request.dto';

export { CancelNotificationRequestDto } from './cancel-notification.request.dto';

// =============================================================================
// Notification Delivery
// =============================================================================

export { CreateNotificationDeliveryRequestDto } from './create-notification-delivery.request.dto';

export { SendNotificationDeliveryRequestDto } from './send-notification-delivery.request.dto';

export { DeliverNotificationDeliveryRequestDto } from './deliver-notification-delivery.request.dto';

export { FailNotificationDeliveryRequestDto } from './fail-notification-delivery.request.dto';

export { CancelNotificationDeliveryRequestDto } from './cancel-notification-delivery.request.dto';

// =============================================================================
// Notification Preference
// =============================================================================

export { CreateNotificationPreferenceRequestDto } from './create-notification-preference.request.dto';

export { UpdateNotificationPreferenceRequestDto } from './update-notification-preference.request.dto';
