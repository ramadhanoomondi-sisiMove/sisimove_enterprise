// -----------------------------------------------------------------------------
// Notification — Get Notification Deliveries Query DTO
// -----------------------------------------------------------------------------
//
// HTTP request DTO for retrieving the deliveries belonging to a Notification
// aggregate.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationDeliveryEntity is a child entity and is NOT an independent
// aggregate.
//
// The Notification public identifier is supplied through the route:
//
//   GET /notifications/:notificationPublicId/deliveries
//
// The controller converts that route primitive into:
//
//   NotificationPublicId
//
// and passes it to:
//
//   GetNotificationDeliveriesQuery
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - define the HTTP request contract for the deliveries query;
// - provide a stable DTO type for the controller boundary.
//
// This DTO intentionally contains NO properties because the query input is
// supplied through the route parameter rather than the request body or query
// string.
//
// -----------------------------------------------------------------------------
//
// This DTO contains NO:
//
// - NotificationPublicId value object;
// - application query;
// - validation rules;
// - business rules;
// - domain logic;
// - persistence logic;
// - authorization logic.
//
// -----------------------------------------------------------------------------

// =============================================================================
// DTO
// =============================================================================

export class GetNotificationDeliveriesQueryDto {
  // Intentionally empty.
  //
  // The Notification aggregate public identifier is provided by the route:
  //
  //   :notificationPublicId
  //
  // The controller is responsible for converting the route primitive into
  // NotificationPublicId before constructing GetNotificationDeliveriesQuery.
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationDeliveriesQueryDto;
