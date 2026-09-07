// -----------------------------------------------------------------------------
// Notification — Application DI Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Notification application layer.
//
// Covers:
//
// - repositories;
// - command handlers;
// - query handlers.
//
// Aggregate boundaries:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// IMPORTANT:
//
// Notification is responsible for:
//
// - notification lifecycle;
// - notification delivery lifecycle;
// - notification preference lifecycle;
// - notification domain event recording.
//
// Repository implementations are provided by infrastructure.
//
// The application layer depends only on repository abstractions and MUST NOT
// import concrete persistence implementations directly.
//
// Concrete infrastructure implementations are bound to these tokens by the
// infrastructure dependency-injection layer.
//
// External notification providers such as Push, Email, and SMS are NOT
// represented here unless they are explicitly introduced as application
// ports. Provider communication belongs outside the domain layer.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Notification Tokens
// =============================================================================

export const NOTIFICATION_TOKENS = {
  // ===========================================================================
  // Repositories
  // ===========================================================================

  REPOSITORIES: {
    // =========================================================================
    // Notification
    // =========================================================================

    /**
     * Notification aggregate repository.
     *
     * Infrastructure provides the concrete persistence implementation.
     */
    NOTIFICATION: Symbol('NotificationRepository'),

    /**
     * Notification Preference aggregate repository.
     *
     * Infrastructure provides the concrete persistence implementation.
     */
    NOTIFICATION_PREFERENCE: Symbol('NotificationPreferenceRepository'),
  } as const,

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // =========================================================================
    // Notification
    // =========================================================================

    /**
     * Creates a Notification aggregate.
     */
    CREATE_NOTIFICATION: Symbol('CreateNotificationHandler'),

    /**
     * Sends a Notification.
     */
    SEND_NOTIFICATION: Symbol('SendNotificationHandler'),

    /**
     * Marks a Notification as read.
     */
    READ_NOTIFICATION: Symbol('ReadNotificationHandler'),

    /**
     * Marks a Notification as failed.
     */
    FAIL_NOTIFICATION: Symbol('FailNotificationHandler'),

    /**
     * Cancels a Notification.
     */
    CANCEL_NOTIFICATION: Symbol('CancelNotificationHandler'),

    // =========================================================================
    // Notification Delivery
    // =========================================================================

    /**
     * Creates a Notification Delivery.
     */
    CREATE_NOTIFICATION_DELIVERY: Symbol('CreateNotificationDeliveryHandler'),

    /**
     * Sends a Notification Delivery through its application workflow.
     */
    SEND_NOTIFICATION_DELIVERY: Symbol('SendNotificationDeliveryHandler'),

    /**
     * Marks a Notification Delivery as delivered.
     */
    DELIVER_NOTIFICATION_DELIVERY: Symbol('DeliverNotificationDeliveryHandler'),

    /**
     * Marks a Notification Delivery as failed.
     */
    FAIL_NOTIFICATION_DELIVERY: Symbol('FailNotificationDeliveryHandler'),

    /**
     * Cancels a Notification Delivery.
     */
    CANCEL_NOTIFICATION_DELIVERY: Symbol('CancelNotificationDeliveryHandler'),

    // =========================================================================
    // Notification Preference
    // =========================================================================

    /**
     * Creates Notification Preferences for a member.
     */
    CREATE_NOTIFICATION_PREFERENCE: Symbol(
      'CreateNotificationPreferenceHandler',
    ),

    /**
     * Updates Notification Preferences for a member.
     */
    UPDATE_NOTIFICATION_PREFERENCE: Symbol(
      'UpdateNotificationPreferenceHandler',
    ),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // =========================================================================
    // Notification
    // =========================================================================

    /**
     * Retrieves a Notification by public ID.
     */
    GET_NOTIFICATION: Symbol('GetNotificationHandler'),

    /**
     * Retrieves Notifications using general query criteria.
     */
    GET_NOTIFICATIONS: Symbol('GetNotificationsHandler'),

    /**
     * Retrieves Notifications belonging to a recipient.
     */
    GET_NOTIFICATIONS_BY_RECIPIENT: Symbol(
      'GetNotificationsByRecipientHandler',
    ),

    /**
     * Retrieves Notifications associated with a reference.
     */
    GET_NOTIFICATIONS_BY_REFERENCE: Symbol(
      'GetNotificationsByReferenceHandler',
    ),

    /**
     * Retrieves Notifications associated with a source event.
     */
    GET_NOTIFICATIONS_BY_EVENT: Symbol('GetNotificationsByEventHandler'),

    // =========================================================================
    // Notification Delivery
    // =========================================================================

    /**
     * Retrieves Notification Deliveries using general query criteria.
     */
    GET_NOTIFICATION_DELIVERIES: Symbol('GetNotificationDeliveriesHandler'),

    /**
     * Retrieves Notification Deliveries belonging to a Notification.
     */
    GET_NOTIFICATION_DELIVERIES_BY_NOTIFICATION: Symbol(
      'GetNotificationDeliveriesByNotificationHandler',
    ),

    // =========================================================================
    // Notification Preference
    // =========================================================================

    /**
     * Retrieves Notification Preferences by public ID.
     */
    GET_NOTIFICATION_PREFERENCE: Symbol('GetNotificationPreferenceHandler'),

    /**
     * Retrieves Notification Preferences belonging to a member.
     */
    GET_NOTIFICATION_PREFERENCE_BY_MEMBER: Symbol(
      'GetNotificationPreferenceByMemberHandler',
    ),
  } as const,
} as const;

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default NOTIFICATION_TOKENS;
