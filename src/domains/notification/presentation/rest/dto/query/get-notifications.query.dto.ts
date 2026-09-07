// -----------------------------------------------------------------------------
// Notification — Get Notifications Query DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for retrieving all Notification aggregates.
//
// This query does not require any request parameters.
//
// The application query:
//
// GetNotificationsQuery
//
// is responsible for retrieving all notifications through:
//
// NotificationRepository.findAll()
//
// The DTO does NOT contain:
//
// - internal database identifiers;
// - notification public identifiers;
// - recipient filters;
// - status filters;
// - pagination parameters;
// - domain entities;
// - value objects;
// - authorization data.
//
// Filtering and specialized retrieval operations belong to dedicated queries,
// such as:
//
// - GetNotificationsByRecipientQuery
// - GetNotificationsByReferenceQuery
// - GetNotificationsByEventQuery
//
// -----------------------------------------------------------------------------

export class GetNotificationsQueryDto {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationsQueryDto;
