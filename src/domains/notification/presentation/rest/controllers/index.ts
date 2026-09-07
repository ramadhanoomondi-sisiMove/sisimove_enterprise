// -----------------------------------------------------------------------------
// Notification — REST Controllers
// -----------------------------------------------------------------------------
//
// Barrel export for Notification HTTP controllers.
//
// Responsibilities:
//
// - expose all Notification REST controllers from one module;
// - provide a stable import boundary for the Notification module;
// - keep module imports independent from individual controller file paths.
//
// This file contains NO:
//
// - business rules;
// - application logic;
// - domain logic;
// - persistence logic.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Notification
// =============================================================================

export { NotificationsController } from './notifications.controller';

// =============================================================================
// Notification Preference
// =============================================================================

export { NotificationPreferencesController } from './notification-preferences.controller';
