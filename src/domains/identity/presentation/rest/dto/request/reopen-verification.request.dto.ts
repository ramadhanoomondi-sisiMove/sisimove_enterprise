// -----------------------------------------------------------------------------
// Identity — Reopen Verification Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for reopening a Verification aggregate.
//
// Aggregate:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// Reopening starts a new verification cycle for a previously unsuccessful or
// expired Verification.
//
// This request targets the Verification aggregate lifecycle.
//
// It is NOT:
//
// - creation of a new Verification aggregate;
// - creation of a VerificationRequest;
// - approval of a VerificationRequest;
// - granting MEMBER verification;
// - granting DRIVER verification.
//
// The application handler resolves the VerificationAggregate and invokes:
//
//     verificationAggregate.renew(...)
//
// The aggregate is responsible for:
//
// - validating the current Verification lifecycle state;
// - allowing reopening only from REJECTED or EXPIRED;
// - resetting the lifecycle state to PENDING;
// - resetting the verification level to NONE;
// - clearing current review state;
// - clearing current aggregate verification timestamps;
// - preserving historical VerificationRequest records;
// - enforcing aggregate invariants.
//
// This DTO intentionally contains no request properties.
//
// The Verification aggregate is identified by the route:
//
//     PATCH /verifications/:verificationPublicId/reopen
//
// The authenticated actor is resolved from the security context.
//
// Correlation, causation, and lifecycle timestamps are application/domain
// metadata and are not supplied by the HTTP client.
//
// This DTO does NOT:
//
// - mutate VerificationEntity directly;
// - mutate VerificationRequestEntity directly;
// - construct entities;
// - delete historical requests;
// - modify Identity;
// - assign Roles;
// - authenticate the Identity;
// - create sessions;
// - perform external verification-provider operations;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// REJECTED ───────► PENDING
//
// EXPIRED ────────► PENDING
//
// PENDING ─────────X
//
// VERIFIED ────────X
//
// REVOKED ─────────X
//
// REJECTED and EXPIRED are therefore recoverable lifecycle states.
//
// REVOKED remains terminal and cannot be reopened.
//
// -----------------------------------------------------------------------------
//
// Historical evidence:
//
// Reopening does not delete previous VerificationRequest records or historical
// evidence results.
//
// A subsequent verification cycle creates new VerificationRequest records
// through CreateVerificationRequestCommand.
//
// -----------------------------------------------------------------------------
//
// Security context:
//
// The authenticated actor is resolved from:
//
//     req.user.sub
//
// The client does not supply an Identity public identifier for the actor.
//
// -----------------------------------------------------------------------------
//
// Application metadata:
//
// The application layer is responsible for generating or propagating:
//
// - correlationId;
// - causationId;
//
// and for determining the effective reopen timestamp.
//
// These values are deliberately excluded from the REST request body.
//
// -----------------------------------------------------------------------------
//
// Example request:
//
//     PATCH /verifications/VER-01K3R8Y8M4/reopen
//
//     {}
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request for reopening a Verification aggregate.
 *
 * Represents the application-level intent to start a new Verification cycle
 * from the REJECTED or EXPIRED lifecycle state.
 *
 * The request body is intentionally empty.
 *
 * The Verification aggregate is identified by the route parameter:
 *
 *     :verificationPublicId
 *
 * The authenticated actor is resolved from the security context.
 *
 * Correlation metadata, causation metadata, and lifecycle timestamps are
 * established by the application/domain boundaries.
 *
 * The following values are intentionally NOT supplied by the client:
 *
 * - verificationPublicId;
 * - identityPublicId;
 * - reopenedByPublicId;
 * - correlationId;
 * - causationId;
 * - reopenedAt;
 * - Verification status;
 * - Verification level;
 * - historical VerificationRequest records;
 * - VerificationRequest evidence;
 * - domain events;
 * - persistence/internal identifiers.
 */
export class ReopenVerificationRequestDto {}
