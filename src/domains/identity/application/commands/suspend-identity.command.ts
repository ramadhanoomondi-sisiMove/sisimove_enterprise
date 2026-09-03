// -----------------------------------------------------------------------------
// Identity — Suspend Command
// -----------------------------------------------------------------------------
//
// Application command for suspending an Identity aggregate.
//
// The command represents the intent to transition an Identity into the
// SUSPENDED lifecycle state.
//
// The command does NOT:
//
// - mutate IdentityEntity directly;
// - construct IdentityEntity;
// - construct IdentityRoleEntity;
// - perform persistence;
// - emit domain events directly;
// - revoke authentication credentials;
// - terminate sessions;
// - revoke verification;
// - send notifications;
// - perform external side effects.
//
// The application handler loads the IdentityAggregate, invokes:
//
//     identityAggregate.suspend(...)
//
// and persists the aggregate.
//
// The aggregate is responsible for:
//
// - validating the lifecycle transition;
// - enforcing Identity invariants;
// - determining the suspension timestamp;
// - changing the Identity lifecycle state;
// - recording IdentitySuspendedEvent.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// ACTIVE ───────► SUSPENDED
//
// SUSPENDED is idempotent.
// CLOSED is terminal and cannot be suspended.
//
// Authentication, sessions, verification, notifications, and other dependent
// concerns remain separate aggregate/lifecycle boundaries and may react to
// IdentitySuspendedEvent independently.
//
// IMPORTANT:
//
// `suspendedAt` is intentionally not part of this command.
//
// `suspendedAt` is a domain fact describing when the suspension mutation
// actually occurred. It is therefore determined by IdentityAggregate rather
// than supplied by the caller, DTO, controller, or application handler.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { IdentityPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for suspending an Identity aggregate.
 *
 * The command carries the public identity of the target Identity together
 * with the correlation metadata required for the lifecycle operation.
 *
 * Required domain inputs:
 *
 * - identityPublicId;
 * - correlationId.
 *
 * Optional metadata:
 *
 * - causationId.
 *
 * The command intentionally does not contain `suspendedAt`.
 *
 * `suspendedAt` is determined by IdentityAggregate when the suspension
 * mutation occurs.
 *
 * The application layer is responsible for resolving the IdentityAggregate
 * from the Identity repository using `identityPublicId`.
 */
export class SuspendIdentityCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity aggregate to suspend.
     *
     * This is an opaque public identifier and not a persistence identifier.
     */
    public readonly identityPublicId: IdentityPublicId,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * suspension request.
     */
    public readonly causationId?: string,
  ) {}
}

export default SuspendIdentityCommand;
