// -----------------------------------------------------------------------------
// Identity — Close Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for closing an Identity.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// TRANSPORT BOUNDARY
//
// Route:
//
//     PATCH /identities/:identityPublicId/close
//
// Request body:
//
//     {}
//
// The application layer establishes:
//
// - identityPublicId from the validated route parameter;
// - correlationId from the established request-correlation context;
// - causationId from the existing command/event context, when available.
//
// These application-owned values are not required in the HTTP request body.
//
// Expected lifecycle:
//
// PENDING   ───────► CLOSED
// ACTIVE    ───────► CLOSED
// SUSPENDED ───────► CLOSED
//
// CLOSED is terminal. Closing an already-closed Identity follows the
// idempotency policy enforced by IdentityAggregate.
//
// The application handler loads the IdentityAggregate, invokes:
//
//     identityAggregate.close(correlationId)
//
// and persists the aggregate.
//
// The aggregate determines closedAt and records IdentityClosedEvent when
// the lifecycle transition occurs.
//
// Closing an Identity does not directly close or mutate other aggregates.
// Authentication, sessions, verification, roles, notifications, and other
// concerns remain separate lifecycle boundaries.
//
// This DTO does NOT:
//
// - identify the aggregate independently of the route;
// - generate correlation or causation identifiers;
// - mutate IdentityEntity directly;
// - construct IdentityEntity or IdentityRoleEntity;
// - perform persistence;
// - determine closedAt;
// - delete the Identity record;
// - revoke authentication sessions directly;
// - delete authentication credentials;
// - remove role assignments;
// - delete verification records;
// - emit IdentityClosedEvent directly;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for closing an Identity.
 *
 * No request-body fields are required.
 *
 * The Identity is identified by the route parameter:
 *
 *     :identityPublicId
 *
 * Correlation and causation metadata are established at the
 * controller/application boundary.
 *
 * IdentityAggregate remains authoritative for lifecycle validation,
 * idempotency, closure timestamps and domain-event recording.
 */
export class CloseIdentityRequestDto {
  /**
   * This DTO intentionally contains no body properties.
   *
   * Keep the class so the controller can document the request body
   * consistently, if the existing controller uses a body DTO.
   */
}
