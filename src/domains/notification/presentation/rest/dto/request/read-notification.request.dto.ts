// -----------------------------------------------------------------------------
// Notification — Read Notification Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for marking a Notification as READ.
//
// Physical-world action:
//
// - request that an existing Notification be marked as READ.
//
// The Notification is identified by its route:
//
//   POST /notifications/:notificationPublicId/read
//
// The caller does NOT provide:
//
// - internal Notification ID;
// - Notification public ID in the request body;
// - notification status;
// - read timestamp;
// - correlation ID;
// - causation ID.
//
// The application workflow establishes the lifecycle timestamp and event
// correlation metadata.
//
// The domain aggregate owns the Notification lifecycle transition.
//
// -----------------------------------------------------------------------------
//
// This request intentionally has no body properties.
//
// -----------------------------------------------------------------------------

export class ReadNotificationRequestDto {}
