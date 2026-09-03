// -----------------------------------------------------------------------------
// Identity — Activate Command
// -----------------------------------------------------------------------------
//
// Application command for activating an Identity aggregate.
//
// The command represents the intent to transition an Identity from its
// current lifecycle state into ACTIVE.
//
// The Identity aggregate is identified exclusively by its IdentityPublicId.
//
// The command does NOT:
//
// - mutate IdentityEntity directly;
// - construct IdentityEntity;
// - construct IdentityRoleEntity;
// - perform persistence;
// - emit domain events directly;
// - activate authentication;
// - create a session;
// - perform verification;
// - send notifications.
//
// The application handler loads the IdentityAggregate using identityPublicId
// and invokes:
//
//     identityAggregate.activate()
//
// The aggregate is responsible for:
//
// - validating the lifecycle transition;
// - enforcing Identity invariants;
// - changing the Identity lifecycle state;
// - determining the activation timestamp;
// - recording IdentityActivatedEvent.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// PENDING ───────► ACTIVE
//     │
//     └───────────► ACTIVE
//                   from SUSPENDED when permitted by Identity lifecycle rules
//
// CLOSED is terminal and cannot be activated.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// `activatedAt` is intentionally NOT part of this command.
//
// Activation time is a consequence of the successful lifecycle transition,
// not caller-supplied command input.
//
// Correlation and causation metadata are intentionally NOT part of this
// command's business input. If required by the application messaging or
// domain-event infrastructure, that metadata should be handled separately
// from the activation intent.
//
// -----------------------------------------------------------------------------
//
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Identity Value Objects
// -----------------------------------------------------------------------------

import type { IdentityPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for activating an Identity aggregate.
 *
 * The command carries a domain-ready IdentityPublicId value object rather
 * than a raw transport primitive.
 *
 * DTO-to-domain conversion belongs at the presentation/application boundary.
 *
 * Required domain input:
 *
 * - identityPublicId
 *
 * No lifecycle timestamp or caller-supplied metadata is part of the
 * activation intent.
 */
export class ActivateIdentityCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identifier of the Identity aggregate to activate.
     *
     * This is an opaque public identifier and not a persistence identifier.
     */
    public readonly identityPublicId: IdentityPublicId,
  ) {}
}
