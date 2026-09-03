// -----------------------------------------------------------------------------
// Authentication — Record Authentication Failure Command
// -----------------------------------------------------------------------------
//
// Application command for recording a failed authentication attempt.
//
// The command represents the application-level intent:
//
//     Record Authentication Failure
//
// Credential verification must already have occurred before this command is
// dispatched. This command records the outcome; it does not determine whether
// credentials are valid.
//
// Password hashing and credential comparison belong to security infrastructure.
//
// Failure-count and lock-threshold policy belong to the authentication
// application/security workflow.
//
// -----------------------------------------------------------------------------
//
// Aggregate affected:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// -----------------------------------------------------------------------------
//
// Responsibilities of the command:
//
// - identify the Authentication aggregate;
// - carry the resulting failure count;
// - carry the failure timestamp;
// - carry the failure reason;
// - carry correlation/causation metadata.
//
// -----------------------------------------------------------------------------
//
// This command does NOT:
//
// - hash passwords;
// - compare passwords;
// - verify credentials;
// - load Identity;
// - validate Identity state;
// - decide whether Authentication should be locked;
// - perform the lock transition;
// - unlock Authentication;
// - create Sessions;
// - revoke Sessions;
// - create Devices;
// - create Recovery;
// - create OtpChallenges;
// - send notifications;
// - access Prisma;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Locking:
//
// Recording a failure and locking Authentication are separate operations.
//
// If the authentication policy determines that the failure threshold has been
// reached, the application workflow should subsequently execute:
//
//     LockAuthenticationCommand
//
// This keeps failure recording separate from lock-policy evaluation.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// - correlationId identifies the end-to-end authentication operation;
// - causationId optionally identifies the command or event that caused this
//   command.
//
// Both values are propagated to AuthenticationFailedEvent.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  AuthenticationFailureCount,
  AuthenticationFailureReason,
  AuthenticationLastFailedAt,
  AuthenticationPublicId,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for recording a failed authentication attempt.
 *
 * Required domain inputs:
 *
 * - authenticationPublicId;
 * - count;
 * - failedAt;
 * - reason;
 * - correlationId.
 *
 * Optional:
 *
 * - causationId.
 *
 * The following are intentionally NOT supplied:
 *
 * - AuthenticationStatus;
 * - passwordHash;
 * - passwordVersion;
 * - lock state;
 * - lockedAt;
 * - lockedUntil;
 * - lastAuthenticatedAt;
 * - persistence/internal ID.
 *
 * Authentication failure state is changed through
 * AuthenticationAggregate.recordAuthenticationFailure().
 */
export class RecordAuthenticationFailureCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identifier of the Authentication aggregate on which the failed
     * authentication attempt occurred.
     */
    public readonly authenticationPublicId: AuthenticationPublicId,

    /**
     * Failure count after the failed authentication attempt.
     *
     * The value is supplied by the application authentication workflow and
     * applied by the Authentication aggregate.
     */
    public readonly count: AuthenticationFailureCount,

    /**
     * Timestamp at which the authentication attempt failed.
     */
    public readonly failedAt: AuthenticationLastFailedAt,

    /**
     * Domain reason explaining why authentication failed.
     */
    public readonly reason: AuthenticationFailureReason,

    /**
     * Correlation identifier for the authentication operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RecordAuthenticationFailureCommand;
