// -----------------------------------------------------------------------------
// Identity — Close Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for closing an Identity aggregate.
//
// Responsibilities:
//
// - Load the Identity aggregate.
// - Invoke the aggregate's closure behavior.
// - Persist the resulting aggregate state.
//
// IdentityAggregate remains responsible for:
//
// - validating the lifecycle transition;
// - enforcing Identity invariants;
// - determining closedAt;
// - changing IdentityStatus to CLOSED;
// - recording IdentityClosedEvent;
// - enforcing terminal closure and idempotency rules.
//
// This handler does NOT:
//
// - mutate IdentityEntity directly;
// - construct IdentityEntity or IdentityRoleEntity;
// - determine closedAt;
// - activate or suspend the Identity;
// - delete the Identity record;
// - directly revoke authentication credentials or sessions;
// - mutate other aggregates;
// - emit domain events directly;
// - perform external side effects.
//
// Those concerns remain within their respective application/domain boundaries.
//
// -----------------------------------------------------------------------------
//
// Flow:
//
//     CloseIdentityCommand
//             │
//             ▼
//     IdentityRepository.findByPublicId()
//             │
//             ├── not found → throw
//             │
//             ▼
//     IdentityAggregate.close(correlationId)
//             │
//             ├── validate lifecycle transition
//             ├── determine closedAt
//             ├── transition to CLOSED
//             └── record IdentityClosedEvent
//             │
//             ▼
//     IdentityRepository.save()
//             │
//             ▼
//     Return IdentityAggregate
//
// -----------------------------------------------------------------------------
//
// Domain boundary:
//
// CloseIdentityCommand already contains IdentityPublicId as a domain value
// object. The handler passes it directly to the repository.
//
// `closedAt` is a domain fact and is never supplied by this handler.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CloseIdentityCommand } from '../commands/close-identity.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { IdentityAggregate } from '../../domain/aggregates/identity.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

import { IdentityInvariantException } from '../../domain/exceptions/identity-invariant.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Closes an Identity aggregate.
 *
 * The handler performs application orchestration only. Lifecycle behavior,
 * timestamps, terminal-state enforcement, and domain-event recording remain
 * responsibilities of IdentityAggregate.
 */
@Injectable()
export class CloseIdentityHandler implements CommandHandler<
  CloseIdentityCommand,
  IdentityAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.IDENTITY)
    private readonly repository: IdentityRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the CloseIdentityCommand.
   *
   * The command carries a domain-ready IdentityPublicId and correlation ID.
   */
  public async execute(
    command: CloseIdentityCommand,
  ): Promise<IdentityAggregate> {
    // -------------------------------------------------------------------------
    // 1. Validate command
    // -------------------------------------------------------------------------

    if (command === undefined || command === null) {
      throw new IdentityInvariantException(
        'Close Identity command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Load Identity aggregate
    // -------------------------------------------------------------------------

    const identity = await this.repository.findByPublicId(
      command.identityPublicId,
    );

    // -------------------------------------------------------------------------
    // 3. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (identity === null) {
      throw new IdentityInvariantException(
        `Identity ${command.identityPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Close Identity
    // -------------------------------------------------------------------------
    //
    // Delegate all lifecycle rules to IdentityAggregate.
    //
    // Expected behavior:
    //
    // - PENDING, ACTIVE, or SUSPENDED may transition to CLOSED.
    // - CLOSED remains terminal.
    // - Repeated closure follows the aggregate's idempotency policy.
    // - closedAt is determined by the aggregate.
    // - IdentityClosedEvent is recorded by the aggregate.
    //
    // IMPORTANT:
    // This handler must never call identity.activate().
    // -------------------------------------------------------------------------

    identity.close(command.correlationId);

    // -------------------------------------------------------------------------
    // 5. Persist aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(identity);

    // -------------------------------------------------------------------------
    // 6. Return aggregate
    // -------------------------------------------------------------------------

    return identity;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CloseIdentityHandler;
