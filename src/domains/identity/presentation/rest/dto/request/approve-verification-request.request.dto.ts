// -----------------------------------------------------------------------------
// Verification Request — Approve Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for approving a VerificationRequestEntity owned by a
// Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity
//
// This DTO represents the transport-level intent to approve one submitted
// verification request.
//
// IMPORTANT:
//
// Approval is a reviewer operation.
//
// The authenticated reviewer Identity is established from the JWT security
// context:
//
//     req.user.sub
//
// The VerificationRequest being approved is identified by the route parameter.
//
// Therefore this request body intentionally contains NO fields.
//
// The DTO does NOT:
//
// - identify the applicant Identity;
// - identify the reviewer Identity;
// - identify the Verification aggregate;
// - identify the VerificationRequest;
// - provide approval status;
// - provide reviewedAt;
// - provide correlationId;
// - provide causationId;
// - provide verification level;
// - provide verification evidence;
// - provide persistence/internal identifiers;
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - approve the VerificationRequestEntity directly;
// - approve the Verification aggregate directly;
// - perform persistence;
// - emit domain events;
// - modify Identity;
// - modify Identity roles;
// - perform asset-storage operations;
// - perform external verification-provider operations;
// - send notifications;
// - perform external side effects.
//
// The application layer obtains:
//
// - the authenticated reviewer Identity from the security context;
// - the VerificationRequest public identifier from the route;
// - correlation/causation metadata from the application/infrastructure context;
// - reviewedAt from the application/domain clock.
//
// It then converts the transport intent into:
//
//     ApproveVerificationRequestCommand
//
// and the command handler invokes the appropriate domain behavior:
//
//     verificationAggregate.approveRequest(...)
//
// The aggregate remains responsible for all domain invariants and lifecycle
// transitions.
//
// -----------------------------------------------------------------------------
//
// Request lifecycle:
//
// PENDING ───────► APPROVED
//
// APPROVED is terminal.
//
// Only a currently reviewable PENDING request may be approved.
//
// A VerificationRequest does NOT expire.
//
// Expiration is not part of the VerificationRequest lifecycle and is not
// represented by this DTO.
//
// -----------------------------------------------------------------------------
//
// Verification lifecycle:
//
// Approval of a request may cause the parent Verification aggregate to
// advance:
//
// PENDING ───────► VERIFIED
//
// The aggregate determines whether the approved evidence satisfies the
// configured verification requirements.
//
// If the Verification aggregate has an expiration policy, that expiration
// belongs to the Verification lifecycle and is not supplied through this
// VerificationRequest approval request.
//
// -----------------------------------------------------------------------------
//
// Reviewer:
//
// The reviewer is the authenticated Identity represented by:
//
//     req.user.sub
//
// The client must NOT submit reviewedByPublicId.
//
// This prevents a caller from claiming to be another reviewer.
//
// Authorization is enforced by the HTTP security layer and permission guard.
//
// -----------------------------------------------------------------------------
//
// Verification Request:
//
// The VerificationRequest public identifier should be supplied through the
// route rather than the request body.
//
// Example:
//
//     POST /verifications/VRF-01K3R8Y7Q2/requests/VRQ-01K3R8Y9P6/approve
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
// reviewedAt is established by the application/domain layer.
//
// The reviewer does not supply the approval timestamp.
//
// -----------------------------------------------------------------------------
//
// Example:
//
//     POST /verifications/VRF-01K3R8Y7Q2/requests/VRQ-01K3R8Y9P6/approve
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
 * REST request for approving a VerificationRequestEntity.
 *
 * The request body is intentionally empty.
 *
 * Reviewer identity comes from the authenticated JWT security context.
 *
 * The VerificationRequest identity comes from the route parameter.
 *
 * System metadata and timestamps are established by the application/domain
 * layer.
 */
export class ApproveVerificationRequestRequestDto {}
