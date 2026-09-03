// -----------------------------------------------------------------------------
// Identity — Reopen Verification Command
// -----------------------------------------------------------------------------
//
// Application command for reopening a Verification aggregate.
//
// Reopening starts a new verification cycle for a previously unsuccessful or
// expired verification.
//
// This command targets the Verification aggregate lifecycle.
//
// It is NOT:
// - creation of a new Verification aggregate;
// - creation of a VerificationRequest;
// - approval of a VerificationRequest;
// - granting MEMBER verification;
// - granting DRIVER verification.
//
// The application handler loads the VerificationAggregate and invokes:
//
//     verificationAggregate.renew(...)
//
// The aggregate is responsible for:
//
// - validating the current Verification lifecycle state;
// - allowing reopening only from REJECTED or EXPIRED;
// - resetting the current Verification lifecycle to PENDING;
// - resetting the current verification level to NONE;
// - clearing current review state;
// - clearing current aggregate verification timestamps;
// - preserving historical VerificationRequest records;
// - enforcing aggregate invariants.
//
// The command does NOT:
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
// Correlation:
//
// `correlationId` identifies the application operation.
//
// `causationId`, when supplied, identifies the command, event, or operation
// that caused the reopen request.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// `reopenedAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Identity Value Objects
// -----------------------------------------------------------------------------

import type { VerificationPublicId } from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for reopening a Verification aggregate.
 *
 * Reopening starts a new verification cycle from either REJECTED or EXPIRED.
 *
 * It intentionally does not grant any verification level. The reopened
 * Verification returns to:
 *
 *     status = PENDING
 *     level  = NONE
 *
 * New evidence is submitted separately through Verification Requests.
 */
export class ReopenVerificationCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Verification aggregate to reopen.
     *
     * This is the application-facing aggregate identifier and is used by the
     * application layer to resolve the VerificationAggregate.
     */
    public readonly verificationPublicId: VerificationPublicId,

    /**
     * Correlation identifier for the command execution.
     */
    public readonly correlationId: string,

    /**
     * Optional timestamp at which the new verification cycle is opened.
     *
     * When omitted, the application handler/aggregate uses the current time.
     */
    public readonly reopenedAt?: Date,

    /**
     * Optional identifier of the command, event, or operation that caused
     * this reopen request.
     */
    public readonly causationId?: string,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ReopenVerificationCommand;
