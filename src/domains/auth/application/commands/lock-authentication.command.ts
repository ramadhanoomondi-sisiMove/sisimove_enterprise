// -----------------------------------------------------------------------------
// Authentication — Lock Command
// -----------------------------------------------------------------------------
//
// Application command for locking an Authentication aggregate.
//
// The command represents the application-level intent:
//
//     Lock Authentication
//
// Authentication locking is a lifecycle/security transition:
//
//     ACTIVE → LOCKED
//
// The command carries the domain-ready values required to establish the lock
// state.
//
// The command handler is responsible for:
//
// - loading the Authentication aggregate;
// - supplying the lock timestamps and reason;
// - invoking AuthenticationAggregate.lock();
// - persisting the updated aggregate;
// - dispatching the resulting AuthenticationLockedEvent.
//
// Aggregate affected:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// The aggregate is responsible for:
//
// - transitioning AuthenticationStatus to LOCKED;
// - storing the lock timestamp;
// - storing the optional lock expiration timestamp;
// - retaining the optional failure/lock reason;
// - enforcing domain invariants;
// - recording AuthenticationLockedEvent.
//
// Lock-threshold policy remains outside the aggregate. For example, the
// application layer or authentication policy determines:
//
// - whether the number of failed attempts requires locking;
// - whether the lock is temporary or indefinite;
// - how long a temporary lock should remain active.
//
// This command does NOT:
//
// - verify credentials;
// - compare passwords;
// - calculate failed authentication thresholds;
// - determine lock duration;
// - increment failed authentication counts;
// - unlock Authentication;
// - create a Session;
// - revoke Sessions;
// - create a Device;
// - perform Identity domain validation;
// - send notifications;
// - perform external side effects.
//
// Those concerns belong to their respective application workflows,
// infrastructure services, policies, and aggregate boundaries.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// - correlationId identifies the end-to-end business operation;
// - causationId optionally identifies the command or domain event that caused
//   this command.
//
// Both values are application-level metadata and are propagated to
// AuthenticationLockedEvent.
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
  AuthenticationFailureReason,
  AuthenticationLockedAt,
  AuthenticationLockedUntil,
  AuthenticationPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for locking an Authentication aggregate.
 *
 * Required domain inputs:
 *
 * - authenticationPublicId;
// - lockedAt;
// - correlationId.
 *
 * Optional domain inputs:
 *
 * - lockedUntil;
// - reason;
// - causationId.
 *
 * The following are intentionally NOT supplied:
 *
 * - AuthenticationStatus;
// - passwordHash;
// - passwordVersion;
// - failedAuthenticationCount;
// - lastFailedAuthenticationAt;
// - lastAuthenticatedAt;
// - persistence/internal ID;
// - lifecycle timestamps.
 *
 * AuthenticationStatus is transitioned by the aggregate through
 * AuthenticationAggregate.lock().
 *
 * Lock-threshold evaluation and lock-duration policy are performed outside
 * this command and aggregate.
 */
export class LockAuthenticationCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identifier of the Authentication aggregate to lock.
     *
     * The command handler uses this value to load the aggregate before invoking
     * AuthenticationAggregate.lock().
     */
    public readonly authenticationPublicId: AuthenticationPublicId,

    /**
     * Timestamp at which the Authentication is locked.
     */
    public readonly lockedAt: AuthenticationLockedAt,

    /**
     * Optional timestamp until which the Authentication remains locked.
     *
     * When undefined, the lock may be treated as indefinite until explicitly
     * unlocked.
     */
    public readonly lockedUntil: AuthenticationLockedUntil | undefined,

    /**
     * Optional reason explaining why the Authentication was locked.
     *
     * Examples include:
     *
     * - TOO_MANY_ATTEMPTS;
     * - ACCOUNT_LOCKED;
     * - RATE_LIMITED.
     */
    public readonly reason: AuthenticationFailureReason | undefined,

    /**
     * Correlation identifier for the authentication-lock operation.
     *
     * This value is propagated to AuthenticationLockedEvent.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * command.
     *
     * This value is propagated to the resulting domain event when supplied.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
