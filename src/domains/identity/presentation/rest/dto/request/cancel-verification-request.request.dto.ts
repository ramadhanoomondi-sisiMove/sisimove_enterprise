// -----------------------------------------------------------------------------
// Verification Request — Cancel Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for cancelling a VerificationRequestEntity owned by a
// Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity
//
// This DTO represents the transport-level intent to cancel one pending
// VerificationRequest.
//
// IMPORTANT:
//
// The VerificationRequest being cancelled is identified by the route.
//
// The authenticated Identity is established from the JWT security context:
//
//     req.user.sub
//
// Therefore this request body intentionally contains NO fields.
//
// The DTO does NOT:
//
// - identify the applicant Identity;
// - identify the Verification aggregate;
// - identify the VerificationRequest;
// - provide the VerificationRequest status;
// - provide cancelledAt;
// - provide correlationId;
// - provide causationId;
// - provide persistence/internal identifiers;
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - cancel the VerificationRequestEntity directly;
// - cancel the Verification aggregate;
// - perform persistence;
// - emit domain events;
// - modify Identity;
// - modify Identity roles;
// - modify authentication;
// - perform asset-storage operations;
// - perform external verification-provider operations;
// - send notifications;
// - perform external side effects.
//
// The application layer obtains:
//
// - the authenticated Identity from the security context;
// - the VerificationRequest public identifier from the route;
// - correlation/causation metadata from the application/infrastructure
//   context;
// - cancelledAt from the application/domain clock.
//
// It then converts the transport intent into:
//
//     CancelVerificationRequestCommand
//
// and the command handler invokes:
//
//     verificationAggregate.cancelRequest(...)
//
// The aggregate remains responsible for all domain invariants and lifecycle
// transitions.
//
// -----------------------------------------------------------------------------
//
// Request lifecycle:
//
// PENDING ───────► CANCELLED
//
// CANCELLED is terminal.
//
// VerificationRequest does NOT expire.
//
// Expiration is not part of the VerificationRequest lifecycle and is not
// represented by this DTO.
//
// -----------------------------------------------------------------------------
//
// Important distinction:
//
// Cancelling a VerificationRequest does NOT:
//
// - cancel the Verification aggregate;
// - reject the Verification aggregate;
// - expire the Verification aggregate;
// - revoke the Verification aggregate;
// - modify Identity;
// - modify Identity roles;
// - modify authentication;
// - perform external side effects.
//
// The parent Verification aggregate remains governed by its own lifecycle.
//
// -----------------------------------------------------------------------------
//
// Request identity:
//
// The VerificationRequest public identifier belongs in the route rather than
// the request body.
//
// Example:
//
//     POST /verifications/VRF-01K3R8Y7Q2/requests/VRQ-01K3R8Y8N4/cancel
//
// The application layer converts the route primitive into the appropriate
// VerificationRequestPublicId value object.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// correlationId and causationId are application-level metadata.
//
// They are NOT applicant/reviewer input and therefore are not exposed through
// this REST DTO.
//
// The application/infrastructure layer is responsible for establishing and
// propagating them to commands and resulting domain events.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// cancelledAt is established by the application/domain layer.
//
// The caller does not supply the cancellation timestamp.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     POST /verifications/VRF-01K3R8Y7Q2/requests/VRQ-01K3R8Y8N4/cancel
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
 * REST request for cancelling a VerificationRequestEntity.
 *
 * The request body is intentionally empty.
 *
 * The authenticated Identity is established from the JWT security context.
 *
 * The VerificationRequest identity is established from the route parameter.
 *
 * System metadata and timestamps are established by the application/domain
 * layer.
 */
export class CancelVerificationRequestRequestDto {}
