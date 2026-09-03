// -----------------------------------------------------------------------------
// Identity — Close Command
// -----------------------------------------------------------------------------
//
// Application command for closing an Identity aggregate.
//
// The command represents the intent to transition an Identity into the
// terminal CLOSED lifecycle state.
//
// The command does NOT:
//
// - mutate IdentityEntity directly;
// - construct IdentityEntity;
// - construct IdentityRoleEntity;
// - perform persistence;
// - emit IdentityClosedEvent directly;
// - delete the Identity record;
// - revoke authentication sessions directly;
// - delete authentication credentials;
// - remove role assignments;
// - delete verification records;
// - send notifications;
// - perform external side effects.
//
// The application handler loads the IdentityAggregate, invokes:
//
//     identityAggregate.close(...)
//
// and persists the aggregate.
//
// The aggregate is responsible for:
//
// - validating the lifecycle transition;
// - enforcing Identity invariants;
// - determining the closure timestamp;
// - changing the Identity lifecycle state;
// - recording IdentityClosedEvent.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// PENDING   ───────► CLOSED
// ACTIVE    ───────► CLOSED
// SUSPENDED ───────► CLOSED
//
// CLOSED is terminal and closing an already-closed Identity is idempotent.
//
// Closing the Identity does not directly close or mutate other aggregates.
// Authentication, sessions, verification, roles, notifications, and other
// concerns remain separate lifecycle boundaries and may react to the
// IdentityClosedEvent independently.
//
// IMPORTANT:
//
// `closedAt` is intentionally not part of this command.
//
// `closedAt` is a domain fact describing when the close mutation actually
// occurred. It is therefore determined by IdentityAggregate rather than
// supplied by the caller, DTO, controller, or application handler.
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
 * Command for closing an Identity aggregate.
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
 * The command intentionally does not contain `closedAt`.
 *
 * `closedAt` is determined by IdentityAggregate when the close mutation
 * occurs.
 *
 * The application layer is responsible for resolving the IdentityAggregate
 * from the Identity repository using `identityPublicId`.
 */
export class CloseIdentityCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity aggregate to close.
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
     * closure request.
     */
    public readonly causationId?: string,
  ) {}
}

export default CloseIdentityCommand;
