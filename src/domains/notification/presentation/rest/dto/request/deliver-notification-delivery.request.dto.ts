// -----------------------------------------------------------------------------
// Notification — Deliver Notification Delivery Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for marking a Notification Delivery as DELIVERED.
//
// Physical-world action:
//
// - request that a previously-sent Notification Delivery be marked as
//   DELIVERED.
//
// The delivery is identified by the route:
//
//   POST /notifications/:notificationPublicId/deliveries/:deliveryPublicId/deliver
//
// The caller does NOT provide:
//
// - internal Notification ID;
// - internal Notification Delivery ID;
// - Notification public ID in the request body;
// - Notification Delivery public ID in the request body;
// - delivery status;
// - delivery timestamp;
// - provider reference;
// - correlation ID;
// - causation ID.
//
// The application workflow establishes the delivery timestamp and event
// correlation metadata.
//
// The NotificationDeliveryEntity owns the delivery lifecycle transition,
// while the NotificationAggregate coordinates the transition and records the
// resulting domain event.
//
// -----------------------------------------------------------------------------
//
// This request intentionally has no body properties.
//
// -----------------------------------------------------------------------------

export class DeliverNotificationDeliveryRequestDto {}