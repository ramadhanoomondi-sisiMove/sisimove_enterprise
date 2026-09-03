// -----------------------------------------------------------------------------
// Authentication — Activate Command
// -----------------------------------------------------------------------------
//
// Application command for activating an Authentication aggregate.
//
// The command represents the application-level intent:
//
//     Activate Authentication
//
// Authentication activation is a lifecycle transition:
//
//     PENDING → ACTIVE
//
// The command carries the public identifier required to locate the
// Authentication aggregate.
//
// The command handler is responsible for:
//
// - loading the Authentication aggregate;
// - invoking AuthenticationAggregate.activate();
// - persisting the updated aggregate;
// - dispatching the resulting AuthenticationActivatedEvent.
//
// Aggregate affected:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// The aggregate is responsible for:
//
// - validating whether activation is allowed;
// - transitioning AuthenticationStatus;
// - enforcing domain invariants;
// - recording AuthenticationActivatedEvent.
//
// This command does NOT:
//
// - validate credentials;
// - hash or compare passwords;
// - create a Session;
// - create a Device;
// - validate OTPs;
// - perform Identity domain validation;
// - create Recovery records;
// - send notifications;
// - perform external side effects.
//
// Those concerns belong to their respective application workflows,
// infrastructure services, and aggregate boundaries.
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
// AuthenticationActivatedEvent.
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
 * Command for activating an Authentication aggregate.
 *
 * Required domain inputs:
 *
 * - authenticationPublicId;
 * - correlationId.
 *
 * The following are intentionally NOT supplied:
 *
 * - AuthenticationStatus;
// - passwordHash;
// - passwordVersion;
// - failedAuthenticationCount;
// - lock state;
// - authentication timestamps;
// - persistence/internal ID.
 *
 * These values belong to the Authentication aggregate and are managed through
 * its lifecycle behavior.
 */
export class ActivateAuthenticationCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identifier of the Authentication aggregate to activate.
     *
     * The command handler uses this value to load the aggregate before invoking
     * AuthenticationAggregate.activate().
     */
    public readonly authenticationPublicId: AuthenticationPublicId,

    /**
     * Correlation identifier for the authentication-activation operation.
     *
     * This value is propagated to AuthenticationActivatedEvent.
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
