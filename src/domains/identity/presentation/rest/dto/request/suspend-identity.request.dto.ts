
// -----------------------------------------------------------------------------
// Identity — Suspend Identity Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for suspending an Identity aggregate.
//
// Route:
//
//     PATCH /identities/:identityPublicId/suspend
//
// Request body:
//
//     {}
//
// TRANSPORT BOUNDARY
//
// The application layer establishes:
//
// - identityPublicId from the validated route parameter;
// - correlationId from the established request-correlation context;
// - causationId from the existing command/event context, when available.
//
// These application-owned values are not required in the HTTP request body.
//
// The application handler maps the request to:
//
//     SuspendIdentityCommand
//
// It loads the IdentityAggregate, invokes:
//
//     identityAggregate.suspend(correlationId)
//
// and persists the aggregate.
//
// The aggregate determines suspendedAt and records the resulting
// IdentitySuspendedEvent when the lifecycle transition occurs.
//
// The DTO does NOT:
//
// - identify the aggregate independently of the route;
// - generate correlation or causation identifiers;
// - resolve the Identity;
// - perform lifecycle validation;
// - determine suspendedAt;
// - mutate IdentityEntity directly;
// - revoke authentication credentials;
// - terminate sessions;
// - revoke verification;
// - perform persistence;
// - emit domain events directly;
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
 * REST request for suspending an Identity aggregate.
 *
 * This DTO intentionally contains no request-body properties.
 *
 * The Identity is identified by the route parameter:
 *
 *     :identityPublicId
 *
 * Correlation and causation metadata are established at the
 * controller/application boundary.
 *
 * IdentityAggregate remains authoritative for lifecycle validation,
 * suspension timestamps and domain-event recording.
 */
export class SuspendIdentityRequestDto {
  /**
   * No body properties are required for this operation.
   *
   * Retain this class if the existing controller uses a request DTO
   * for lifecycle endpoints. Otherwise, the controller may omit @Body()
   * for this endpoint.
   */
}
