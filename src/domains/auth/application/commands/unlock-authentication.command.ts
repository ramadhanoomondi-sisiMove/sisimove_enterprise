// -----------------------------------------------------------------------------
// Authentication — Unlock Command
// -----------------------------------------------------------------------------
//
// Application command for unlocking an Authentication aggregate.
//
// The command represents the application-level intent:
//
//     Unlock Authentication
//
// Authentication unlocking is a lifecycle/security transition:
//
//     LOCKED → ACTIVE
//
// The command carries the public identifier required to locate the
// Authentication aggregate.
//
// The command handler is responsible for:
//
// - loading the Authentication aggregate;
// - invoking AuthenticationAggregate.unlock();
// - persisting the updated aggregate;
// - dispatching the resulting AuthenticationUnlockedEvent.
//
// Aggregate affected:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// The aggregate is responsible for:
//
// - validating whether the Authentication is currently locked;
// - transitioning AuthenticationStatus from LOCKED to ACTIVE;
// - clearing the lock state;
// - enforcing domain invariants;
// - recording AuthenticationUnlockedEvent.
//
// This command does NOT:
//
// - validate credentials;
// - hash or compare passwords;
// - determine lock thresholds;
// - determine lock duration;
// - create a Session;
// - create a Device;
// - validate OTPs;
// - perform Identity domain validation;
// - create Recovery records;
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
// AuthenticationUnlockedEvent.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { AuthenticationPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for unlocking an Authentication aggregate.
 *
 * Required domain inputs:
 *
 * - authenticationPublicId;
// - correlationId.
 *
 * The following are intentionally NOT supplied:
 *
 * - AuthenticationStatus;
// - lockedAt;
// - lockedUntil;
// - lockReason;
// - passwordHash;
// - passwordVersion;
// - failedAuthenticationCount;
// - lastFailedAuthenticationAt;
// - lastAuthenticatedAt;
// - persistence/internal ID;
// - lifecycle timestamps.
 *
 * Lock state is cleared by the Authentication aggregate through
 * AuthenticationAggregate.unlock().
 */
export class UnlockAuthenticationCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identifier of the Authentication aggregate to unlock.
     *
     * The command handler uses this value to load the aggregate before invoking
     * AuthenticationAggregate.unlock().
     */
    public readonly authenticationPublicId: AuthenticationPublicId,

    /**
     * Correlation identifier for the authentication-unlock operation.
     *
     * This value is propagated to AuthenticationUnlockedEvent.
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
