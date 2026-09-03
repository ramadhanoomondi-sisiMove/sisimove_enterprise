// -----------------------------------------------------------------------------
// Authentication — Disable Command
// -----------------------------------------------------------------------------
//
// Application command for disabling an Authentication aggregate.
//
// The command represents the application-level intent:
//
//     Disable Authentication
//
// Authentication disabling is a lifecycle/security transition:
//
//     PENDING / ACTIVE / LOCKED → DISABLED
//
// The command carries the public identifier required to locate the
// Authentication aggregate and an optional domain reason.
//
// The command handler is responsible for:
//
// - loading the Authentication aggregate;
// - invoking AuthenticationAggregate.disable();
// - persisting the updated aggregate;
// - dispatching the resulting AuthenticationDisabledEvent.
//
// Aggregate affected:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// The aggregate is responsible for:
//
// - transitioning AuthenticationStatus to DISABLED;
// - retaining the optional failure/disable reason;
// - enforcing domain invariants;
// - recording AuthenticationDisabledEvent.
//
// The decision to disable an Authentication may originate from an application
// workflow, administrative operation, security policy, or another authorized
// process. Authorization itself does not belong to this command.
//
// This command does NOT:
//
// - validate credentials;
// - hash or compare passwords;
// - determine authentication lock thresholds;
// - lock Authentication;
// - unlock Authentication;
// - create a Session;
// - revoke Sessions;
// - create a Device;
// - validate OTPs;
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
// AuthenticationDisabledEvent.
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
  AuthenticationPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for disabling an Authentication aggregate.
 *
 * Required domain inputs:
 *
 * - authenticationPublicId;
// - correlationId.
 *
 * Optional domain inputs:
 *
 * - reason;
// - causationId.
 *
 * The following are intentionally NOT supplied:
 *
 * - AuthenticationStatus;
// - passwordHash;
// - passwordVersion;
// - failedAuthenticationCount;
// - lastFailedAuthenticationAt;
// - lockedAt;
// - lockedUntil;
// - lastAuthenticatedAt;
// - persistence/internal ID;
// - lifecycle timestamps.
 *
 * AuthenticationStatus is transitioned by the aggregate through
 * AuthenticationAggregate.disable().
 */
export class DisableAuthenticationCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identifier of the Authentication aggregate to disable.
     *
     * The command handler uses this value to load the aggregate before invoking
     * AuthenticationAggregate.disable().
     */
    public readonly authenticationPublicId: AuthenticationPublicId,

    /**
     * Optional reason explaining why the Authentication was disabled.
     *
     * The reason is retained by the Authentication entity as security/failure
     * context but is intentionally not published by AuthenticationDisabledEvent
     * according to the current event model.
     */
    public readonly reason: AuthenticationFailureReason | undefined,

    /**
     * Correlation identifier for the authentication-disable operation.
     *
     * This value is propagated to AuthenticationDisabledEvent.
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
