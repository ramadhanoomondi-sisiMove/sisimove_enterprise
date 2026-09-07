// -----------------------------------------------------------------------------
// Notification — Send Notification Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for sending a Notification.
//
// Physical-world action:
//
// - request that an existing Notification be marked as SENT.
//
// The Notification is identified by its route:
//
//   POST /notifications/:notificationPublicId/send
//
// The caller does NOT provide:
//
// - internal Notification ID;
// - Notification public ID in the request body;
// - notification status;
// - sent timestamp;
// - correlation ID;
// - causation ID;
// - delivery state;
// - provider reference.
//
// The application workflow establishes correlation/causation metadata and
// invokes the Notification aggregate's send() operation.
//
// Provider communication remains outside the domain aggregate.
//
// -----------------------------------------------------------------------------
//
// This request intentionally has no body properties.
//
// -----------------------------------------------------------------------------

export class SendNotificationRequestDto {}
