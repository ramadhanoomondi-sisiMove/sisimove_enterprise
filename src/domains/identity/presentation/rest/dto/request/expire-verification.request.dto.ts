// -----------------------------------------------------------------------------
// Verification — Expire Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for expiring a Verification aggregate.
//
// Aggregate:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// This DTO represents the transport-level intent to transition a VERIFIED
// Verification into the EXPIRED lifecycle state.
//
// IMPORTANT:
//
// Expiration is a Verification aggregate lifecycle operation.
//
// The authenticated Identity is established from the JWT security context:
//
//     req.user.sub
//
// The Verification aggregate is identified by the route.
//
// Therefore this request body intentionally contains NO fields.
//
// The DTO does NOT:
//
// - identify the Identity;
// - identify the Verification aggregate;
// - provide expiresAt;
// - provide expiredAt;
// - provide correlationId;
// - provide causationId;
// - provide Verification status;
// - provide Verification level;
// - provide VerificationRequest state;
// - construct entities;
// - mutate entities directly;
// - perform persistence;
// - emit domain events;
// - modify Identity;
// - modify Identity roles;
// - revoke authentication sessions;
// - send notifications;
// - perform external side effects.
//
// The application layer obtains:
//
// - the authenticated Identity from the security context;
// - the Verification public identifier from the route;
// - correlation/causation metadata from the application/infrastructure
//   context;
// - expiredAt from the application/domain clock.
//
// It then converts the transport intent into:
//
//     ExpireVerificationCommand
//
// and the command handler invokes:
//
//     verificationAggregate.expire(...)
//
// The aggregate remains responsible for all domain invariants and lifecycle
// transitions.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// VERIFIED ───────► EXPIRED
//
// EXPIRED is not directly terminal.
//
// An EXPIRED Verification may subsequently be renewed:
//
// EXPIRED ────────► PENDING
//
// through:
//
//     verificationAggregate.renew(...)
//
// -----------------------------------------------------------------------------
//
// Expiration semantics:
//
// `expiresAt` is the expiration timestamp previously established by the
// Verification aggregate.
//
// `expiredAt` is the timestamp at which the expiration transition is applied.
//
// Neither value is supplied by the caller.
//
// The application/domain layer determines the appropriate expiration time and
// validates that the Verification is eligible for expiration.
//
// -----------------------------------------------------------------------------
//
// Authorization:
//
// Expiration is a protected Verification lifecycle operation.
//
// Authentication and authorization are handled outside this DTO through the
// HTTP security/application boundaries.
//
// The DTO does not identify or impersonate the actor performing the operation.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// correlationId and causationId are application-level metadata.
//
// They are NOT caller input and therefore are not exposed through this REST
// DTO.
//
// The application/infrastructure layer is responsible for establishing and
// propagating them to commands and resulting domain events.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// expiredAt is established by the application/domain layer.
//
// The caller does not supply the expiration timestamp.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     POST /verifications/VRF-01K3R8Y7Q2/expire
//
//     Authorization: Bearer <access-token>
//
//     {}
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for expiring a Verification aggregate.
 *
 * The request body is intentionally empty.
 *
 * The authenticated Identity is established from the JWT security context.
 *
 * The Verification aggregate is established from the route parameter.
 *
 * System metadata and timestamps are established by the application/domain
 * layer.
 */
export class ExpireVerificationRequestDto {}
