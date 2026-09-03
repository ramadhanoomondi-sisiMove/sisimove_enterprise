// -----------------------------------------------------------------------------
// Identity — Suspend Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for suspending an existing
// Identity aggregate.
//
// Responsibilities:
//
// - Resolve the IdentityAggregate by public identifier.
// - Invoke IdentityAggregate.suspend().
// - Allow the aggregate to enforce lifecycle invariants.
// - Allow the aggregate to determine suspendedAt.
// - Allow the aggregate to record IdentitySuspendedEvent.
// - Persist the updated aggregate.
//
// This handler does NOT:
//
// - Mutate IdentityEntity directly.
// - Construct IdentityEntity.
// - Construct IdentityRoleEntity.
// - Change IdentityStatus directly.
// - Determine suspendedAt.
// - Emit domain events directly.
// - Revoke authentication credentials.
// - Terminate sessions.
// - Revoke verification.
// - Send notifications.
// - Communicate with external systems.
//
// Those concerns remain within their respective aggregate/application
// boundaries.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     SuspendIdentityCommand
//              │
//              ▼
//     IdentityRepository.findByPublicId()
//              │
//              ▼
//     IdentityAggregate
//              │
//              ▼
//     aggregate.suspend(correlationId)
//              │
//              ├── lifecycle validation
//              ├── determine suspendedAt
//              ├── IdentityEntity mutation
//              └── IdentitySuspendedEvent
//              │
//              ▼
//     IdentityRepository.save()
//              │
//              ▼
//     IdentityAggregate
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

import type { SuspendIdentityCommand } from '../commands/suspend-identity.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { IdentityAggregate } from '../../domain/aggregates/identity.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

// -----------------------------------------------------------------------------
// Domain Exception
// -----------------------------------------------------------------------------

import { IdentityInvariantException } from '../../domain/exceptions/identity-invariant.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Suspends an existing Identity aggregate.
 *
 * The handler performs application orchestration only:
 *
 *     Command
 *       │
 *       ▼
 *     Load aggregate
 *       │
 *       ▼
 *     aggregate.suspend(correlationId)
 *       │
 *       ▼
 *     repository.save()
 *
 * Lifecycle validation, mutation timestamp determination, and domain event
 * recording remain inside the IdentityAggregate.
 */
@Injectable()
export class SuspendIdentityHandler implements CommandHandler<
  SuspendIdentityCommand,
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
   * Executes the Suspend Identity command.
   *
   * The aggregate is resolved using its public identity and then suspended
   * through its domain behavior.
   */
  public async execute(
    command: SuspendIdentityCommand,
  ): Promise<IdentityAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load Identity aggregate
    // -------------------------------------------------------------------------
    //
    // SuspendIdentityCommand already carries IdentityPublicId as a domain
    // value object, so no primitive-to-value-object conversion is required.
    //
    // The repository returns the complete aggregate, including its
    // aggregate-owned IdentityRoleEntity collection.
    //
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.identityPublicId,
    );

    if (aggregate === null) {
      throw new IdentityInvariantException(
        `Identity ${command.identityPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 2. Suspend Identity
    // -------------------------------------------------------------------------
    //
    // All lifecycle rules remain inside IdentityAggregate.
    //
    // The aggregate:
    //
    // - validates that suspension is permitted;
    // - rejects suspension of CLOSED identities;
    // - handles already-SUSPENDED identities idempotently;
    // - determines suspendedAt;
    // - updates IdentityEntity lifecycle state;
    // - records IdentitySuspendedEvent.
    //
    // The handler does not manipulate IdentityEntity directly and does not
    // construct a mutation timestamp.
    //
    // -------------------------------------------------------------------------

    aggregate.suspend(command.correlationId);

    // -------------------------------------------------------------------------
    // 3. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete Identity aggregate.
    //
    // IdentityRoleEntity instances remain owned by the Identity aggregate.
    //
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 4. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default SuspendIdentityHandler;
