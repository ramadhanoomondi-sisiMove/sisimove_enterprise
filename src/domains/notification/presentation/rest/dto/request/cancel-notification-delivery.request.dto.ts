// -----------------------------------------------------------------------------
// Notification — Cancel Notification Delivery Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for cancelling a Notification Delivery.
//
// Physical-world action:
//
// - request that a pending Notification Delivery be cancelled.
//
// The delivery is identified by the route:
//
//   POST /notifications/:notificationPublicId/deliveries/:deliveryPublicId/cancel
//
// The caller does NOT provide:
//
// - internal Notification ID;
// - internal Notification Delivery ID;
// - Notification public ID in the request body;
// - Notification Delivery public ID in the request body;
// - delivery status;
// - cancellation timestamp;
// - provider reference;
// - failure reason;
// - correlation ID;
// - causation ID.
//
// The application workflow establishes the cancellation timestamp and event
// correlation metadata.
//
// The NotificationAggregate owns the aggregate-level operation and delegates
// the delivery lifecycle transition to NotificationDeliveryEntity.
//
// -----------------------------------------------------------------------------
//
// This request intentionally has no body properties.
//
// -----------------------------------------------------------------------------

export class CancelNotificationDeliveryRequestDto {}
