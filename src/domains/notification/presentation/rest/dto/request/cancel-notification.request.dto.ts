// -----------------------------------------------------------------------------
// Notification — Cancel Notification Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for cancelling a Notification.
//
// Physical-world action:
//
// - request that an existing Notification be cancelled.
//
// The Notification is identified by its route:
//
//   POST /notifications/:notificationPublicId/cancel
//
// The caller does NOT provide:
//
// - internal Notification ID;
// - Notification public ID in the request body;
// - notification status;
// - cancellation timestamp;
// - correlation ID;
// - causation ID.
//
// The application workflow establishes the cancellation timestamp and event
// correlation metadata.
//
// The Notification aggregate owns the cancellation lifecycle transition.
//
// -----------------------------------------------------------------------------
//
// This request intentionally has no body properties.
//
// -----------------------------------------------------------------------------

export class CancelNotificationRequestDto {}
